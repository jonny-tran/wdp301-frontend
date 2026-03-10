import { ProductRow } from "./product.types";

/**
 * Định nghĩa kiểu dữ liệu cho Select Option
 */
export interface UnitOption {
  label: string;
  value: number;
}

/**
 * Chuyển đổi dữ liệu Sản phẩm từ API sang hàng trong bảng
 */
export function normalizeProduct(p: Record<string, any>): ProductRow {
  return {
    id: p.id,
    sku: p.sku || "N/A",
    name: p.name || "Sản phẩm không tên",
    baseUnitName: p.baseUnitName || "N/A",
    shelfLifeDays: Number(p.shelfLifeDays || 0),
    minStockLevel: Number(p.minStockLevel || 0),
    imageUrl: p.imageUrl || "https://res.cloudinary.com/dmhjgnymn/image/upload/v1770135560/OIP_j6j4gz.webp",
    isActive: !!p.isActive,
  };
}

/**
 * Trích xuất danh sách sản phẩm từ Response
 */
export function extractProducts(raw: any): ProductRow[] {
  const items = raw?.data?.items || raw?.items || raw?.data || [];
  return Array.isArray(items) ? items.map(normalizeProduct) : [];
}

/**
 * Trích xuất danh sách Đơn vị tính cho Select
 * Sửa lỗi "Trống dữ liệu đơn vị" bằng cách quét đa tầng
 */
export function extractBaseUnitOptions(raw: any): UnitOption[] {
  // Tìm mảng dữ liệu trong res.data hoặc res.data.items
  const units = Array.isArray(raw) 
    ? raw 
    : Array.isArray(raw?.data) 
      ? raw.data 
      : Array.isArray(raw?.data?.items) 
        ? raw.data.items 
        : [];

  return units.map((u: any) => ({
    label: String(u.name || "N/A"),
    value: Number(u.id || 0)
  })).filter(opt => opt.value !== 0);
}