import { InventoryRow, InventoryAnalytics } from "./inventory.types";

/**
 * 1. Extract danh sách sản phẩm (Dùng cho Tab Tồn kho & Sắp hết hàng)
 * Xử lý cả hai trường hợp: raw.data là mảng hoặc raw là mảng
 */
export function extractInventoryItems(raw: any): InventoryRow[] {
  const data = raw?.data || raw;
  const items = Array.isArray(data) ? data : [];

  return items.map((item: any) => {
    // Logic tính toán trạng thái tồn kho
    let status: InventoryRow["status"] = "normal";
    if (item.totalQuantity <= 0) status = "out-of-stock";
    else if (item.totalQuantity <= (item.minStockLevel || 10)) status = "low-stock";

    return {
      productId: item.productId,
      productName: item.productName || "Sản phẩm không tên",
      sku: item.sku || "N/A",
      warehouseId: item.warehouseId,
      warehouseName: item.warehouseName || "Kho mặc định",
      totalQuantity: item.totalQuantity || 0,
      unit: item.unit || "Đơn vị",
      minStockLevel: item.minStockLevel || 0,
      status
    };
  });
}

/**
 * 2. Extract chỉ số KPI (Dùng cho InventoryAnalytics)
 * Kết hợp dữ liệu từ Analytics Summary và Financial Loss Impact
 */
export function extractInventoryStats(rawSummary: any, rawLoss: any): InventoryAnalytics {
  const overview = rawSummary?.data?.overview || rawSummary?.overview;
  const lossKpi = rawLoss?.data?.kpi || rawLoss?.kpi;

  return {
    totalProducts: overview?.totalProducts ?? 0,
    lowStockCount: overview?.totalLowStockItems ?? 0,
    expiringBatches: overview?.totalExpiringBatches ?? 0,
    estimatedLossVnd: lossKpi?.totalEstimatedLossVnd ?? 0,
  };
}

/**
 * 3. Extract danh sách lô hàng theo hạn sử dụng (Dùng cho AgingTable)
 * Phân loại thành nhóm Cảnh báo (Warning) và Nguy cấp (Critical)
 */
export function extractAgingBatches(raw: any) {
  const buckets = raw?.data?.buckets || raw?.buckets;
  
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
}

/**
 * 5. Extract báo cáo lãng phí (Dùng cho WasteReportView)
 * Tổng hợp số lượng hàng hủy và lý do chi tiết
 */
export function extractWasteReport(raw: any) {
  // 1. Bóc tách an toàn: Nếu raw rỗng thì dùng object rỗng
  const data = raw?.data || raw;
  
  // 2. Định nghĩa kpi mặc định để tránh lỗi 'undefined'
  const kpi = data?.kpi || { 
    totalWastedQuantity: 0, 
    period: "N/A" 
  };

  // 3. Đảm bảo details luôn là mảng
  const details = Array.isArray(data?.details) ? data.details : [];

  return { kpi, details };
}