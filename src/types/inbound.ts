import { ReceiptStatus } from "@/utils/enum";
import { BaseRequestPagination } from "./base";

export type ReceiptItem = {
    batchId: number;
    batchCode: string;
    productId: number;
    productName: string;
    quantity: number;
    expiryDate: string;
    imageUrl?: string;
};

export type Receipt = {
    receiptId: string;
    supplierId: number;
    supplierName?: string;
    status: string;
    expectedDeliveryDate: string;
    items?: ReceiptItem[];
    createdAt: string;
    completedAt?: string;
    totalItems?: number;
};

export type BatchLabel = {
    batchId: number;
    batchCode: string;
    productName: string;
    quantity: number;
    expiryDate: string;
    qrCode: string;
    qrCodeData: string;
};

export type ReprintLog = {
    batchId: number;
    batchCode: string;
    qrCode: string;
    reprintLogId: number;
};

export type QueryIbound = BaseRequestPagination & {
    sortBy?: string;
    search?: string;
    status?: ReceiptStatus;
    supplierId?: string;
    fromDate?: string;
    toDate?: string;
};
