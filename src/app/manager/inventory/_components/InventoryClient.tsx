"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInventory } from "@/hooks/useInventory";
import { BasePagination } from "@/components/layout/BasePagination";
import {
    createPaginationSearchParams,
    normalizeMeta,
    parseManagerListQuery,
    type RawSearchParams,
} from "@/app/manager/_components/query";

// Components
import InventoryTable, { type InventoryRowItem } from "./InventoryTable";
import AgingTable from "./AgingTable";
import WasteReportView from "./WasteReportView";
import InventoryAnalytics from "./InventoryAnalytics";
import InventoryFilter from "./InventoryFilter";
import AdjustStockModal from "./AdjustStockModal";
import KitchenBatchDetails from "./KitchenBatchDetails";

/* ─────────────────────────────────────────────
   Types — View Models (decoupled from API DTOs)
   ───────────────────────────────────────────── */

type InventoryTab = "summary" | "low-stock" | "aging" | "waste" | "kitchen-batches";

export type InventoryDisplayItem = InventoryRowItem & {
    warehouseId?: number;
    currentQuantity?: number;
    minStockLevel?: number;
};

interface ResponseWrapper<T> {
    data?: { items?: T[]; meta?: unknown; buckets?: AgingBuckets; kpi?: WasteKpi; details?: WasteDetail[] };
    items?: T[];
    meta?: unknown;
    buckets?: AgingBuckets;
    kpi?: WasteKpi;
    details?: WasteDetail[];
}

interface AgingBuckets {
    warning?: AgingBatchItem[];
    critical?: AgingBatchItem[];
}

interface AgingBatchItem {
    batchCode?: string;
    productName?: string;
    quantity?: number;
    expiryDate?: string;
    percentageLeft?: number;
}

interface WasteKpi {
    totalWastedQuantity: number;
    period: string;
}

interface WasteDetail {
    productName: string;
    wastedQuantity?: number;
    quantity: number;
    unit: string;
    reason?: string;
}

interface AnalyticsSummaryData {
    totalProducts?: number;
    lowStockItems?: number;
    expiringItems?: number;
}

interface FinancialLossData {
    totalLoss?: number;
}

/* ─────────────────────────────────────────────
   Mapper — API DTO → InventoryDisplayItem (View Model)
   ───────────────────────────────────────────── */

function mapToDisplayItem(item: Record<string, unknown>): InventoryDisplayItem {
    const totalQuantity = (item.totalQuantity as number) ?? (item.currentQuantity as number) ?? 0;
    const minStockLevel = (item.minStockLevel as number) ?? 10;

    let status: InventoryDisplayItem["status"] = "normal";
    if (totalQuantity <= 0) status = "out-of-stock";
    else if (totalQuantity <= minStockLevel) status = "low-stock";

    return {
        productId: (item.productId as number) || 0,
        productName: (item.productName as string) || "Sản phẩm không tên",
        sku: (item.sku as string) || "N/A",
        unit: (item.unit as string) || "N/A",
        totalQuantity,
        minStockLevel,
        status,
        warehouseName: (item.warehouseName as string) || "Kho chính",
        warehouseId: item.warehouseId as number | undefined,
        currentQuantity: item.currentQuantity as number | undefined,
    };
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */

interface InventoryClientProps {
    searchParams: RawSearchParams;
}

export default function InventoryClient({ searchParams }: InventoryClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();

    // ── 1. URL-Driven State ──
    const parsedQuery = useMemo(
        () => parseManagerListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const [activeTab, setActiveTab] = useState<InventoryTab>("summary");
    const [adjustModal, setAdjustModal] = useState<{ isOpen: boolean; item: InventoryDisplayItem | null }>({
        isOpen: false,
        item: null,
    });

    // ── 2. Data Fetching via hooks ──
    const {
        inventorySummary,
        lowStock,
        inventoryAgingReport,
        inventoryWasteReport,
        inventoryAnalyticsSummary,
        financialLossImpact,
        kitchenDetails,
    } = useInventory();

    const summaryQuery = inventorySummary({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        sortOrder: parsedQuery.sortOrder,
        ...(parsedQuery.warehouseId ? { warehouseId: parsedQuery.warehouseId } : {}),
    });

    const lowStockQuery = lowStock(parsedQuery.warehouseId);

    const agingQuery = inventoryAgingReport({ daysThreshold: 30 });
    const wasteQuery = inventoryWasteReport({
        fromDate: "2026-01-01",
        toDate: "2026-12-31",
    });

    const { data: rawStats } = inventoryAnalyticsSummary();
    const { data: rawLoss } = financialLossImpact({});

    // ── 3. Mapping API response → View Models ──
    const { items, meta } = useMemo(() => {
        const rawResponse = (activeTab === "summary" ? summaryQuery.data : lowStockQuery.data) as Record<string, unknown> | undefined;
        const rawData = rawResponse?.data || rawResponse;
        const data = Array.isArray(rawData) ? rawData : (rawData as { items?: Record<string, unknown>[] })?.items || [];
        const rawMeta = Array.isArray(rawData) ? undefined : (rawData as { meta?: unknown })?.meta;

        const mapped: InventoryDisplayItem[] = Array.isArray(data) ? data.map(mapToDisplayItem) : [];

        const search = parsedQuery.search?.toLowerCase().trim();
        const filtered = search
            ? mapped.filter(
                (i) =>
                    i.productName.toLowerCase().includes(search) ||
                    i.sku.toLowerCase().includes(search),
            )
            : mapped;

        return {
            items: filtered,
            meta: normalizeMeta(rawMeta, parsedQuery.page, parsedQuery.limit, filtered.length),
        };
    }, [activeTab, summaryQuery.data, lowStockQuery.data, parsedQuery]);

    const stats = useMemo(() => {
        const statsData = ((rawStats as { data?: AnalyticsSummaryData })?.data || rawStats) as AnalyticsSummaryData | undefined;
        const lossData = ((rawLoss as { data?: FinancialLossData })?.data || rawLoss) as FinancialLossData | undefined;
        return {
            totalProducts: statsData?.totalProducts || 0,
            lowStockCount: statsData?.lowStockItems || 0,
            expiringBatches: statsData?.expiringItems || 0,
            estimatedLossVnd: lossData?.totalLoss || 0,
        };
    }, [rawStats, rawLoss]);

    const agingData = useMemo(() => {
        const agingRaw = agingQuery.data as ResponseWrapper<unknown> | undefined;
        const buckets = agingRaw?.data?.buckets || agingRaw?.buckets;

        const mapBatch = (item: AgingBatchItem) => ({
            batchCode: item.batchCode || "N/A",
            productName: item.productName || "Sản phẩm không tên",
            quantity: item.quantity || 0,
            expiryDate: item.expiryDate || "",
            percentageLeft: item.percentageLeft ?? 100,
        });

        return {
            warning: Array.isArray(buckets?.warning) ? buckets.warning.map(mapBatch) : [],
            critical: Array.isArray(buckets?.critical) ? buckets.critical.map(mapBatch) : [],
        };
    }, [agingQuery.data]);

    const wasteData = useMemo(() => {
        const wasteRaw = wasteQuery.data as ResponseWrapper<unknown> | undefined;
        const data = wasteRaw?.data || wasteRaw;
        const kpi = data?.kpi || { totalWastedQuantity: 0, period: "N/A" };
        const details = Array.isArray(data?.details) ? data.details : [];
        return { kpi, details };
    }, [wasteQuery.data]);

    // ── 4. Handlers ──
    const handlePageChange = (nextPage: number) => {
        const query = createPaginationSearchParams(searchParamsHook, nextPage);
        router.push(`${pathname}?${query}`);
    };

    const isTableLoading = activeTab === "summary" ? summaryQuery.isLoading : lowStockQuery.isLoading;
    const isTableError = activeTab === "summary" ? summaryQuery.isError : lowStockQuery.isError;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Kiểm soát Tồn kho (Bếp trung tâm)
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tổng quan tồn kho bếp, cảnh báo FEFO và điều chỉnh theo lô.
                    </p>
                </div>
            </div>

            {/* Analytics KPI */}
            <InventoryAnalytics data={stats} />

            {/* Tabs Navigation Capsule */}
            <div className="flex bg-slate-100/80 p-1.5 rounded-lg w-fit border border-slate-200/60 shadow-sm">
                {([
                    { id: "summary" as const, label: "Tồn kho tổng" },
                    { id: "low-stock" as const, label: "Cảnh báo hết" },
                    { id: "aging" as const, label: "Hạn sử dụng" },
                    { id: "waste" as const, label: "Lãng phí" },
                ]).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                            ${activeTab === tab.id
                                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Filter Bar */}
            {["summary", "low-stock"].includes(activeTab) && (
                <InventoryFilter currentLimit={parsedQuery.limit} />
            )}

            {/* Main Content Area */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                {(activeTab === "summary" || activeTab === "low-stock") && (
                    <>
                        <InventoryTable
                            items={items}
                            isLoading={isTableLoading}
                            isError={isTableError}
                            onAdjust={(item) =>
                                setAdjustModal({ isOpen: true, item: item as InventoryDisplayItem })
                            }
                        />

                        {/* Pagination */}
                        {!isTableLoading && meta.totalPages > 1 && (
                            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                                <BasePagination
                                    currentPage={meta.currentPage}
                                    totalPages={meta.totalPages}
                                    onPageChange={handlePageChange}
                                    totalItems={meta.totalItems}
                                    itemsPerPage={meta.itemsPerPage}
                                />
                            </div>
                        )}
                    </>
                )}
                {activeTab === "aging" && (
                    <AgingTable data={agingData} isLoading={agingQuery.isLoading} />
                )}
                {activeTab === "waste" && (
                    <WasteReportView data={wasteData} isLoading={wasteQuery.isLoading} />
                )}
            </section>

            {/* Adjust Stock Modal */}
            <AdjustStockModal
                isOpen={adjustModal.isOpen}
                item={adjustModal.item}
                onClose={() => setAdjustModal({ isOpen: false, item: null })}
            />
        </div>
    );
}
