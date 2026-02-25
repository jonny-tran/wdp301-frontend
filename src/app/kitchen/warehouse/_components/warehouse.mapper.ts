import { PickingTaskRow } from "./warehouse.types";

export function normalizeTask(task: Record<string, unknown>): PickingTaskRow {
    return {
        orderId: String(task.orderId ?? task.id ?? task.order_id ?? ""),
        storeName: String(task.storeName ?? task.store_name ?? (task.store as { name?: string } | undefined)?.name ?? "Store"),
        status: String(task.status ?? "approved"),
        createdAt: typeof task.createdAt === "string" ? task.createdAt : typeof task.created_at === "string" ? task.created_at : undefined,
        deliveryDate: typeof task.deliveryDate === "string" ? task.deliveryDate : typeof task.delivery_date === "string" ? task.delivery_date : undefined,
        totalItems: Number(task.totalItems ?? task.itemCount ?? task.itemsCount ?? 0),
    };
}

export function extractTasks(raw: unknown): PickingTaskRow[] {
    const response = (raw ?? {}) as any;
    const items = Array.isArray(response.items)
        ? response.items
        : Array.isArray(response.data?.items)
            ? response.data.items
            : Array.isArray(raw)
                ? raw
                : [];

    return items
        .map((item: any) => normalizeTask(item as Record<string, unknown>))
        .filter((task: any) => Boolean(task.orderId));
}
