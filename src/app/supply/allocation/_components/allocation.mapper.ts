import { OrderCard, ShipmentCard } from "./allocation.types";

export function extractOrders(raw: unknown): OrderCard[] {
    if (!raw || typeof raw !== "object") return [];
    const data = raw as { items?: unknown };
    const items = Array.isArray(data.items) ? data.items : [];

    return items
        .map((item) => {
            const row = item as Partial<OrderCard>;
            return {
                id: String(row.id ?? ""),
                storeId: String(row.storeId ?? "-"),
                status: String(row.status ?? "unknown"),
                deliveryDate: row.deliveryDate,
            };
        })
        .filter((item) => item.id.length > 0);
}

export function extractShipments(raw: unknown): ShipmentCard[] {
    if (!raw || typeof raw !== "object") return [];
    const data = raw as { items?: unknown };
    const items = Array.isArray(data.items) ? data.items : [];

    return items
        .map((item) => {
            const row = item as Partial<ShipmentCard>;
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
