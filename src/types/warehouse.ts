import { BaseRequestPagination } from "./base";

export type PickingTaskListItem = {
    orderId: string;
    storeName?: string;
    status?: string;
    createdAt?: string;
    deliveryDate?: string;
    totalItems?: number;
    shipmentId?: string;
};

export type PickingSuggestionBatch = {
    batchId?: number;
    batchCode: string;
    qtyToPick: number;
    expiry?: string;
    expiryDate?: string;
    location?: string;
};

export type PickingTaskItem = {
    productId: number;
    productName: string;
    requiredQty: number;
    pickedQty: number;
    suggestedBatches: PickingSuggestionBatch[];
};

export type PickingTaskDetail = {
    orderId: string;
    shipmentId?: string;
    storeName?: string;
    items: PickingTaskItem[];
};

export type ShipmentLabel = {
    shipmentId: string;
    orderId?: string;
    storeName: string;
    storeAddress?: string;
    expectedDeliveryDate?: string;
    templateType?: string;
    date?: string;
    items: {
        productName: string;
        batchCode: string;
        quantity?: number;
        qty?: number | string;
        unit?: string;
        expiryDate?: string;
        expiry?: string;
    }[];
    qrCode?: string;
};

export type ScanCheckResult = {
    batchId?: number;
    batchCode?: string;
    productId?: number;
    productName: string;
    currentQuantity?: number;
    quantityPhysical?: number;
    expiryDate?: string;
    location?: string;
    status: string;
};

export type IssueReport = {
    reportId?: number;
    batchId?: number;
    reason?: string;
    quantity?: number;
    status?: string;
    createdAt?: string;
    oldBatchId?: number;
    replacedWith?: Array<{ batchId?: number; batchCode?: string; quantity?: number }>;
    message?: string;
};

export type QueryPickingTask = BaseRequestPagination & {
    date?: string;
    search?: string;
    sortBy?: string;
}
