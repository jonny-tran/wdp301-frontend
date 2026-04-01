import { BaseRequestPagination } from "./base";

/** Trạng thái lệnh sản xuất — khớp backend (uppercase hoặc lowercase). */
export type ProductionOrderStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled";

export type ProductionOrder = {
    id: string;
    productId: number;
    productName: string;
    sku?: string;
    /** Mục tiêu sản lượng (kế hoạch) */
    targetQuantity: number;
    /** Số lượng thực tế sau hoàn tất (chỉ có khi COMPLETED) */
    actualQuantity?: number | null;
    unit: string;
    status: ProductionOrderStatus;
    createdAt: string;
    updatedAt?: string | null;
};

export type RecipeBomLine = {
    ingredientProductId: number;
    ingredientName: string;
    sku?: string;
    /** Định mức cho một đơn vị đầu ra tham chiếu (hoặc đã scale theo API) */
    standardQuantity: number;
    unit: string;
};

export type RecipeSummary = {
    id: string;
    productId: number;
    productName: string;
    sku?: string;
    description?: string | null;
    unit: string;
    /** Đầu ra tham chiếu của công thức (nếu backend trả về) */
    referenceOutput?: number | null;
};

export type RecipeDetail = RecipeSummary & {
    bom: RecipeBomLine[];
};

export type CompleteProductionResult = {
    batchId: number;
    batchCode: string;
    message?: string;
};

export type QueryProductionOrder = BaseRequestPagination & {
    sortBy?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
};

export type QueryRecipeList = BaseRequestPagination & {
    sortBy?: string;
    search?: string;
};
