import { BaseRequestPagination } from "./base";

export type PickingTaskItem = {
    productId: number;
    productName: string;
    requiredQty: number;
    pickedQty: number;
    suggestedBatches: {
        batchId: number;
        batchCode: string;
        qtyToPick: number;
        expiryDate: string;
        location: string;
    }[];
};

export type PickingTask = {
    orderId: string;
    storeName: string;
    items: PickingTaskItem[];
};

export type ShipmentLabel = {
    shipmentId: string;
    orderId: string;
    storeName: string;
    storeAddress: string;
    expectedDeliveryDate: string;
    items: {
        productName: string;
        batchCode: string;
        quantity: number;
        unit: string;
        expiryDate: string;
    }[];
    qrCode: string;
};

export type ScanCheckResult = {
    batchId: number;
    batchCode: string;
    productId: number;
    productName: string;
    currentQuantity: number;
    expiryDate: string;
    location: string;
    status: string;
};

export type IssueReport = {
    reportId: number;
    batchId: number;
    reason: string;
    quantity: number;
    status: string;
    createdAt: string;
};

export type QueryPickingTask = BaseRequestPagination & {
    date?: string;
    search?: string;
    sortBy?: string;
}
