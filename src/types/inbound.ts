import { ReceiptStatus } from "@/utils/enum";
import { BaseRequestPagination } from "./base";

/** Dòng phiếu nhập — post-refactor: có thể chưa có batch_id cho đến khi PATCH complete. */
export type ReceiptItem = {
    id?: number | string;
    itemId?: number | string;
    receiptItemId?: number | string;
    batchId?: number | null;
    batchCode?: string | null;
    productId: number;
    productName: string;
    /** Tổng SL hiển thị (legacy hoặc mirror) */
    quantity?: number;
    expectedQuantity?: number | null;
    quantityAccepted?: number | null;
    quantityRejected?: number | null;
    rejectionReason?: string | null;
    manufacturedDate?: string | null;
    statedExpiryDate?: string | null;
    expiryDate?: string | null;
    storageLocationCode?: string | null;
    /** QC / kiểm định (F&B) */
    inspectionStatus?: string | null;
    imageUrl?: string | null;
    unit?: string | null;
};

export type Receipt = {
    receiptId?: string;
    id?: string;
    supplierId: number;
    supplierName?: string;
    supplier?: { name?: string; contactName?: string; phone?: string };
    status: string;
    expectedDeliveryDate?: string;
    items?: ReceiptItem[];
    note?: string | null;
    createdAt: string;
    completedAt?: string;
    totalItems?: number;
    varianceApprovedBy?: string | null;
    varianceApprovedAt?: string | null;
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
