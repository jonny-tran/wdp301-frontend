import { ReceiptStatus } from "@/utils/enum";
import { BaseRequestPagination } from "./base";

/** Dòng phiếu nhập — post-refactor: có thể chưa có batch_id cho đến khi PATCH complete. */
export type ReceiptItem = {
    id?: number | string;
    itemId?: number | string;
    receiptItemId?: number | string;
    batchId?: number | null;
    batchCode?: string | null;
    productId?: number;
    /** Một số API trả snake_case */
    product_id?: number | string;
    productName?: string | null;
    product_name?: string | null;
    /** Một số API trả object lồng thay cho productId phẳng */
    product?: { id?: number | string | null; name?: string | null };
    /** Loại sản phẩm (nếu API trả) — dùng khi không có trong cache danh mục */
    productType?: string | null;
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
    receiptCode?: string;
    supplierId: number;
    supplierName?: string;
    supplier?: { name?: string; contactName?: string; phone?: string };
    status: string;
    expectedDeliveryDate?: string;
    items?: ReceiptItem[];
    note?: string | null;
    user?: { username: string };
    createdBy?: { username: string };
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

/** Kết quả chốt phiếu — mã lô sinh tự động (BAT-…) để in nhãn. */
export type InboundCompletedBatchLine = {
    batchId: number;
    batchCode: string;
    productId?: number;
    productName?: string;
    receiptItemId?: number | string;
};

export type CompleteInboundReceiptResult = {
    message?: string;
    batches: InboundCompletedBatchLine[];
    batchCodes: string[];
};
