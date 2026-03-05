import { Product } from "@/types/product";

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
    batches: any[]
};
export interface ProductDetailResponse {
  statusCode: number;
  message: string;
  data: Product;
  timestamp: string;
}