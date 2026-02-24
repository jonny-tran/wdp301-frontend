import { ClaimRow, ClaimAnalytics, ClaimItemDetail } from "./claims.types";

/**
 * 1. Extract danh sách khiếu nại (Dùng cho ClaimsTable)
 * Xử lý cấu trúc: raw.data.items
 */
export function extractClaims(raw: any): ClaimRow[] {
  // Bóc tách từ data.items theo cấu trúc JSON bạn gửi
  const source = raw?.data?.items || raw?.items || (Array.isArray(raw) ? raw : []);
  
  if (!Array.isArray(source)) return [];

  return source.map((item: any) => ({
    id: item.id || "",
    shipmentId: item.shipmentId || "N/A",
    status: (item.status?.toLowerCase() as any) || "pending",
    createdBy: item.createdBy || "System",
    createdAt: item.createdAt || new Date().toISOString(),
    resolvedAt: item.resolvedAt || undefined,
  }));
}

/**
 * 2. Extract chi tiết khiếu nại (Dùng cho Resolve Modal)
 * Xử lý cấu trúc: raw.data (object đơn lẻ)
 */
export function extractClaimDetail(raw: any) {
  const data = raw?.data || raw;
  
  if (!data || typeof data !== "object") return null;

  return {
    id: data.id || "",
    shipmentId: data.shipmentId || "N/A",
    status: data.status || "pending",
    createdAt: data.createdAt || "",
    resolvedAt: data.resolvedAt || "",
    // Map danh sách sản phẩm lỗi bên trong chi tiết
    items: Array.isArray(data.items) ? data.items.map((i: any) => ({
      productName: i.productName || "Sản phẩm không tên",
      sku: i.sku || "N/A",
      quantityMissing: i.quantityMissing || 0,
      quantityDamaged: i.quantityDamaged || 0,
      reason: i.reason || "Không có lý do chi tiết",
      imageUrl: i.imageUrl || undefined
    })) : []
  };
}

/**
 * 3. Extract chỉ số thống kê (Dùng cho ClaimsAnalytics)
 * Ứng với yêu cầu: Damage Rate, Missing Rate, Bottleneck
 */
export function extractClaimAnalytics(raw: any) {
  const data = raw?.data || {};
  const kpi = data?.kpi || {};
  
  return {
    damageRate: kpi.damageRatePercentage || 0,
    missingRate: kpi.missingRatePercentage || 0,
    totalShipments: kpi.totalShipments || 0,
    // Map danh sách sản phẩm để hỗ trợ tra cứu
    bottlenecks: Array.isArray(data.bottleneckProducts) 
      ? data.bottleneckProducts.map((p: any) => ({
          id: p.productId,
          name: p.productName,
          rate: p.damageRate,
          totalDamaged: p.totalDamaged,
          totalShipped: p.totalShipped
        }))
      : []
  };
}