import { PickingDetail, PickingItem, ShipmentRow } from "./delivery.types";

export function extractShipments(raw: unknown): ShipmentRow[] {
    if (!raw || typeof raw !== "object") return [];
    const data = raw as { items?: unknown };
    const items = Array.isArray(data.items) ? data.items : [];

    return items
        .map((item) => {
            const row = item as Partial<ShipmentRow>;
            return {
                id: String(row.id ?? ""),
                orderId: row.orderId,
                storeName: row.storeName,
                status: row.status,
                shipDate: row.shipDate,
            };
        })
        .filter((item) => item.id.length > 0);
}

export function normalizePicking(raw: unknown): PickingDetail {
    const data = (raw ?? {}) as Record<string, unknown>;
    const itemsRaw = Array.isArray(data.items) ? data.items : [];

    const items: PickingItem[] = itemsRaw.map((item) => {
        const row = item as Record<string, unknown>;
        return {
            productName: (row.productName as string | undefined) ?? (row.product_name as string | undefined),
            sku: row.sku as string | undefined,
            batchCode: (row.batchCode as string | undefined) ?? (row.batch_code as string | undefined),
            quantity: row.quantity as string | number | undefined,
            expiryDate: (row.expiryDate as string | undefined) ?? (row.expiry_date as string | undefined),
        };
    });

    return {
        shipmentId: (data.shipmentId as string | undefined) ?? (data.shipment_id as string | undefined),
        orderId: (data.orderId as string | undefined) ?? (data.order_id as string | undefined),
        storeName: (data.storeName as string | undefined) ?? (data.store_name as string | undefined),
        status: data.status as string | undefined,
        items,
    };
}
