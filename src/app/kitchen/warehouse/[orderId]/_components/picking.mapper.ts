import { PickFormRow } from "./picking.types";

export function buildPickRows(detailItems: unknown[]): PickFormRow[] {
    const rows: PickFormRow[] = [];
    const responseRaw = detailItems as any;
    const items = Array.isArray(responseRaw) ? responseRaw : (Array.isArray(responseRaw.items) ? responseRaw.items : []);

    items.forEach((item: any, itemIdx: number) => {
        const itemRow = item as Record<string, unknown>;
        const suggested = Array.isArray(itemRow.suggestedBatches)
            ? itemRow.suggestedBatches
            : (Array.isArray((itemRow as any).data?.suggestedBatches) ? (itemRow as any).data.suggestedBatches : []);

        suggested.forEach((batch: any, batchIdx: number) => {
            const batchRow = batch as Record<string, unknown>;
            rows.push({
                key: `${String(itemRow.productId ?? itemIdx)}-${String(batchRow.batchCode ?? batchRow.batchId ?? batchIdx)}`,
                productName: String(itemRow.productName ?? (itemRow.product as any)?.name ?? "Product"),
                batchCode: String(batchRow.batchCode ?? "-"),
                batchId: batchRow.batchId ? String(batchRow.batchId) : (batchRow.id ? String(batchRow.id) : ""),
                quantity: String(batchRow.qtyToPick ?? batchRow.quantity ?? 0),
                expiry: typeof batchRow.expiry === "string"
                    ? batchRow.expiry
                    : typeof batchRow.expiryDate === "string"
                        ? batchRow.expiryDate
                        : undefined,
            });
        });
    });

    return rows;
}
