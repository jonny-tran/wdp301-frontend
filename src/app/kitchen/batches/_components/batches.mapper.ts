import { Batch } from "@/types/product";

export function extractBatches(raw: unknown): Batch[] {
    const data = (raw ?? {}) as { items?: unknown };
    const items = Array.isArray(data.items) ? (data.items as any[]) : [];

    return items.map(item => ({
        ...item,
        initialQuantity: item.initialQuantity ?? item.currentQuantity ?? 0
    })) as Batch[];
}
