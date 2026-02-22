export type RawSearchParams = { [key: string]: string | string[] | undefined };

type SortOrder = "ASC" | "DESC";

export type ParsedListQuery = {
    page: number;
    limit: number;
    sortOrder: SortOrder;
    search?: string;
    status?: string;
    storeId?: string;
    fromDate?: string;
    toDate?: string;
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

export function parseListQuery(
    searchParams: RawSearchParams,
    defaults?: Partial<ParsedListQuery>,
): ParsedListQuery {
    const page = toPositiveInt(readValue(searchParams.page), defaults?.page ?? 1);
    const limit = toPositiveInt(readValue(searchParams.limit), defaults?.limit ?? 10);
    const sortOrder = toSortOrder(readValue(searchParams.sortOrder), defaults?.sortOrder ?? "DESC");

    return {
        page,
        limit,
        sortOrder,
        search: normalizeString(readValue(searchParams.search) ?? defaults?.search),
        status: normalizeString(readValue(searchParams.status) ?? defaults?.status),
        storeId: normalizeString(readValue(searchParams.storeId) ?? defaults?.storeId),
        fromDate: normalizeString(readValue(searchParams.fromDate) ?? defaults?.fromDate),
        toDate: normalizeString(readValue(searchParams.toDate) ?? defaults?.toDate),
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
