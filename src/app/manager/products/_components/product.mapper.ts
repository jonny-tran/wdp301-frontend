/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductRow } from "./product.types";

export interface UnitOption {
  label: string;
  value: number;
}
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



export function extractProducts(raw: any): ProductRow[] {
  const items = raw?.data?.items || raw?.items || raw?.data || [];
  return Array.isArray(items) ? items.map(normalizeProduct) : [];
}


export function extractBaseUnitOptions(raw: any): UnitOption[] {
  const units = raw?.items || raw?.data?.items || (Array.isArray(raw) ? raw : []);

  return units
    .filter((u: any) => u.isActive === true) 
    .map((u: any): UnitOption => ({
      label: String(u.name || "N/A"),
      value: Number(u.id || 0)
    }))
    .filter((opt: UnitOption) => opt.value !== 0);
}