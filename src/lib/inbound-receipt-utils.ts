import type { Receipt, ReceiptItem } from "@/types/inbound";

/**
 * Backend đôi khi trả placeholder kiểu "---" / "—" hoặc chỉ ký tự gạch;
 * coi là thiếu tên để có thể fallback sang danh mục theo productId.
 */
export function coalesceReceiptLineProductLabel(
    apiLabel: unknown,
    catalogName?: string | null,
): string {
    const s = typeof apiLabel === "string" ? apiLabel.trim() : "";
    const isPlaceholder =
        s.length === 0 ||
        /^[\s\-–—_.]+$/u.test(s) ||
        /^n\/?a$/iu.test(s);
    if (!isPlaceholder) return s;
    const c = typeof catalogName === "string" ? catalogName.trim() : "";
    if (c.length > 0) return c;
    return "—";
}

export function receiptLineProductId(item: ReceiptItem): number | undefined {
    const raw = item.productId ?? item.product_id ?? item.product?.id;
    if (raw == null) return undefined;
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
}

export function receiptLineApiProductName(item: ReceiptItem): unknown {
    return item.productName ?? item.product_name ?? item.product?.name;
}

export function getReceiptId(d: Receipt | null | undefined): string {
    if (!d) return "";
    return String(d.receiptId ?? d.id ?? "");
}

export function receiptItems(d: Receipt | null | undefined): ReceiptItem[] {
    if (!d) return [];
    if (Array.isArray(d.items)) return d.items;
    const ext = d as Receipt & { receipt_items?: ReceiptItem[]; lines?: ReceiptItem[] };
    if (Array.isArray(ext.receipt_items)) return ext.receipt_items;
    if (Array.isArray(ext.lines)) return ext.lines;
    return [];
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
