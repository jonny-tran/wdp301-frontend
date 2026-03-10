import { Product, Batch } from "@/types/product";

export type ProductRow = {
    id: number;
    sku: string;
    name: string;
    baseUnitName: string;
    baseUnitId: number;
    shelfLifeDays: number;
    minStockLevel: number;
    imageUrl: string | null;
    isActive: boolean;
    batches: Batch[];
};

export interface ProductDetailResponse {
  statusCode: number;
  message: string;
  data: Product;
  timestamp: string;
}

/** Cấu trúc raw API Product trước khi normalize */
export interface RawProductData {
  id: number;
  sku?: string;
  name?: string;
  baseUnitName?: string;
  baseUnitId?: number;
  shelfLifeDays?: number;
  minStockLevel?: number;
  imageUrl?: string | null;
  isActive?: boolean;
  batches?: Batch[];
}

/** Response wrapper cho product list API */
export interface ProductListResponse {
  data?: {
    items?: RawProductData[];
    meta?: { totalItems: number; totalPages: number; currentPage: number };
  };
  items?: RawProductData[];
}

/** Cấu trúc raw base-unit từ API */
export interface RawBaseUnitData {
  id: number;
  name?: string;
}

/** Response wrapper cho base-unit API */
export interface BaseUnitListResponse {
  data?: RawBaseUnitData[] | { items?: RawBaseUnitData[] };
}