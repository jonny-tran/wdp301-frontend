import { BaseRequestPagination } from "./base";

export enum ProductType {
    RAW_MATERIAL = "raw_material",
    FINISHED_GOOD = "finished_good",
    RESELL_PRODUCT = "resell_product",
}

export type Product = {
    id: number;
    sku: string;
    name: string;
    /** Loại: nguyên liệu / thành phẩm / mua bán lại (optional nếu bản ghi cũ chưa có) */
    type?: ProductType;
    /** Tên đơn vị — detail/list có thể trả `baseUnitName` thay cho `baseUnit` */
    baseUnitName?: string;
    baseUnit?: string;
    baseUnitId?: number;
    shelfLifeDays: number;
    minStockLevel: number;
    imageUrl: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    restoredAt?: string;
};

export type Batch = {
    id: number;
    batchCode: string;
    productId: number;
    productName: string;
    initialQuantity: number;
    currentQuantity: number;
    expiryDate: string;
    imageUrl?: string;
    status?: string;
    createdAt: string;
    updatedAt?: string;
};


export type QueryProduct = BaseRequestPagination & {
    sortBy?: string;
    search?: string;
    isActive?: boolean;
    /** raw_material | finished_good | resell_product */
    type?: string;
};

export type QueryBatch = BaseRequestPagination & {
    productId?: number;
    supplierId?: number;
    sortBy?: string;
    fromDate?: string;
    toDate?: string;
    search?: string;
};

/** Hiển thị tên đơn vị từ payload sản phẩm (ưu tiên `baseUnitName` như GET /products/:id). */
export function getProductBaseUnitDisplay(
    p: Pick<Product, "baseUnit" | "baseUnitName"> | null | undefined,
): string {
    const u = p?.baseUnitName?.trim() || p?.baseUnit?.trim();
    return u || "—";
}
