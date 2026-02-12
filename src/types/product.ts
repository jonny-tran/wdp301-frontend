export interface Product {
  id: number;
  sku: string;
  name: string;
  baseUnitId: number;
  baseUnitName: string;
  shelfLifeDays: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}