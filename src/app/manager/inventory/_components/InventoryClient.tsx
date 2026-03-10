"use client";

import { useMemo, useState, useEffect } from "react";
import { useInventory } from "@/hooks/useInventory";

// Components
import InventoryTable from "./InventoryTable";
import AgingTable from "./AgingTable";
import WasteReportView from "./WasteReportView";
import InventoryAnalytics from "./InventoryAnalytics";
import InventoryFilter, { InventoryFilterValues } from "./InventoryFilter";
import AdjustStockModal from "./AdjustStockModal";

/** Tab ID union type */
type InventoryTab = "summary" | "low-stock" | "aging" | "waste";

/** Cấu trúc item inventoryRow hiển thị trên bảng */
export interface InventoryDisplayItem {
  productId: number;
  productName: string;
  sku: string;
  totalQuantity: number;
  minStockLevel?: number;
  status: "normal" | "low-stock" | "out-of-stock";
  warehouseName?: string;
  unit: string;
  currentQuantity?: number;
  [key: string]: unknown;
}

/** Cấu trúc response wrapper (defensive) */
interface ResponseWrapper<T> {
  data?: { items?: T[]; buckets?: AgingBuckets; kpi?: WasteKpi; details?: WasteDetail[] };
  items?: T[];
  buckets?: AgingBuckets;
  kpi?: WasteKpi;
  details?: WasteDetail[];
}

/** Cấu trúc aging bucket */
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

/** Analytics Summary */
interface AnalyticsSummaryData {
  totalProducts?: number;
  lowStockItems?: number;
  expiringItems?: number;
}

/** Financial loss */
interface FinancialLossData {
  totalLoss?: number;
}

interface InventoryParams {
  page: number;
  limit: number;
  search: string;
  warehouseId: string | number;
}

export default function InventoryClient() {
  // 1. Quản lý Trạng thái (Tab & Bộ lọc)
  const [activeTab, setActiveTab] = useState<InventoryTab>("summary");
  const [params, setParams] = useState<InventoryParams>({
    page: 1,
    limit: 10,
    search: "",
    warehouseId: "",
  });
  const [debouncedParams, setDebouncedParams] = useState(params);

  // State quản lý Modal điều chỉnh tồn kho
  const [adjustModal, setAdjustModal] = useState<{ isOpen: boolean; item: InventoryDisplayItem | null }>({
    isOpen: false,
    item: null,
  });

  // 2. Lấy tài nguyên từ Hook
  const {
    inventorySummary,
    lowStock,
    inventoryAgingReport,
    inventoryWasteReport,
    inventoryAnalyticsSummary,
    financialLossImpact,
  } = useInventory();

  // 3. Cơ chế Debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedParams(params), 400);
    return () => clearTimeout(handler);
  }, [params]);

  /**
   * 4. SAFE QUERY
   */
  const safeQuery = useMemo(
    () => ({
      page: debouncedParams.page,
      limit: debouncedParams.limit,
      sortOrder: "DESC" as const,
      ...(debouncedParams.warehouseId && {
        warehouseId: Number(debouncedParams.warehouseId),
      }),
    }),
    [debouncedParams],
  );

  // 5. Thực thi các Queries tương ứng
  const summaryQuery = inventorySummary(safeQuery);
  const lowStockQuery = lowStock(
    debouncedParams.warehouseId
      ? Number(debouncedParams.warehouseId)
      : undefined,
  );
  const agingQuery = inventoryAgingReport({ daysThreshold: 30 });
  const wasteQuery = inventoryWasteReport({
    fromDate: "2026-01-01",
    toDate: "2026-12-31",
  });

  const { data: rawStats } = inventoryAnalyticsSummary();
  const { data: rawLoss } = financialLossImpact({});

  /**
   * 6. MAPPING DỮ LIỆU & CLIENT-SIDE SEARCH
   */
  const items = useMemo(() => {
    const rawData = (activeTab === "summary" ? summaryQuery.data : lowStockQuery.data) as ResponseWrapper<Record<string, unknown>> | undefined;
    const data = rawData?.data?.items || rawData?.items || [];
    const result: InventoryDisplayItem[] = Array.isArray(data) ? data.map((item) => {
      const totalQuantity = (item.totalQuantity as number) ?? (item.currentQuantity as number) ?? 0;
      const minStockLevel = (item.minStockLevel as number) ?? 10;
      let status: "normal" | "low-stock" | "out-of-stock" = "normal";
      if (totalQuantity <= 0) status = "out-of-stock";
      else if (totalQuantity <= minStockLevel) status = "low-stock";

      return {
        ...item,
        productId: (item.productId as number) || 0,
        productName: (item.productName as string) || "Sản phẩm không tên",
        sku: (item.sku as string) || "N/A",
        unit: (item.unit as string) || "N/A",
        totalQuantity,
        status,
        warehouseName: (item.warehouseName as string) || "Kho chính",
      };
    }) : [];

    if (!debouncedParams.search.trim()) return result;
    const s = debouncedParams.search.toLowerCase().trim();
    return result.filter(
      (i) =>
        i.productName?.toLowerCase().includes(s) ||
        i.sku?.toLowerCase().includes(s),
    );
  }, [
    activeTab,
    summaryQuery.data,
    lowStockQuery.data,
    debouncedParams.search,
  ]);

  const stats = useMemo(
    () => {
      const statsData = ((rawStats as { data?: AnalyticsSummaryData })?.data || rawStats) as AnalyticsSummaryData | undefined;
      const lossData = ((rawLoss as { data?: FinancialLossData })?.data || rawLoss) as FinancialLossData | undefined;
      return {
        totalProducts: statsData?.totalProducts || 0,
        lowStockCount: statsData?.lowStockItems || 0,
        expiringBatches: statsData?.expiringItems || 0,
        estimatedLossVnd: lossData?.totalLoss || 0,
      };
    },
    [rawStats, rawLoss],
  );

  const agingData = useMemo(
    () => {
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
    },
    [agingQuery.data],
  );

  const wasteData = useMemo(
    () => {
      const wasteRaw = wasteQuery.data as ResponseWrapper<unknown> | undefined;
      const data = wasteRaw?.data || wasteRaw;
      const kpi = data?.kpi || {
        totalWastedQuantity: 0,
        period: "N/A"
      };
      const details = Array.isArray(data?.details) ? data.details : [];
      return { kpi, details };
    },
    [wasteQuery.data],
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="px-1 space-y-1">
        <h1 className="text-2xl font-black font-display tracking-wider uppercase text-text-main leading-none">
          Inventory Dashboard
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
          Manager Portal • Điều phối &amp; Kiểm soát lãng phí
        </p>
      </div>

      {/* Analytics KPI */}
      <InventoryAnalytics data={stats} />

      {/* Tabs Navigation Capsule */}
      <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-[2rem] w-fit shadow-sm">
        {([
          { id: "summary" as const, label: "Tồn kho tổng" },
          { id: "low-stock" as const, label: "Cảnh báo hết" },
          { id: "aging" as const, label: "Hạn sử dụng" },
          { id: "waste" as const, label: "Lãng phí" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300
              ${activeTab === tab.id
                ? "bg-slate-950 text-white shadow-xl scale-[1.05]"
                : "text-slate-400 hover:text-slate-900"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar (Chỉ hiện cho Tab Tồn kho & Cảnh báo) */}
      {["summary", "low-stock"].includes(activeTab) && (
        <InventoryFilter
          filters={params}
          onFilterChange={(u: Partial<InventoryFilterValues>) =>
            setParams((p) => ({ ...p, ...u, page: 1 }))
          }
        />
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[550px]">
        {activeTab === "summary" && (
          <InventoryTable
            items={items}
            isLoading={summaryQuery.isLoading}
            onAdjust={(item: InventoryDisplayItem) => setAdjustModal({ isOpen: true, item })}
          />
        )}
        {activeTab === "low-stock" && (
          <InventoryTable
            items={items}
            isLoading={lowStockQuery.isLoading}
            onAdjust={(item: InventoryDisplayItem) => setAdjustModal({ isOpen: true, item })}
          />
        )}
        {activeTab === "aging" && (
          <AgingTable data={agingData} isLoading={agingQuery.isLoading} />
        )}
        {activeTab === "waste" && (
          <WasteReportView data={wasteData} isLoading={wasteQuery.isLoading} />
        )}
      </div>

      {/* Modal Lệnh Điều Chỉnh */}
      <AdjustStockModal
        isOpen={adjustModal.isOpen}
        item={adjustModal.item}
        onClose={() => setAdjustModal({ isOpen: false, item: null })}
      />
    </div>
  );
}
