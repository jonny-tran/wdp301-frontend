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
    /** Mã hiển thị lệnh (nếu backend trả) */
    orderCode?: string;
    productId: number;
    productName: string;
    sku?: string;
    /** Tên công thức / BOM (list) */
    recipeName?: string;
    /** Nhân viên bếp phụ trách (nếu có) */
    staffName?: string;
    /** Mục tiêu sản lượng (kế hoạch) */
    targetQuantity: number;
    /** Số lượng thực tế sau hoàn tất (chỉ có khi COMPLETED) */
    actualQuantity?: number | null;
    unit: string;
    status: ProductionOrderStatus;
    createdAt: string;
    updatedAt?: string | null;
};

/** Lô được tạm giữ (FEFO) — chi tiết lệnh. */
export type ProductionReservation = {
    batchId?: number;
    batchCode?: string;
    productId?: number;
    productName?: string;
    quantity?: number;
    reservedQuantity?: number;
    expiryDate?: string;
};

export type ProductionLineageRow = {
    parentBatchId?: number;
    parentBatchCode?: string;
    childBatchId?: number;
    childBatchCode?: string;
    consumedQuantity?: number;
};

export type ProductionInventoryTx = {
    id?: string;
    type?: string;
    quantity?: number;
    wasteReason?: string;
    note?: string;
    metadata?: Record<string, unknown>;
    createdAt?: string;
};

export type ProductionOrderDetail = ProductionOrder & {
    recipeId?: string;
    /** Số lượng kế hoạch (alias) */
    plannedQuantity?: number;
    reservations: ProductionReservation[];
    lineage: ProductionLineageRow[];
    inventoryTransactions: ProductionInventoryTx[];
    outputBatchCode?: string;
    outputBatchId?: number;
    outputExpiryDate?: string;
    /** `ingredientProductId` → tên NL từ `recipe.items` (khi reservation không embed product). */
    ingredientLookup?: Record<number, string>;
    /** `normSku` → tên NL (khớp phần đầu mã lô với SKU sản phẩm). */
    ingredientLookupBySku?: Record<string, string>;
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
    /** Tên công thức (server thường gán theo tên TP) */
    recipeName: string;
    productId: number;
    productName: string;
    sku?: string;
    description?: string | null;
    unit: string;
    /** Đầu ra tham chiếu / sản lượng chuẩn (nếu API có) */
    referenceOutput?: number | null;
    /** Số dòng nguyên liệu trong BOM */
    ingredientCount: number;
    isActive: boolean;
};

export type RecipeDetail = RecipeSummary & {
    bom: RecipeBomLine[];
};

export type CompleteProductionResult = {
    batchId: number;
    batchCode: string;
    message?: string;
    /** HSD lô thành phẩm mới (nếu API trả) */
    outputExpiryDate?: string;
    expiryDate?: string;
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
    isActive?: boolean;
};
