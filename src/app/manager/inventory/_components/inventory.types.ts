export interface InventoryRow {
  productId: number;
  productName: string;
  sku: string;
  warehouseId: number;
  warehouseName: string;
  totalQuantity: number;
  unit: string;
  minStockLevel: number;
  status: "normal" | "low-stock" | "out-of-stock";
}

export interface InventoryAnalytics {
  totalProducts: number;
  lowStockCount: number;
  expiringBatches: number;
  estimatedLossVnd: number;
}