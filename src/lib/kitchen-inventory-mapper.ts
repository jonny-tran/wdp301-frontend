import { parseDecimalLike } from "@/lib/inventory-parse";
import type {
    InventoryAgingReport,
    InventoryTransactionLogItem,
    KitchenDetail,
    KitchSummary,
} from "@/types/inventory";

function readRecord(row: unknown): Record<string, unknown> {
    return row && typeof row === "object" ? (row as Record<string, unknown>) : {};
}

export function normalizeKitchenBatch(raw: unknown, index: number): KitchenDetail["batches"][number] {
    const b = readRecord(raw);
    const batchId = Number(b.batchId ?? b.batch_id ?? index + 1);
    const physical = parseDecimalLike(
        b.totalQuantity ?? b.total_quantity ?? b.physical ?? b.physical_quantity ?? b.physicalQuantity,
    );
    const available = parseDecimalLike(b.availableQuantity ?? b.available_quantity ?? b.available);
    const reserved = parseDecimalLike(b.reservedQuantity ?? b.reserved_quantity ?? b.reserved);
    const warehouseRaw = b.warehouseId ?? b.warehouse_id;
    const warehouseId =
        warehouseRaw !== undefined && warehouseRaw !== null && String(warehouseRaw) !== ""
            ? Number(warehouseRaw)
            : undefined;

    const parentBatchIdRaw = b.parentBatchId ?? b.parent_batch_id ?? b.sourceBatchId ?? b.source_batch_id;
    const parentBatchCodeRaw = b.parentBatchCode ?? b.parent_batch_code ?? b.sourceBatchCode ?? b.source_batch_code;

    return {
        batchId: Number.isFinite(batchId) ? batchId : index + 1,
        batchCode: String(b.batchCode ?? b.batch_code ?? ""),
        totalQuantity: physical,
        availableQuantity: available,
        reservedQuantity: reserved,
        expiryDate: String(b.expiryDate ?? b.expiry_date ?? ""),
        warehouseId: warehouseId !== undefined && Number.isFinite(warehouseId) ? warehouseId : undefined,
        parentBatchId:
            parentBatchIdRaw != null && parentBatchIdRaw !== "" && Number.isFinite(Number(parentBatchIdRaw))
                ? Number(parentBatchIdRaw)
                : undefined,
        parentBatchCode:
            parentBatchCodeRaw != null && String(parentBatchCodeRaw).trim() !== ""
                ? String(parentBatchCodeRaw)
                : undefined,
    };
}

export function normalizeKitchenDetailFromApi(data: unknown): KitchenDetail {
    if (!data || typeof data !== "object") {
        return { productId: 0, productName: "", batches: [] };
    }
    const d = data as Record<string, unknown>;
    const rawList = (d.batches ?? d.details ?? []) as unknown[];
    const productId = Number(d.productId ?? d.product_id ?? 0);
    const productName = String(d.productName ?? d.product_name ?? "");
    return {
        productId: Number.isFinite(productId) ? productId : 0,
        productName,
        batches: rawList.map((row, i) => normalizeKitchenBatch(row, i)),
    };
}

export function normalizeKitchSummary(raw: unknown): KitchSummary {
    const r = readRecord(raw);
    const category =
        r.categoryName != null
            ? String(r.categoryName)
            : r.category_name != null
              ? String(r.category_name)
              : undefined;
    const catObj = r["category"];
    const categoryFromNested =
        catObj && typeof catObj === "object" && catObj !== null && "name" in catObj
            ? String((catObj as { name?: unknown }).name ?? "")
            : undefined;

    const image =
        r.imageUrl != null
            ? String(r.imageUrl)
            : r.image_url != null
              ? String(r.image_url)
              : null;

    return {
        productId: Number(r.productId ?? r.product_id ?? 0),
        productName: String(r.productName ?? r.product_name ?? ""),
        sku: String(r.sku ?? ""),
        unit: String(r.unit ?? ""),
        minStockLevel: parseDecimalLike(r.minStockLevel ?? r.min_stock_level ?? 0),
        totalPhysical: parseDecimalLike(
            r.totalPhysical ?? r.total_physical ?? r.physical_quantity ?? r.physicalQuantity ?? 0,
        ),
        totalReserved: parseDecimalLike(r.totalReserved ?? r.total_reserved ?? 0),
        availableQuantity: parseDecimalLike(r.availableQuantity ?? r.available_quantity ?? 0),
        isLowStock: Boolean(r.isLowStock ?? r.is_low_stock),
        categoryName: category || categoryFromNested || undefined,
        imageUrl: image && image.length > 0 ? image : null,
    };
}

/** API có thể trả mảng thuần hoặc bọc { data } / { items }. */
export function normalizeInventoryAgingReportFromApi(raw: unknown): InventoryAgingReport {
    if (Array.isArray(raw)) return raw as InventoryAgingReport;
    if (raw && typeof raw === "object") {
        const o = raw as Record<string, unknown>;
        const inner = o.data ?? o.items ?? o.results;
        if (Array.isArray(inner)) return inner as InventoryAgingReport;

        const dataObj = o.data && typeof o.data === "object" ? (o.data as Record<string, unknown>) : undefined;
        const buckets = (dataObj?.buckets ?? o.buckets) as Record<string, unknown> | undefined;
        if (buckets && typeof buckets === "object") {
            const fromBuckets: InventoryAgingReport = [];
            const groups = ["critical", "warning", "good"] as const;
            groups.forEach((group) => {
                const rows = buckets[group];
                if (!Array.isArray(rows)) return;
                rows.forEach((row, idx) => {
                    const r = readRecord(row);
                    const expiry = String(r.expiryDate ?? r.expiry_date ?? "");
                    const diffMs = expiry ? new Date(expiry).getTime() - Date.now() : Number.NaN;
                    const daysUntilExpiry = Number.isFinite(diffMs) ? Math.ceil(diffMs / 86400000) : 0;
                    fromBuckets.push({
                        batchId: Number(r.batchId ?? r.batch_id ?? idx + 1),
                        batchCode: String(r.batchCode ?? r.batch_code ?? ""),
                        productName: String(r.productName ?? r.product_name ?? ""),
                        currentQuantity: parseDecimalLike(r.currentQuantity ?? r.current_quantity ?? r.quantity ?? 0),
                        expiryDate: expiry,
                        daysUntilExpiry,
                        status: group === "critical" ? "expired" : group,
                    });
                });
            });
            return fromBuckets;
        }
    }
    return [];
}

export function normalizeInventoryTransactionLogItem(raw: unknown): InventoryTransactionLogItem {
    const r = readRecord(raw);
    return {
        transactionId: Number(r.transactionId ?? r.transaction_id ?? 0),
        type: String(r.type ?? ""),
        productName: String(r.productName ?? r.product_name ?? ""),
        batchCode: String(r.batchCode ?? r.batch_code ?? ""),
        quantity: parseDecimalLike(r.quantity ?? r.adjustmentQuantity ?? r.adjustment_quantity),
        date: String(r.date ?? r.createdAt ?? r.created_at ?? r.timestamp ?? ""),
        note: r.note != null ? String(r.note) : r.reference != null ? String(r.reference) : null,
        evidenceImage:
            r.evidenceImage != null
                ? String(r.evidenceImage)
                : r.evidence_image != null
                  ? String(r.evidence_image)
                  : null,
    };
}
