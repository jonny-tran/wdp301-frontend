import { PickFormRow } from "./picking.types";

export function buildPickRows(detailItems: unknown[]): PickFormRow[] {
    const rows: PickFormRow[] = [];

    detailItems.forEach((item, itemIdx) => {
        const itemRow = item as Record<string, unknown>;
        const suggested = Array.isArray(itemRow.suggestedBatches) ? itemRow.suggestedBatches : [];

        suggested.forEach((batch, batchIdx) => {
            const batchRow = batch as Record<string, unknown>;
            rows.push({
                key: `${String(itemRow.productId ?? itemIdx)}-${String(batchRow.batchCode ?? batchIdx)}`,
                productName: String(itemRow.productName ?? "Product"),
                batchCode: String(batchRow.batchCode ?? "-"),
                batchId: batchRow.batchId ? String(batchRow.batchId) : "",
                quantity: String(batchRow.qtyToPick ?? 0),
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
