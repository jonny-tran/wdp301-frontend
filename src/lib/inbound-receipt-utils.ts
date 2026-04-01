import type { Receipt, ReceiptItem } from "@/types/inbound";

export function getReceiptId(d: Receipt | null | undefined): string {
    if (!d) return "";
    return String(d.receiptId ?? d.id ?? "");
}

export function receiptItems(d: Receipt | null | undefined): ReceiptItem[] {
    return Array.isArray(d?.items) ? d.items : [];
}

/** ID dòng phiếu để DELETE; fallback batchId cho dòng legacy. */
export function receiptLineDeleteId(item: ReceiptItem): string | number | undefined {
    const v = item.itemId ?? item.receiptItemId ?? item.id ?? item.batchId;
    return v === null || v === undefined ? undefined : v;
}

export function acceptedQty(item: ReceiptItem): number {
    const a = item.quantityAccepted ?? item.quantity ?? 0;
    return typeof a === "number" && Number.isFinite(a) ? a : 0;
}

export function isDraftLinePendingBatch(item: ReceiptItem): boolean {
    return item.batchId == null || item.batchId === 0;
}
