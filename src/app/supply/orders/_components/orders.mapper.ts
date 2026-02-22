import { OrderReview } from "@/types/order";
import { OrderReviewView, OrderRow } from "./orders.types";

export function normalizeOrders(raw: unknown): OrderRow[] {
    if (!raw || typeof raw !== "object") return [];

    const data = raw as { items?: unknown };
    const items = Array.isArray(data.items) ? data.items : [];

    return items
        .map((item) => {
            const row = item as Partial<OrderRow>;
            return {
                id: String(row.id ?? ""),
                storeId: String(row.storeId ?? "-"),
                status: String(row.status ?? "unknown"),
                deliveryDate: row.deliveryDate,
                totalAmount: row.totalAmount,
                createdAt: row.createdAt,
            };
        })
        .filter((row) => row.id.length > 0);
}

export function normalizeReview(raw: unknown): OrderReviewView {
    const data = (raw ?? {}) as Partial<OrderReview>;
    const items = Array.isArray(data.items) ? data.items : [];

    return {
        orderId: data.orderId ?? "-",
        storeName: data.storeName ?? "-",
        status: data.status ?? "-",
        items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            requestedQty: item.requestedQty,
            currentStock: item.currentStock,
            canFulfill: item.canFulfill,
        })),
    };
}
