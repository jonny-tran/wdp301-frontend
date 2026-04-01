export type BaseUnit = {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
};

/** Query GET /base-units (pagination + lọc theo backend). */
export type QueryBaseUnitList = {
    page?: number;
    limit?: number;
    sortOrder?: "ASC" | "DESC";
    isActive?: boolean;
};

/** Danh sách đơn vị đang hoạt động — dùng cho select (sản phẩm, v.v.). */
export const BASE_UNITS_QUERY_ACTIVE_LIST: QueryBaseUnitList = {
    page: 1,
    limit: 500,
    sortOrder: "DESC",
    isActive: true,
};
