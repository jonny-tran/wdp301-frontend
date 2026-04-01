import {
    createPaginationSearchParams,
    normalizeMeta,
    parseKitchenListQuery,
    readValue,
    type PaginationMeta,
    type ParsedKitchenListQuery,
    type RawSearchParams,
} from "@/app/kitchen/_components/query";

export type KitchenStockStatusFilter = "all" | "in_stock" | "low_stock" | "out_of_stock";

export type ParsedKitchenInventoryQuery = ParsedKitchenListQuery & {
    stockStatus: KitchenStockStatusFilter;
    category: string;
};

function normalizeStockStatus(value: string | undefined): KitchenStockStatusFilter {
    if (value === "in_stock" || value === "low_stock" || value === "out_of_stock") return value;
    return "all";
}

export function parseKitchenInventoryQuery(
    searchParams: RawSearchParams,
    defaults?: Partial<ParsedKitchenInventoryQuery>,
): ParsedKitchenInventoryQuery {
    const base = parseKitchenListQuery(searchParams, defaults);
    const stockStatus = normalizeStockStatus(readValue(searchParams.stockStatus));
    const rawCat = readValue(searchParams.category)?.trim();
    const category = rawCat && rawCat.length > 0 ? rawCat : (defaults?.category ?? "all");

    return {
        ...base,
        stockStatus,
        category,
    };
}

export function normalizeKitchenInventoryMeta(
    rawMeta: unknown,
    page: number,
    limit: number,
    fallbackTotalItems: number,
): PaginationMeta {
    return normalizeMeta(rawMeta, page, limit, fallbackTotalItems);
}

export { createPaginationSearchParams };
