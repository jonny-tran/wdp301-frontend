import { BaseRequestPagination } from "./base";

export type Product = {
    id: number;
    sku: string;
    name: string;
    baseUnit: string;
    shelfLifeDays: number;
    imageUrl: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    restoredAt?: string;
};

export type Batch = {
    id: number;
    batchCode: string;
    productId: number;
    productName: string;
    initialQuantity: number;
    currentQuantity: number;
    expiryDate: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt?: string;
};


export type QueryProduct = BaseRequestPagination & {
    sortBy?: string;
    search?: string;
    isActive?: boolean;
};

export type QueryBatch = BaseRequestPagination & {
    productId?: number;
    supplierId?: number;
    sortBy?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
};
