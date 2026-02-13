import { TransactionType } from "@/utils/enum";
import { BaseRequestPagination } from "./base";

export type LowStockItem = {
    productId: number;
    productName: string;
    sku: string;
    minStockLevel: number;
    currentQuantity: number;
    unit: string;
};

export type InventoryTransaction = {
    transactionId: number;
    warehouseId: number;
    batchId: number;
    adjustmentQuantity: number;
    newQuantity: number;
    reason: string;
};

export type KitchenDetail = {
    productId: number;
    productName: string;
    batches: {
        batchId: number;
        batchCode: string;
        totalQuantity: number;
        availableQuantity: number;
        reservedQuantity: number;
        expiryDate: string;
    }[];
};
export type KitchSummary = {
    productId: number;
    productName: string;
    sku: string;
    unit: string;
    minStockLevel: number;
    totalPhysical: number;
    totalReserved: number;
    availableQuantity: number;
    isLowStock: boolean;
}


export type QueryKitchen = BaseRequestPagination & {
    sortBy?: string;
    warehouseId?: number;
    searchTerm?: string;
}

export type QueryInventory = BaseRequestPagination & {
    search?: string;
    sortBy?: string;
}

export type QueryInventoryTransaction = BaseRequestPagination & {
    sortBy?: string;
    type?: TransactionType
    fromDate?: string;
    toDate?: string;
}

export type QueryInventorySummary = BaseRequestPagination & {
    warehouseId?: number;
    searchTerm?: string;
}
