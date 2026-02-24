import { ProductRow, ProductDetail, BatchRow } from "./product.types";

/**
 * 1. Extract danh sách cho ProductTable 
 * Cấu trúc JSON API: { data: { items: [...], meta: {...} } }
 */
export function extractProductItems(raw: any): ProductRow[] {
  // Bóc tách đúng tầng data.items từ JSON thực tế bạn gửi
  const source = raw?.data?.items || raw?.items || [];
  
  // Chốt chặn an toàn: Luôn trả về mảng để không bị lỗi .map()
  if (!Array.isArray(source)) return [];

  return source.map((p: any) => ({
    id: p.id,
    name: p.name || "Sản phẩm không tên",
    sku: p.sku || "N/A",
    // Map baseUnitName -> baseUnit
    baseUnit: p.baseUnitName || "N/A", 
    // Chuyển isActive sang enum 'ACTIVE' | 'INACTIVE'
    status: p.isActive ? 'ACTIVE' : 'INACTIVE', 
    imageUrl: p.imageUrl || "",
    // Map shelfLifeDays -> shelfLife
    shelfLife: p.shelfLifeDays || 0,
    // Map minStockLevel -> minStock
    minStock: p.minStockLevel || 0 
  }));
}

/**
 * 2. Extract chi tiết sản phẩm cho ProductBatchModal (FEFO)
 * API: /products/{id}
 */
export function extractProductDetail(raw: any): ProductDetail | null {
  const data = raw?.data || raw;
  if (!data || !data.id) return null;

  return {
    id: data.id,
    name: data.name,
    sku: data.sku || "N/A",
    // Đồng bộ cách lấy tên đơn vị
    baseUnit: data.baseUnitName || "N/A",
    imageUrl: data.imageUrl || "",
    isActive: !!data.isActive,
    // Bóc tách danh sách lô hàng (Batches) đính kèm
    batches: (data.batches || []).map((b: any): BatchRow => ({
      id: b.id,
      batchCode: b.batchCode || "N/A",
      expiryDate: b.expiryDate,
      status: b.status,
      createdAt: b.createdAt
    }))
  };
}

/**
 * 3. Extract đơn vị cơ bản cho Select Options trong Modal 
 * Dùng cho ProductCreateModal & ProductEditModal
 */
export function extractBaseUnitOptions(raw: any) {
  // Bóc tách linh hoạt: ưu tiên tầng sâu nhất data.data.items theo JSON bạn gửi
  const source = raw?.data?.items || raw?.data?.data?.items || raw?.items || [];
  
  if (!Array.isArray(source)) return [];

  return source
    // Chỉ lấy các đơn vị đang hoạt động (Miếng, Gói, Thùng, Lít, Bao, Kg)
    .filter((u: any) => u.isActive === true) 
    .map((u: any) => ({
      // Luôn ép kiểu Number cho value
      value: Number(u.id),
      label: u.name || `Đơn vị ${u.id}`
    }));
}