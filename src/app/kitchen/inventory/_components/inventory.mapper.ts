import { KitchenBatchRow, KitchenSummaryRow } from "./inventory.types";

export function extractSummaryItems(raw: unknown): KitchenSummaryRow[] {
    const data = (raw ?? {}) as { items?: unknown };
    if (!Array.isArray(data.items)) return [];

    return data.items.map((item: any) => ({
        ...item,
        productId: item.productId ?? item.product_id ?? item.id,
        productName: item.productName ?? item.product_name ?? item.name,
        availableQuantity: item.availableQuantity ?? item.available_quantity ?? item.totalQuantity ?? 0,
        totalReserved: item.totalReserved ?? item.total_reserved ?? item.reservedQuantity ?? 0,
        isLowStock: item.isLowStock ?? item.is_low_stock ?? false,
    }));
}

export function extractBatchItems(raw: unknown): KitchenBatchRow[] {
    const data = (raw ?? {}) as { batches?: unknown; details?: unknown };
    const items = Array.isArray(data.batches) ? data.batches : Array.isArray(data.details) ? data.details : [];

    return items.map((batch: any) => ({
        ...batch,
        batchId: batch.batchId ?? batch.batch_id ?? batch.id,
        batchCode: batch.batchCode ?? batch.batch_code ?? batch.code ?? batch.batch_name,
        availableQuantity: batch.available ?? batch.availableQuantity ?? batch.available_quantity ?? 0,
        totalQuantity: batch.physical ?? batch.totalQuantity ?? batch.total_quantity ?? 0,
        reservedQuantity: batch.reserved ?? batch.reservedQuantity ?? batch.reserved_quantity ?? 0,
        expiryDate: batch.expiryDate ?? batch.expiry_date ?? batch.expired_at,
    }));
}
