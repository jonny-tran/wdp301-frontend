export type RawSearchParams = { [key: string]: string | string[] | undefined };

type SortOrder = "ASC" | "DESC";

export type ParsedKitchenListQuery = {
    page: number;
    limit: number;
    sortOrder: SortOrder;
    search?: string;
    date?: string;
};

function readValue(value: string | string[] | undefined): string | undefined {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}

function toPositiveInt(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toSortOrder(value: string | undefined, fallback: SortOrder): SortOrder {
    if (!value) return fallback;
    return value === "ASC" ? "ASC" : "DESC";
}

function normalizeString(value: string | undefined): string | undefined {
    const next = value?.trim();
    return next ? next : undefined;
}

export function parseKitchenListQuery(
    searchParams: RawSearchParams,
    defaults?: Partial<ParsedKitchenListQuery>,
): ParsedKitchenListQuery {
    const page = toPositiveInt(readValue(searchParams.page), defaults?.page ?? 1);
    const limit = toPositiveInt(readValue(searchParams.limit), defaults?.limit ?? 10);
    const sortOrder = toSortOrder(readValue(searchParams.sortOrder), defaults?.sortOrder ?? "DESC");

    return {
        page,
        limit,
        sortOrder,
        search: normalizeString(readValue(searchParams.search) ?? defaults?.search),
        date: normalizeString(readValue(searchParams.date) ?? defaults?.date),
    };
}

export type PaginationMeta = {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
};

export function normalizeMeta(rawMeta: unknown, page: number, limit: number, fallbackTotalItems: number): PaginationMeta {
    const meta = (rawMeta ?? {}) as Partial<PaginationMeta>;

    const currentPage = typeof meta.currentPage === "number" && meta.currentPage > 0 ? meta.currentPage : page;
    const itemsPerPage = typeof meta.itemsPerPage === "number" && meta.itemsPerPage > 0 ? meta.itemsPerPage : limit;
    const totalItems = typeof meta.totalItems === "number" && meta.totalItems >= 0 ? meta.totalItems : fallbackTotalItems;
    const itemCount = typeof meta.itemCount === "number" && meta.itemCount >= 0 ? meta.itemCount : fallbackTotalItems;

    const computedTotalPages = itemsPerPage > 0 ? Math.max(1, Math.ceil(totalItems / itemsPerPage)) : 1;
    const totalPages = typeof meta.totalPages === "number" && meta.totalPages > 0 ? meta.totalPages : computedTotalPages;

    return {
        currentPage,
        itemsPerPage,
        totalItems,
        itemCount,
        totalPages,
    };
}

export function createPaginationSearchParams(current: URLSearchParams, nextPage: number) {
    const params = new URLSearchParams(current.toString());
    params.set("page", String(nextPage));
    return params.toString();
}
