/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import { useOrder } from "@/hooks/useOrder";
import { useInventory } from "@/hooks/useInventory";
import { useClaim } from "@/hooks/useClaim";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart3,
  PackageSearch,
  AlertTriangle,
  Clock3,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

export default function ManagerDashboardClient() {
  const { fillRateAnalytics, slaPerformanceLeadTime } = useOrder();
  const { inventoryAnalyticsSummary, inventoryAgingReport } = useInventory();
  const { claimAnalyticsSummary } = useClaim();

  // Fetch dữ liệu từ Hooks
  const { data: rawFill } = fillRateAnalytics({});
  const { data: rawLead } = slaPerformanceLeadTime({});
  const { data: rawInventoryStats } = inventoryAnalyticsSummary();
  const { data: rawAging } = inventoryAgingReport({ daysThreshold: 7 });
  const { data: rawClaimStats } = claimAnalyticsSummary({});

  // 1. MAPPING ORDERS ANALYTICS - FIX TS PROPERTY 'DATA'
  const ordersAnalytics = useMemo(() => {
    const fill = (rawFill as any)?.data || rawFill;
    const lead = (rawLead as any)?.data || rawLead;

    return {
      fillRate: fill?.kpi?.fillRatePercentage ?? 0,
      totalOrdered: fill?.kpi?.totalRequestedQty ?? 0,
      totalApproved: fill?.kpi?.totalApprovedQty ?? 0,
      avgLeadTime: lead?.kpi?.avgReviewTimeHours ?? 0,
      leadUnit: "h",
    };
  }, [rawFill, rawLead]);

  // 2. MAPPING INVENTORY ANALYTICS - FIX TS PROPERTY 'DATA'
  const inventoryAnalytics = useMemo(() => {
    const stats = (rawInventoryStats as any)?.data || rawInventoryStats;

    return {
      totalProducts: stats?.overview?.totalProducts ?? 0,
      lowStockItems: stats?.overview?.totalLowStockItems ?? 0,
      expiringItems: stats?.overview?.totalExpiringBatches ?? 0,
    };
  }, [rawInventoryStats]);

  // 3. MAPPING CLAIMS ANALYTICS - FIX TS PROPERTY 'DATA'
  const claimAnalytics = useMemo(() => {
    const stats = (rawClaimStats as any)?.data || rawClaimStats;

    return {
      totalShipments: stats?.kpi?.totalShipments ?? 0,
      totalClaims: stats?.kpi?.shipmentsWithMissing ?? 0,
      damageRate: stats?.kpi?.damageRatePercentage ?? 0,
      missingRate: stats?.kpi?.missingRatePercentage ?? 0,
    };
  }, [rawClaimStats]);

  // 4. MAPPING FEFO ALERTS - FIX TS PROPERTY 'DATA' & LOGIC
  const fefoAlerts = useMemo(() => {
    const aging = (rawAging as any)?.data || rawAging;
    const warning = Array.isArray(aging?.buckets?.warning)
      ? aging.buckets.warning
      : [];

    return warning
      .map((item: any) => {
        const diffTime =
          new Date(item.expiryDate).getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return {
          ...item,
          daysUntilExpiry: diffDays > 0 ? diffDays : 0,
        };
      })
      .slice(0, 6);
  }, [rawAging]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ANALYTICS CARDS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fill Rate & Performance */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-sm font-black uppercase italic text-slate-900">
                Hiệu suất Đơn hàng
              </CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase italic">
                Fulfillment & Lead time
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-indigo-600 stroke-[2.5px]" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase italic">
                Fill Rate
              </p>
              <p className="text-2xl font-black text-slate-900 italic">
                {ordersAnalytics.fillRate.toFixed(1)}%
              </p>
              <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${ordersAnalytics.fillRate}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase italic">
                Review Time
              </p>
              <p className="text-2xl font-black text-slate-900 italic">
                {ordersAnalytics.avgLeadTime.toFixed(1)}
                <span className="text-xs ml-1 italic">h</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Summary */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-sm font-black uppercase italic text-slate-900">
                Tồn kho
              </CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase italic">
                Inventory Summary
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <PackageSearch className="h-5 w-5 text-emerald-600 stroke-[2.5px]" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase italic">
                Sản phẩm
              </p>
              <p className="text-2xl font-black text-slate-900 italic">
                {inventoryAnalytics.totalProducts}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase italic">
                Cảnh báo
              </p>
              <p className="text-xl font-black text-rose-600 italic">
                {inventoryAnalytics.expiringItems}{" "}
                <span className="text-[9px] uppercase">Lô sắp hết hạn</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Claims & Discrepancies */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-sm font-black uppercase italic text-slate-900">
                Sai lệch
              </CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase italic">
                Claims & Discrepancies
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-rose-600 stroke-[2.5px]" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase italic">
                Damage Rate
              </p>
              <p className="text-2xl font-black text-rose-600 italic">
                {claimAnalytics.damageRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase italic">
                Missing Rate
              </p>
              <p className="text-2xl font-black text-amber-600 italic">
                {claimAnalytics.missingRate.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FEFO ALERT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-none shadow-2xl rounded-[2rem] lg:col-span-2 overflow-hidden">
          <CardHeader className="px-8 pt-8 pb-4">
            <CardTitle className="text-white font-black uppercase italic tracking-wider flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-primary animate-pulse" />
              FEFO Alert – Lô sắp hết hạn
            </CardTitle>
            <CardDescription className="text-slate-400 font-bold uppercase text-[10px] italic tracking-widest">
              Action Required: Priority Shipment within 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* FIX: Explicit Typing for Map */}
              {fefoAlerts.map((batch: any, i: number) => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex justify-between items-center group hover:bg-slate-800 transition-all"
                >
                  <div className="min-w-0">
                    <p className="text-white font-black text-xs uppercase italic truncate">
                      {batch.productName}
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
                      {batch.batchCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-black italic text-sm">
                      {batch.daysUntilExpiry} Ngày
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase italic mt-1">
                      Left to EXP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Snapshot Summary Trend */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-slate-900 font-black uppercase italic tracking-widest flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Xu hướng
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-4">
            <div className="flex justify-between items-end border-b border-slate-50 pb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase italic">
                Tổng quan Orders
              </span>
              <span className="text-sm font-black text-slate-900 italic">
                57 Phân tích
              </span>
            </div>
            <div className="flex justify-between items-end border-b border-slate-50 pb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase italic">
                Khiếu nại hư hỏng
              </span>
              <span className="text-sm font-black text-rose-600 italic">
                27.3% Rate
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
