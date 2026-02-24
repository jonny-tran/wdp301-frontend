import { StoreRow, StoreDetail } from "./store.types";

/**
 * 1. Extract danh sách Stores (Dùng cho StoreTable)
 * Cấu trúc API: { data: { items: [...], meta: {...} } }
 */
export function extractStores(raw: any): StoreRow[] {
  // Truy cập sâu vào tầng data.items
  const source = raw?.data?.items || raw?.items || (Array.isArray(raw?.data) ? raw.data : []);
  
  if (!Array.isArray(source)) return [];

  return source.map((item: any) => ({
    id: item.id || "",
    name: item.name || "Cửa hàng không tên",
    address: item.address || "Chưa cập nhật địa chỉ",
    managerName: item.managerName || "Chưa có quản lý", // Xử lý null từ API
    phone: item.phone || "---",
    isActive: typeof item.isActive === "boolean" ? item.isActive : true,
    createdAt: item.createdAt || new Date().toISOString(),
    // Đếm số lượng kho nếu có thông tin đi kèm
    warehouseCount: Array.isArray(item.warehouses) ? item.warehouses.length : 0
  }));
}

/**
 * 2. Extract chi tiết Store (Dùng cho Detail Page hoặc Modal View)
 * Cấu trúc API: { data: { id, name, ..., warehouses: [...] } }
 */
export function extractStoreDetail(raw: any): StoreDetail | null {
  const data = raw?.data || raw;
  if (!data || typeof data !== "object" || !data.id) return null;

  return {
    id: data.id,
    name: data.name || "Cửa hàng không tên",
    address: data.address || "Chưa có địa chỉ",
    managerName: data.managerName || "Chưa có quản lý",
    phone: data.phone || "---",
    isActive: !!data.isActive,
    createdAt: data.createdAt || "",
    warehouseCount: Array.isArray(data.warehouses) ? data.warehouses.length : 0,
    warehouses: (data.warehouses || []).map((w: any) => ({
      id: w.id,
      name: w.name || "Kho không tên",
      type: w.type || "franchise",
      createdAt: w.createdAt || ""
    }))
  };
}

/**
 * 3. Extract Độ tin cậy (Reliability Analytics)
 * Cấu trúc API: { data: { systemAverage: {...}, storeAnalysis: [...] } }
 */
export function extractStoreReliability(raw: any) {
  const data = raw?.data || {};
  const analysis = data.storeAnalysis || [];

  return {
    // Tỷ lệ khiếu nại trung bình toàn hệ thống
    systemAverage: Number(data.systemAverage?.averageClaimRatePercentage) || 0,
    totalSystemShipments: Number(data.systemAverage?.totalShipments) || 0,
    storeAnalysis: Array.isArray(analysis) 
      ? analysis.map((s: any) => ({
          id: s.storeId,
          name: s.storeName,
          claimRate: Number(s.claimRatePercentage) || 0,
          totalDamaged: Number(s.totalDamagedQty) || 0,
          isWarning: !!s.isFraudWarning // Cảnh báo gian lận
        }))
      : []
  };
}

/**
 * 4. Extract Nhu cầu sản phẩm (Demand Pattern Analytics)
 * Cấu trúc API: { data: { productIdFilter, demandByDay: [...] } }
 */
export function extractDemandPattern(raw: any) {
  const data = raw?.data || {};
  const demandByDay = data.demandByDay || [];
  
  return {
    productId: data.productIdFilter || 0,
    // Chuyển đổi dữ liệu biểu đồ, ép kiểu Number cho các con số lớn (như 1010)
    chartData: Array.isArray(demandByDay) 
      ? demandByDay.map((d: any) => ({
          day: d.dayOfWeek || "N/A",
          value: Number(d.totalRequestedQuantity) || 0
        }))
      : []
  };
}