import http from "@/lib/http";
import {
    AddReceiptItemBodyType,
    CompleteReceiptBodyType,
    CreateReceiptBodyType,
    ReprintBatchBodyType,
    toAddReceiptItemApiPayload,
    VarianceApprovalBodyType,
} from "@/schemas/inbound";
import { BaseResponsePagination } from "@/types/base";
import { BatchLabel, QueryIbound, Receipt, ReceiptItem, ReprintLog } from "@/types/inbound";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const inboundRequest = {
    getReceipts: (query: QueryIbound) => http.get<BaseResponsePagination<Receipt>>(ENDPOINT_CLIENT.INBOUND_RECEIPTS, { query }),

    createReceipt: (data: CreateReceiptBodyType) => http.post<Receipt>(ENDPOINT_CLIENT.INBOUND_RECEIPTS, data),

    getReceiptDetail: (id: string, query?: { omitExpected?: boolean }) =>
        http.get<Receipt>(ENDPOINT_CLIENT.INBOUND_RECEIPT_DETAIL(id), {
            query: query?.omitExpected ? { omitExpected: true } : undefined,
        }),

    addReceiptItem: (id: string, data: AddReceiptItemBodyType) =>
        http.post<ReceiptItem>(ENDPOINT_CLIENT.INBOUND_ADD_ITEM(id), toAddReceiptItemApiPayload(data)),

    getBatchLabel: (id: string) => http.get<BatchLabel>(ENDPOINT_CLIENT.INBOUND_BATCH_LABEL(id)),

    completeReceipt: (id: string, body?: CompleteReceiptBodyType) =>
        http.patch<unknown>(ENDPOINT_CLIENT.INBOUND_COMPLETE(id), body && Object.keys(body).length > 0 ? body : {}),

    deleteReceiptItem: (receiptId: string, itemId: string | number) =>
        http.delete(ENDPOINT_CLIENT.INBOUND_DELETE_RECEIPT_ITEM(receiptId, itemId)),

    varianceApproval: (id: string, data: VarianceApprovalBodyType) =>
        http.patch(ENDPOINT_CLIENT.INBOUND_VARIANCE_APPROVAL(id), data),

    reprintBatch: (data: ReprintBatchBodyType) => http.post<ReprintLog>(ENDPOINT_CLIENT.INBOUND_REPRINT_BATCH, data),
};
