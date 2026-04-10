import type { Product } from "@/types/product";

/** GET /products có thể trả `items` hoặc `data` là mảng — đồng bộ với ProductClient / RecipeFormModal. */
export function unwrapProductListRows(data: unknown): Product[] {
    if (data == null) return [];
    const r = data as Record<string, unknown>;
    if (Array.isArray(r.data)) return r.data as Product[];
    if (Array.isArray(r.items)) return r.items as Product[];
    if (Array.isArray(data)) return data as Product[];
    return [];
}
