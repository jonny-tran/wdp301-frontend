export type KitchenSummaryRow = {
    productId: number;
    productName: string;
    sku?: string;
    unit?: string;
    totalReserved?: number;
    availableQuantity?: number;
    isLowStock?: boolean;
};

export type KitchenBatchRow = {
    batchId: number;
    batchCode: string;
    totalQuantity: number;
    availableQuantity: number;
    reservedQuantity: number;
    expiryDate: string;
};
