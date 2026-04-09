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
import WasteReportModal from "./WasteReportModal";

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
    const [wasteCtx, setWasteCtx] = useState<{
        batchId: number;
        batchCode: string;
        productName: string;
        unit: string;
        physicalQuantity: number;
    } | null>(null);

    const parsedQuery = useMemo(() => parseKitchenInventoryQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }), [searchParams]);

    const { kitchenSummary, inventoryAgingReport, inventoryWasteDetailReport } = useInventory();

    const listQuery = kitchenSummary({
        page: 1,
        limit: 500,
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
    const today = new Date();
    const fromDate = useMemo(() => {
        const d = new Date(today);
        d.setDate(d.getDate() - 30);
        return d.toISOString().slice(0, 10);
    }, [today]);
    const toDate = useMemo(() => today.toISOString().slice(0, 10), [today]);
    const wasteDetailQuery = inventoryWasteDetailReport({ startDate: fromDate, endDate: toDate });
    const summaryItems = listQuery.data?.items ?? [];

    const filteredItems = useMemo(() => {
        return summaryItems.filter((item) => {
            const physical = item.totalPhysical;
            if (parsedQuery.stockStatus === "out_of_stock" && physical > 0) return false;
            if (parsedQuery.stockStatus === "low_stock" && !item.isLowStock) return false;
            if (parsedQuery.stockStatus === "in_stock" && (item.isLowStock || physical <= 0)) return false;
            return true;
        });
    }, [summaryItems, parsedQuery.stockStatus]);

    const meta = useMemo(
        () =>
            normalizeKitchenInventoryMeta(
                undefined,
                parsedQuery.page,
                parsedQuery.limit,
                filteredItems.length,
            ),
        [filteredItems.length, parsedQuery.limit, parsedQuery.page],
    );

    const displayItems = useMemo(() => {
        const start = (meta.currentPage - 1) * meta.itemsPerPage;
        const end = start + meta.itemsPerPage;
        return filteredItems.slice(start, end);
    }, [filteredItems, meta.currentPage, meta.itemsPerPage]);

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
    const wasteLogs = useMemo(() => {
        const raw = wasteDetailQuery.data as
            | { data?: Array<{ transactionId?: number; batchCode?: string; productName?: string; wastedQuantity?: number; wasteReason?: string; reasonNote?: string; note?: string; createdAt?: string; createdBy?: string }> }
            | { data?: { data?: Array<{ transactionId?: number; batchCode?: string; productName?: string; wastedQuantity?: number; wasteReason?: string; reasonNote?: string; note?: string; createdAt?: string; createdBy?: string }> } }
            | undefined;
        const list = Array.isArray((raw as { data?: unknown[] })?.data)
            ? ((raw as { data?: unknown[] }).data as Array<{ transactionId?: number; batchCode?: string; productName?: string; wastedQuantity?: number; wasteReason?: string; reasonNote?: string; note?: string; createdAt?: string; createdBy?: string }>)
            : ((raw as { data?: { data?: Array<{ transactionId?: number; batchCode?: string; productName?: string; wastedQuantity?: number; wasteReason?: string; reasonNote?: string; note?: string; createdAt?: string; createdBy?: string }> } })?.data?.data ?? []);
        return list.slice(0, 8);
    }, [wasteDetailQuery.data]);

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
        [parsedQuery.limit, parsedQuery.stockStatus],
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
            <div className="mx-auto max-w-[96rem] space-y-6 p-6">
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
                        onReportWasteBatch={({ productName, unit, batch }) =>
                            setWasteCtx({
                                batchId: batch.batchId,
                                batchCode: batch.batchCode || `ID ${batch.batchId}`,
                                productName,
                                unit,
                                physicalQuantity: Number(batch.totalQuantity ?? 0),
                            })
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

                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                        <div className="border-b border-zinc-100 px-6 py-4">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                Nhật ký truy vết tiêu hủy (mới nhất)
                            </h2>
                        </div>
                        <div className="px-6 py-4">
                            {wasteDetailQuery.isLoading ? (
                                <p className="py-8 text-sm text-zinc-500">Đang tải waste-report...</p>
                            ) : wasteDetailQuery.isError ? (
                                <p className="py-8 text-sm text-red-600">Không tải được nhật ký tiêu hủy.</p>
                            ) : wasteLogs.length === 0 ? (
                                <p className="py-8 text-sm text-zinc-500">Chưa có bản ghi tiêu hủy.</p>
                            ) : (
                                <div className="space-y-2">
                                    {wasteLogs.map((row, idx) => (
                                        <div key={`${row.transactionId ?? idx}`} className="rounded-md border border-zinc-200 p-3 text-sm">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <p className="font-medium text-zinc-900">{row.productName ?? "—"}</p>
                                                <span className="text-xs text-zinc-500">
                                                    {row.createdAt ? new Date(row.createdAt).toLocaleString("vi-VN") : "—"}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-zinc-600">
                                                Lô: <span className="font-mono">{row.batchCode ?? "—"}</span> · SL hủy: {Number(row.wastedQuantity ?? 0).toLocaleString("vi-VN")}
                                            </p>
                                            <p className="mt-1 text-xs text-zinc-600">
                                                Lý do: <span className="font-medium">{row.wasteReason ?? "—"}</span> · Ghi chú: {row.reasonNote ?? row.note ?? "—"} · Người thao tác: {row.createdBy ?? "—"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                {wasteCtx && (
                    <WasteReportModal
                        open
                        onOpenChange={(o) => {
                            if (!o) setWasteCtx(null);
                        }}
                        batchId={wasteCtx.batchId}
                        batchCode={wasteCtx.batchCode}
                        productName={wasteCtx.productName}
                        unit={wasteCtx.unit}
                        physicalQuantity={wasteCtx.physicalQuantity}
                    />
                )}
            </div>
        </div>
    );
}
