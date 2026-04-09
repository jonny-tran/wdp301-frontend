import type { OrderDetailItem, Product, Store } from "@/types/order";

export function getProductWeightKgFromOrderProduct(p: Product | undefined | null): number {
    if (!p) return 0;
    const w = p.weightKg ?? p.weight_kg;
    if (w == null) return 0;
    const n = Number(w);
    return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function getStoreRouteId(store: Store | undefined | null): string | null {
    if (!store) return null;
    const r = store.routeId ?? store.route_id ?? store.route?.id;
    if (r == null || String(r).trim() === "") return null;
    return String(r);
}

/** Giá đơn vị snapshot — ưu tiên `unit_price_at_order` từ order line */
export function getOrderLineSnapshotUnitPrice(item: OrderDetailItem): string | null {
    const raw = item.unitPriceAtOrder ?? item.unit_price_at_order;
    if (raw == null || String(raw).trim() === "") return null;
    return String(raw);
}
