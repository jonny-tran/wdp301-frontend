import { Product, ProductType } from "@/types/product";

export { ProductType };

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
    [ProductType.RAW_MATERIAL]: "Nguyên liệu",
    [ProductType.FINISHED_GOOD]: "Thành phẩm",
    [ProductType.RESELL_PRODUCT]: "Mua bán lại",
};

export const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
    { value: ProductType.RAW_MATERIAL, label: PRODUCT_TYPE_LABELS[ProductType.RAW_MATERIAL] },
    { value: ProductType.FINISHED_GOOD, label: PRODUCT_TYPE_LABELS[ProductType.FINISHED_GOOD] },
    { value: ProductType.RESELL_PRODUCT, label: PRODUCT_TYPE_LABELS[ProductType.RESELL_PRODUCT] },
];

/**
 * Extended product row for table display.
 * Matches backend camelCase directly — no mapper needed.
 */
export type ProductRow = Product;
