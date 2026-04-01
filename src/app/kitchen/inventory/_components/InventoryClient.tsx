"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BaseFilter, { type FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { useInventory } from "@/hooks/useInventory";
import type { RawSearchParams } from "@/app/kitchen/_components/query";
import type { KitchSummary } from "@/types/inventory";
import { normalizeInventoryAgingReportFromApi } from "@/lib/kitchen-inventory-mapper";
import {
    createPaginationSearchParams,
    normalizeKitchenInventoryMeta,
    parseKitchenInventoryQuery,
} from "./inventoryQuery";
import InventoryStats from "./InventoryStats";
import InventorySummaryTable from "./InventorySummaryTable";
import StockAdjustmentModal from "./StockAdjustmentModal";
import TransactionHistoryTable from "./TransactionHistoryTable";

type MainTab = "stock" | "history";

type AdjustContext = {
    productId: number;
    productName: string;
    unit: string;
    initialBatchId?: number | null;
};

interface InventoryClientProps {
    searchParams: RawSearchParams;
}

export default function InventoryClient({ searchParams }: InventoryClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();

    const [mainTab, setMainTab] = useState<MainTab>("stock");
    const [expandedProductIds, setExpandedProductIds] = useState<Set<number>>(() => new Set());
    const [txPage, setTxPage] = useState(1);

    const [adjustOpen, setAdjustOpen] = useState(false);
    const [adjustCtx, setAdjustCtx] = useState<AdjustContext | null>(null);

    const parsedQuery = useMemo(() => parseKitchenInventoryQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }), [searchParams]);

    const { kitchenSummary, inventoryAgingReport, inventoryTransactions } = useInventory();

    const listQuery = kitchenSummary({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        search: parsedQuery.search,
        sortOrder: parsedQuery.sortOrder,
    });

    const kpiQuery = kitchenSummary({
        page: 1,
        limit: 500,
        search: undefined,
        sortOrder: "DESC",
    });

    const agingQuery = inventoryAgingReport({ daysThreshold: 7 });

    const txQuery = inventoryTransactions(
        { page: txPage, limit: 10, sortOrder: "DESC" },
        { enabled: mainTab === "history" },
    );

    const summaryItems = listQuery.data?.items ?? [];
    const meta = useMemo(
        () => normalizeKitchenInventoryMeta(listQuery.data?.meta, parsedQuery.page, parsedQuery.limit, summaryItems.length),
        [parsedQuery.limit, parsedQuery.page, summaryItems.length, listQuery.data?.meta],
    );

    const txItems = txQuery.data?.items ?? [];
    const txMeta = useMemo(
        () => normalizeKitchenInventoryMeta(txQuery.data?.meta, txPage, 10, txItems.length),
        [txPage, txItems.length, txQuery.data?.meta],
    );

    const categoryOptions = useMemo(() => {
        const s = new Set<string>();
        summaryItems.forEach((i) => {
            s.add(i.categoryName?.trim() || "Không phân loại");
        });
        return [...s].sort((a, b) => a.localeCompare(b, "vi"));
    }, [summaryItems]);

    const displayItems = useMemo(() => {
        return summaryItems.filter((item) => {
            const physical = item.totalPhysical;
            if (parsedQuery.stockStatus === "out_of_stock" && physical > 0) return false;
            if (parsedQuery.stockStatus === "low_stock" && !item.isLowStock) return false;
            if (parsedQuery.stockStatus === "in_stock" && (item.isLowStock || physical <= 0)) return false;

            if (parsedQuery.category !== "all") {
                const cat = item.categoryName?.trim() || "Không phân loại";
                if (cat !== parsedQuery.category) return false;
            }
            return true;
        });
    }, [summaryItems, parsedQuery.stockStatus, parsedQuery.category]);

    const nearExpiryStats = useMemo(() => {
        if (agingQuery.isError) return { count: null as number | null, unavailable: true };
        if (!agingQuery.data && agingQuery.isLoading) return { count: null as number | null, unavailable: false };
        const rows = normalizeInventoryAgingReportFromApi(agingQuery.data);
        const n = rows.filter((row) => row.daysUntilExpiry >= 0 && row.daysUntilExpiry < 7).length;
        return { count: n, unavailable: false };
    }, [agingQuery.data, agingQuery.isError, agingQuery.isLoading]);

    const kpiItems = kpiQuery.data?.items ?? [];
    const totalSkus = kpiQuery.data?.meta?.totalItems ?? kpiItems.length;
    const outOfStockSkus = useMemo(() => kpiItems.filter((i) => i.totalPhysical <= 0).length, [kpiItems]);

    const filterConfig: FilterConfig[] = useMemo(
        () => [
            {
                key: "search",
                label: "Tìm kiếm",
                type: "text",
                placeholder: "SKU hoặc tên sản phẩm…",
                className: "min-w-[220px]",
            },
            {
                key: "stockStatus",
                label: "Tồn kho",
                type: "select",
                defaultValue: parsedQuery.stockStatus === "all" ? "all" : parsedQuery.stockStatus,
                options: [
                    { label: "Còn hàng (đủ)", value: "in_stock" },
                    { label: "Tồn thấp", value: "low_stock" },
                    { label: "Hết hàng", value: "out_of_stock" },
                ],
                placeholder: "Tất cả",
            },
            {
                key: "category",
                label: "Danh mục",
                type: "select",
                defaultValue: parsedQuery.category === "all" ? "all" : parsedQuery.category,
                options: categoryOptions.map((c) => ({ label: c, value: c })),
                placeholder: "Tất cả",
            },
            {
                key: "limit",
                label: "Số dòng",
                type: "select",
                defaultValue: String(parsedQuery.limit),
                options: [
                    { label: "10", value: "10" },
                    { label: "20", value: "20" },
                    { label: "50", value: "50" },
                ],
            },
        ],
        [categoryOptions, parsedQuery.category, parsedQuery.limit, parsedQuery.stockStatus],
    );

    const handlePageChange = (nextPage: number) => {
        const query = createPaginationSearchParams(searchParamsHook, { page: nextPage });
        router.push(`${pathname}?${query}`);
    };

    const toggleExpand = (productId: number) => {
        setExpandedProductIds((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) next.delete(productId);
            else next.add(productId);
            return next;
        });
    };

    const openAdjust = (ctx: AdjustContext) => {
        setAdjustCtx(ctx);
        setAdjustOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 px-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Tồn kho bếp trung tâm</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Theo dõi theo sản phẩm, mở rộng theo lô (FEFO). Điều chỉnh tay qua API{" "}
                        <code className="rounded bg-slate-100 px-1 text-xs">POST /inventory/adjust</code>.
                    </p>
                </div>
            </div>

            <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                <button
                    type="button"
                    onClick={() => setMainTab("stock")}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                        mainTab === "stock" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    Tồn hiện tại
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setMainTab("history");
                        setTxPage(1);
                    }}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                        mainTab === "history" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    Nhật ký giao dịch
                </button>
            </div>

            {mainTab === "stock" && (
                <>
                    <InventoryStats
                        totalSkus={totalSkus}
                        nearExpiryBatches={nearExpiryStats.count}
                        nearExpiryLoading={agingQuery.isLoading}
                        nearExpiryUnavailable={nearExpiryStats.unavailable}
                        outOfStockSkus={outOfStockSkus}
                    />

                    <BaseFilter filters={filterConfig} />

                    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40">
                        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Bảng tổng hợp</h2>
                        </div>

                        <InventorySummaryTable
                            items={displayItems}
                            expandedProductIds={expandedProductIds}
                            onToggleExpand={toggleExpand}
                            onAdjustBatch={({ productId, productName, unit, batch }) =>
                                openAdjust({ productId, productName, unit, initialBatchId: batch.batchId })
                            }
                            onAdjustProduct={(p: KitchSummary) =>
                                openAdjust({ productId: p.productId, productName: p.productName, unit: p.unit })
                            }
                            isLoading={listQuery.isLoading}
                            isError={listQuery.isError}
                        />

                        <div className="border-t border-slate-100 px-6 py-4">
                            <BasePagination
                                currentPage={meta.currentPage}
                                totalPages={meta.totalPages}
                                onPageChange={handlePageChange}
                                totalItems={meta.totalItems}
                                itemsPerPage={meta.itemsPerPage}
                            />
                        </div>
                    </div>
                </>
            )}

            {mainTab === "history" && (
                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/40">
                    <h2 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                        Audit trail — GET /inventory/transactions
                    </h2>
                    <TransactionHistoryTable
                        items={txItems}
                        meta={txMeta}
                        isLoading={txQuery.isLoading}
                        isError={txQuery.isError}
                        onPageChange={setTxPage}
                    />
                </div>
            )}

            <StockAdjustmentModal
                open={adjustOpen}
                onOpenChange={(o) => {
                    setAdjustOpen(o);
                    if (!o) setAdjustCtx(null);
                }}
                productId={adjustCtx?.productId ?? null}
                productName={adjustCtx?.productName ?? ""}
                unit={adjustCtx?.unit ?? ""}
                initialBatchId={adjustCtx?.initialBatchId}
            />
        </div>
    );
}
