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

export type InventoryStoreItem = {
    inventoryId: number;
    batchId: number;
    productId: number;
    productName: string;
    sku: string;
    batchCode: string;
    quantity: number;
    expiryDate: string;
    unit: string;
    imageUrl: string | null;
};

export type StoreInventoryTransaction = {
    transactionId: number;
    type: string;
    productName: string;
    batchCode: string;
    quantity: number;
    date: string;
    note: string | null;
};

export type InventorySummaryItem = {
    productId: number;
    productName: string;
    sku: string;
    totalQuantity: number;
    unit: string;
    warehouses: {
        warehouseId: number;
        warehouseName: string;
        quantity: number;
    }[];
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

export type InventoryAnalyticsSummary = {
    totalProducts: number;
    totalBatches: number;
    totalValue: number;
    lowStockItems: number;
    expiringItems: number;
};

export type InventoryAgingReport = {
    batchId: number;
    batchCode: string;
    productName: string;
    currentQuantity: number;
    expiryDate: string;
    daysUntilExpiry: number;
    status: "good" | "warning" | "expired";
}[];

export type InventoryWasteReport = {
    totalWasteVolume: number;
    wasteByProduct: {
        productId: number;
        productName: string;
        wasteQuantity: number;
        wasteValue: number;
        reason: string;
    }[];
    wasteRate: number;
};

export type FinancialLossImpact = {
    totalLoss: number;
    expiredLoss: number;
    damagedLoss: number;
    missingLoss: number;
    period: {
        from: string;
        to: string;
    };
};

