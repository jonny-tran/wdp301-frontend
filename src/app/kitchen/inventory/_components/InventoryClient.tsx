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

    const [expandedProductIds, setExpandedProductIds] = useState<Set<number>>(() => new Set());

    const [adjustOpen, setAdjustOpen] = useState(false);
    const [adjustCtx, setAdjustCtx] = useState<AdjustContext | null>(null);

    const parsedQuery = useMemo(() => parseKitchenInventoryQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }), [searchParams]);

    const { kitchenSummary, inventoryAgingReport } = useInventory();

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

    const summaryItems = listQuery.data?.items ?? [];
    const meta = useMemo(
        () => normalizeKitchenInventoryMeta(listQuery.data?.meta, parsedQuery.page, parsedQuery.limit, summaryItems.length),
        [parsedQuery.limit, parsedQuery.page, summaryItems.length, listQuery.data?.meta],
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
        <div className="min-h-screen bg-zinc-50">
            <div className="mx-auto max-w-7xl space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                            Quản lý Tồn kho
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            Theo dõi tồn kho theo sản phẩm, mở rộng chi tiết theo lô (FEFO).
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <InventoryStats
                    totalSkus={totalSkus}
                    nearExpiryBatches={nearExpiryStats.count}
                    nearExpiryLoading={agingQuery.isLoading}
                    nearExpiryUnavailable={nearExpiryStats.unavailable}
                    outOfStockSkus={outOfStockSkus}
                />

                {/* Filter Bar */}
                <BaseFilter filters={filterConfig} />

                {/* Summary Table */}
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                    <div className="border-b border-zinc-100 px-6 py-4">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                            Bảng tổng hợp tồn kho
                        </h2>
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

                    <div className="border-t border-zinc-100 px-6 py-4">
                        <BasePagination
                            currentPage={meta.currentPage}
                            totalPages={meta.totalPages}
                            onPageChange={handlePageChange}
                            totalItems={meta.totalItems}
                            itemsPerPage={meta.itemsPerPage}
                        />
                    </div>
                </div>

                {/* Stock Adjustment Modal */}
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
        </div>
    );
}
