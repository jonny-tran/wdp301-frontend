import http from "@/lib/http";
import { AddReceiptItemBodyType, CreateReceiptBodyType, ReprintBatchBodyType } from "@/schemas/inbound";
import { BaseResponePagination } from "@/types/base";
import { BatchLabel, QueryIbound, Receipt, ReceiptItem, ReprintLog } from "@/types/inbound";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const inboundRequest = {
    // GET /inbound/receipts
    getReceipts: (query: QueryIbound) => http.get<BaseResponePagination<Receipt[]>>(ENDPOINT_CLIENT.INBOUND_RECEIPTS, { query }),

    // POST /inbound/receipts
    createReceipt: (data: CreateReceiptBodyType) => http.post<Receipt>(ENDPOINT_CLIENT.INBOUND_RECEIPTS, data),

    // GET /inbound/receipts/:id
    getReceiptDetail: (id: string) => http.get<Receipt>(ENDPOINT_CLIENT.INBOUND_RECEIPT_DETAIL(id)),

    // POST /inbound/receipts/:id/items
    addReceiptItem: (id: string, data: AddReceiptItemBodyType) => http.post<ReceiptItem>(ENDPOINT_CLIENT.INBOUND_ADD_ITEM(id), data),

    // GET /inbound/batches/:id/label
    getBatchLabel: (id: number | string) => http.get<BatchLabel>(ENDPOINT_CLIENT.INBOUND_BATCH_LABEL(id)),

    // PATCH /inbound/receipts/:id/complete
    completeReceipt: (id: string) => http.patch<{ receiptId: string, status: string, completedAt: string }>(ENDPOINT_CLIENT.INBOUND_COMPLETE(id), {}),

    // DELETE /inbound/items/:batchId
    deleteReceiptItem: (batchId: number | string) => http.delete(ENDPOINT_CLIENT.INBOUND_DELETE_ITEM(batchId)),

    // POST /inbound/batches/reprint
    reprintBatch: (data: ReprintBatchBodyType) => http.post<ReprintLog>(ENDPOINT_CLIENT.INBOUND_REPRINT_BATCH, data),
};
