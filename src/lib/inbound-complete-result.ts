import type { CompleteInboundReceiptResult, InboundCompletedBatchLine } from "@/types/inbound";

function pickNum(v: unknown): number | undefined {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
}

function normalizeBatchLine(raw: Record<string, unknown>): InboundCompletedBatchLine | null {
    const batchId = pickNum(raw.batchId ?? raw.id);
    const batchCode = raw.batchCode != null ? String(raw.batchCode) : "";
    if (!batchId || !batchCode) return null;
    return {
        batchId,
        batchCode,
        productId: pickNum(raw.productId),
        productName: raw.productName != null ? String(raw.productName) : undefined,
        receiptItemId:
            raw.receiptItemId != null
                ? (raw.receiptItemId as string | number)
                : raw.itemId != null
                  ? (raw.itemId as string | number)
                  : undefined,
    };
}

/** Chuẩn hóa response PATCH complete — hỗ trợ nhiều dạng envelope backend. */
export function parseCompleteInboundReceiptResult(raw: unknown): CompleteInboundReceiptResult {
    const root = (raw ?? {}) as Record<string, unknown>;
    const data = (root.data ?? root.result ?? root) as Record<string, unknown>;
    const batchesRaw = (data.batches ??
        data.createdBatches ??
        data.outputBatches ??
        data.items) as unknown;
    const arr = Array.isArray(batchesRaw) ? batchesRaw : [];
    const batches: InboundCompletedBatchLine[] = [];
    for (const row of arr) {
        if (row && typeof row === "object") {
            const line = normalizeBatchLine(row as Record<string, unknown>);
            if (line) batches.push(line);
        }
    }
    const codesRaw = data.batchCodes ?? data.codes;
    let batchCodes: string[] = [];
    if (Array.isArray(codesRaw)) {
        batchCodes = codesRaw.map((c) => String(c));
    }
    if (batchCodes.length === 0 && batches.length > 0) {
        batchCodes = batches.map((b) => b.batchCode);
    }
    const message = data.message != null ? String(data.message) : root.message != null ? String(root.message) : undefined;
    return { batches, batchCodes, message };
}
