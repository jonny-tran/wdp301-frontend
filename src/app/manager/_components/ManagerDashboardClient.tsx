"use client";

import { useMemo } from "react";
import { useOrder } from "@/hooks/useOrder";
import { useInventory } from "@/hooks/useInventory";
import { useClaim } from "@/hooks/useClaim";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, PackageSearch, AlertTriangle, Clock3, TrendingUp, ShieldAlert } from "lucide-react";

type ResponseWrapper<T> = {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: unknown;
};

type AgingBuckets = {
  warning?: AgingBatchItem[];
  critical?: AgingBatchItem[];
};

type AgingBatchItem = {
  batchCode?: string;
  productName?: string;
  quantity?: number;
  expiryDate?: string;
  daysUntilExpiry?: number;
  status?: string;
};

export default function ManagerDashboardClient() {
  const { fillRateAnalytics, slaPerformanceLeadTime } = useOrder();
  const { inventoryAnalyticsSummary, inventoryAgingReport } = useInventory();
  const { claimAnalyticsSummary } = useClaim();

  const { data: rawFill } = fillRateAnalytics({});
  const { data: rawLead } = slaPerformanceLeadTime({});
  const { data: rawInventoryStats } = inventoryAnalyticsSummary();
  const { data: rawAging } = inventoryAgingReport({ daysThreshold: 7 });
  const { data: rawClaimStats } = claimAnalyticsSummary({});

  const ordersAnalytics = useMemo(() => {
    const fill = (rawFill as ResponseWrapper<any> | undefined)?.data || rawFill;
    const lead = (rawLead as ResponseWrapper<any> | undefined)?.data || rawLead;

    return {
      fillRate: fill?.fillRate ?? 0,
      totalOrdered: fill?.totalOrdered ?? 0,
      totalApproved: fill?.totalApproved ?? 0,
      avgLeadTime: lead?.totalLeadTime ?? 0,
      leadUnit: lead?.unit ?? "h",
    };
  }, [rawFill, rawLead]);

  const inventoryAnalytics = useMemo(() => {
    const stats = (rawInventoryStats as ResponseWrapper<any> | undefined)?.data || rawInventoryStats;

    return {
      totalProducts: stats?.totalProducts ?? 0,
      totalBatches: stats?.totalBatches ?? 0,
      lowStockItems: stats?.lowStockItems ?? 0,
      expiringItems: stats?.expiringItems ?? 0,
      totalValue: stats?.totalValue ?? 0,
    };
  }, [rawInventoryStats]);

  const claimAnalytics = useMemo(() => {
    const stats = (rawClaimStats as ResponseWrapper<any> | undefined)?.data || rawClaimStats;

    return {
      totalShipments: stats?.totalShipments ?? 0,
      totalClaims: stats?.totalClaims ?? 0,
      damageRate: stats?.damageRate ?? 0,
      missingRate: stats?.missingRate ?? 0,
    };
  }, [rawClaimStats]);

  const fefoAlerts = useMemo(() => {
    const aging = (rawAging as ResponseWrapper<any> | undefined)?.data || rawAging;
    const buckets: AgingBuckets = aging?.buckets || aging || {};

    const warning = Array.isArray(buckets.warning) ? buckets.warning : [];
    const critical = Array.isArray(buckets.critical) ? buckets.critical : [];

    const combined = [...critical, ...warning] as AgingBatchItem[];

    return combined.slice(0, 6);
  }, [rawAging]);

  return (
    <div className="space-y-8">
      {/* Top analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Analytics */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Hiệu suất Đơn hàng</CardTitle>
              <CardDescription className="text-xs">
                Tỉ lệ đáp ứng và thời gian xử lý đơn
              </CardDescription>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Fill Rate</p>
              <p className="text-2xl font-semibold text-slate-900">
                {ordersAnalytics.fillRate.toFixed(1)}%
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {ordersAnalytics.totalApproved.toLocaleString()} /{" "}
                {ordersAnalytics.totalOrdered.toLocaleString()} đã được duyệt
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Lead time trung bình</p>
              <p className="text-2xl font-semibold text-slate-900">
                {ordersAnalytics.avgLeadTime.toFixed(1)}
                <span className="text-xs text-slate-500 ml-1">
                  {ordersAnalytics.leadUnit}
                </span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Từ duyệt đơn đến giao hoàn tất
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Analytics */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Tổng quan Tồn kho</CardTitle>
              <CardDescription className="text-xs">
                Sản phẩm, lô hàng và cảnh báo tồn thấp
              </CardDescription>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
              <PackageSearch className="h-5 w-5 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Sản phẩm</p>
              <p className="text-xl font-semibold text-slate-900">
                {inventoryAnalytics.totalProducts.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-500">
                {inventoryAnalytics.totalBatches.toLocaleString()} lô đang hoạt động
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Cảnh báo</p>
              <p className="text-xl font-semibold text-amber-600">
                {inventoryAnalytics.lowStockItems.toLocaleString()}{" "}
                <span className="text-xs text-slate-500 font-normal">sắp hết hàng</span>
              </p>
              <p className="text-[11px] text-rose-600">
                {inventoryAnalytics.expiringItems.toLocaleString()} lô sắp hết hạn
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Claims Analytics */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Sai lệch & Khiếu nại</CardTitle>
              <CardDescription className="text-xs">
                Tỷ lệ hư hỏng, thiếu hàng theo shipment
              </CardDescription>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Damage rate</p>
              <p className="text-xl font-semibold text-rose-600">
                {claimAnalytics.damageRate.toFixed(2)}%
              </p>
              <p className="text-[11px] text-slate-500">
                trên {claimAnalytics.totalShipments.toLocaleString()} shipment
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Missing rate</p>
              <p className="text-xl font-semibold text-amber-600">
                {claimAnalytics.missingRate.toFixed(2)}%
              </p>
              <p className="text-[11px] text-slate-500">
                {claimAnalytics.totalClaims.toLocaleString()} khiếu nại đang ghi nhận
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FEFO Alert + Trend row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FEFO Alert */}
        <Card className="bg-slate-50 border-slate-200 lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                FEFO Alert – Lô sắp hết hạn (&lt; 7 ngày)
              </CardTitle>
              <CardDescription className="text-xs">
                Ưu tiên xuất kho theo FEFO để giảm hủy hàng, tập trung vào các lô quan trọng.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="max-h-[48vh] overflow-y-auto pr-1">
            {fefoAlerts.length === 0 ? (
              <p className="text-sm text-slate-500">
                Hiện chưa có lô hàng nào nằm trong ngưỡng cảnh báo &lt; 7 ngày.
              </p>
            ) : (
              <div className="space-y-2">
                {fefoAlerts.map((batch, index) => {
                  const isCritical = (batch.status || "").toLowerCase() === "critical";
                  const badgeColor = isCritical
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-amber-50 text-amber-700 border-amber-200";

                  return (
                    <div
                      key={`${batch.batchCode}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {batch.productName || "Sản phẩm không tên"}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Batch{" "}
                          <span className="font-medium text-slate-700">
                            {batch.batchCode || "N/A"}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-4">
                        {typeof batch.daysUntilExpiry === "number" && (
                          <span className="text-sm font-semibold text-slate-900">
                            {batch.daysUntilExpiry} ngày
                          </span>
                        )}
                        {batch.expiryDate && (
                          <span className="text-[11px] text-slate-500">
                            HSD: {new Date(batch.expiryDate).toLocaleDateString("vi-VN")}
                          </span>
                        )}
                        <span
                          className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeColor}`}
                        >
                          {isCritical ? "Critical" : "Warning"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right-side trend card */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="space-y-1 pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-slate-700" />
              Xu hướng tổng hợp
            </CardTitle>
            <CardDescription className="text-xs">
              Snapshot nhanh về sức khỏe chuỗi cung ứng theo ngày.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Tỉ lệ đơn đáp ứng</span>
              <span className="font-semibold text-slate-900">
                {ordersAnalytics.fillRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Lô sắp hết hạn (&lt; 7 ngày)</span>
              <span className="font-semibold text-amber-700">
                {fefoAlerts.length.toLocaleString()} lô
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Khiếu nại đang theo dõi</span>
              <span className="font-semibold text-rose-700">
                {claimAnalytics.totalClaims.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <Clock3 className="h-4 w-4" />
              Dữ liệu realtime từ module Orders, Inventory và Claims.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

