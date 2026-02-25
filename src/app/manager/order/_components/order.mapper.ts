import { OrderRow, OrderAnalyticsStats } from "./order.types";

export function extractOrderItems(raw: any): OrderRow[] {
  // Debug: Hàn kiểm tra F12, nếu thấy mảng nằm trong data.items thì đường dẫn này chuẩn
  const items = raw?.data?.items || raw?.items || [];

  if (!Array.isArray(items)) return [];

  return items.map((item: any) => ({
    id: item.id || "",
    storeId: item.storeId || "",
    status: item.status || "pending",
    totalAmount: item.totalAmount || "0.00",
    deliveryDate: item.deliveryDate || "",
    priority: item.priority || "standard",
    note: item.note || null,
    createdAt: item.createdAt || "",
  }));
}

export function extractOrderAnalytics(rawFill: any, rawLead: any): OrderAnalyticsStats {
  const fillKpi = rawFill?.data?.kpi || rawFill?.kpi;
  const leadKpi = rawLead?.data?.kpi || rawLead?.kpi;

  return {
    fillRate: fillKpi?.fillRatePercentage ?? 0,
    totalRequested: fillKpi?.totalRequestedQty ?? 0,
    avgReview: leadKpi?.avgReviewTimeHours ?? 0,
    avgPicking: leadKpi?.avgPickingTimeHours ?? 0,
    avgDelivery: leadKpi?.avgDeliveryTimeHours ?? 0,
  };
}