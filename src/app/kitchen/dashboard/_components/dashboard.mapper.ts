export function extractItems(raw: unknown): Record<string, unknown>[] {
    if (!raw || typeof raw !== "object") return [];

    const data = raw as { items?: unknown };
    if (Array.isArray(data.items)) {
        return data.items as Record<string, unknown>[];
    }
    if (Array.isArray(raw)) {
        return raw as Record<string, unknown>[];
    }
    return [];
}

export function countLowStock(items: any[]): number {
    return items.filter((item) => {
        if (item.isLowStock !== undefined) return Boolean(item.isLowStock);
        if (item.is_low_stock !== undefined) return Boolean(item.is_low_stock);

        // Fallback: calculate if possible
        const available = Number(item.availableQuantity ?? item.available_quantity ?? item.totalQuantity ?? 0);
        const minStock = Number(item.minStockLevel ?? item.min_stock_level ?? 0);
        if (minStock > 0) return available <= minStock;

        // If 0, assume it's low
        return available === 0;
    }).length;
}
