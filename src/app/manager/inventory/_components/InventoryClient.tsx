"use client";

import { useMemo, useState, useEffect } from "react";
import { useInventory } from "@/hooks/useInventory";
import {
  InventorySummaryItem,
  LowStockItem,
  InventoryAgingReport,
  InventoryWasteReport,
  InventoryAnalyticsSummary,
  FinancialLossImpact
} from "@/types/inventory";

// Components
import InventoryTable from "./InventoryTable";
import AgingTable from "./AgingTable";
import WasteReportView from "./WasteReportView";
import InventoryAnalytics from "./InventoryAnalytics";
import InventoryFilter from "./InventoryFilter";
import AdjustStockModal from "./AdjustStockModal";

export default function InventoryClient() {
  // 1. Quản lý Trạng thái (Tab & Bộ lọc)
  const [activeTab, setActiveTab] = useState<
    "summary" | "low-stock" | "aging" | "waste"
  >("summary");
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    warehouseId: "",
  });
  const [debouncedParams, setDebouncedParams] = useState(params);

  // State quản lý Modal điều chỉnh tồn kho
  const [adjustModal, setAdjustModal] = useState<{ isOpen: boolean, item: any | null }>({
    isOpen: false,
    item: null,
  });

  // 2. Lấy tài nguyên từ Hook (Khớp chính xác tên hàm Hàn đã định nghĩa)
  const {
    inventorySummary,
    lowStock,
    inventoryAgingReport,
    inventoryWasteReport,
    inventoryAnalyticsSummary,
    financialLossImpact,
  } = useInventory();

  // 3. Cơ chế Debounce để tối ưu hiệu năng lọc
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedParams(params), 400);
    return () => clearTimeout(handler);
  }, [params]);

  /**
   * 4. SAFE QUERY: "Vệ sinh" tham số
   * Loại bỏ 'search' vì Backend báo lỗi 400.
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
    const rawData: any = activeTab === "summary" ? summaryQuery.data : lowStockQuery.data;
    const data = rawData?.data?.items || rawData?.items || rawData || [];
    const result = Array.isArray(data) ? data.map((item: any) => {
      const totalQuantity = item.totalQuantity ?? item.currentQuantity ?? 0;
      const minStockLevel = item.minStockLevel ?? 10;
      let status: "normal" | "low-stock" | "out-of-stock" = "normal";
      if (totalQuantity <= 0) status = "out-of-stock";
      else if (totalQuantity <= minStockLevel) status = "low-stock";

      return {
        ...item,
        totalQuantity,
        status,
        warehouseName: item.warehouseName || "Kho chính",
      };
    }) : [];

    if (!debouncedParams.search.trim()) return result;
    const s = debouncedParams.search.toLowerCase().trim();
    return result.filter(
      (i: any) =>
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
      // Use rawStats directly since it matches InventoryAnalyticsSummary
      const statsData = (rawStats as any)?.data || rawStats;
      const lossData = (rawLoss as any)?.data || rawLoss;
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
      const buckets = (agingQuery.data as any)?.data?.buckets || (agingQuery.data as any)?.buckets;
      const mapBatch = (item: any) => ({
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
      const data = (wasteQuery.data as any)?.data || wasteQuery.data;
      const kpi = data?.kpi || {
        totalWastedQuantity: 0,
        period: "N/A"
      };
      const details = Array.isArray(data?.details) ? data.details : [];
      return { kpi, details };
    },
    [wasteQuery.data],
  );

  const isLoading =
    summaryQuery.isLoading ||
    lowStockQuery.isLoading ||
    agingQuery.isLoading ||
    wasteQuery.isLoading;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="px-1 space-y-1">
        <h1 className="text-2xl font-black font-display tracking-wider uppercase text-text-main leading-none">
          Inventory Dashboard
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
          Manager Portal • Điều phối & Kiểm soát lãng phí
        </p>
      </div>

      {/* Analytics KPI */}
      <InventoryAnalytics data={stats} />

      {/* Tabs Navigation Capsule */}
      <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-[2rem] w-fit shadow-sm">
        {[
          { id: "summary", label: "Tồn kho tổng" },
          { id: "low-stock", label: "Cảnh báo hết" },
          { id: "aging", label: "Hạn sử dụng" },
          { id: "waste", label: "Lãng phí" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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
          onFilterChange={(u: any) =>
            setParams((p: any) => ({ ...p, ...u, page: 1 }))
          }
        />
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[550px]">
        {activeTab === "summary" && (
          <InventoryTable
            items={items}
            isLoading={summaryQuery.isLoading}
            onAdjust={(item: any) => setAdjustModal({ isOpen: true, item })}
          />
        )}
        {activeTab === "low-stock" && (
          <InventoryTable
            items={items}
            isLoading={lowStockQuery.isLoading}
            onAdjust={(item: any) => setAdjustModal({ isOpen: true, item })}
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
