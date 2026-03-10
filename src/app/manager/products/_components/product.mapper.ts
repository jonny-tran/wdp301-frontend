import { ProductRow, RawProductData, ProductListResponse, RawBaseUnitData, BaseUnitListResponse } from "./product.types";

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
export function normalizeProduct(p: RawProductData): ProductRow {
  return {
    id: p.id,
    sku: p.sku || "N/A",
    name: p.name || "Sản phẩm không tên",
    baseUnitName: p.baseUnitName || "N/A",
    baseUnitId: Number(p.baseUnitId || 0),
    shelfLifeDays: Number(p.shelfLifeDays || 0),
    minStockLevel: Number(p.minStockLevel || 0),
    imageUrl: typeof p.imageUrl === "string" && p.imageUrl.includes("cdn.com") 
      ? "https://placehold.co/400" 
      : (p.imageUrl || "https://res.cloudinary.com/dmhjgnymn/image/upload/v1770135560/OIP_j6j4gz.webp"),
    isActive: !!p.isActive,
    batches: Array.isArray(p.batches) ? p.batches : [],
  };
}

/**
 * Trích xuất danh sách sản phẩm từ Response
 */
export function extractProducts(raw: unknown): ProductRow[] {
  const data = raw as ProductListResponse | undefined;
  const items = data?.data?.items || data?.items || [];
  return Array.isArray(items) ? items.map(normalizeProduct) : [];
}

/**
 * Trích xuất danh sách Đơn vị tính cho Select
 * Sửa lỗi "Trống dữ liệu đơn vị" bằng cách quét đa tầng
 */
export function extractBaseUnitOptions(raw: unknown): UnitOption[] {
  const response = raw as BaseUnitListResponse | RawBaseUnitData[] | undefined;

  // Tìm mảng dữ liệu trong res.data hoặc res.data.items
  let units: RawBaseUnitData[] = [];
  if (Array.isArray(response)) {
    units = response;
  } else if (response?.data) {
    if (Array.isArray(response.data)) {
      units = response.data;
    } else if (Array.isArray((response.data as { items?: RawBaseUnitData[] }).items)) {
      units = (response.data as { items: RawBaseUnitData[] }).items;
    }
  }

  return units
    .map((u) => ({
      label: String(u.name || "N/A"),
      value: Number(u.id || 0),
    }))
    .filter((opt) => opt.value !== 0);
}