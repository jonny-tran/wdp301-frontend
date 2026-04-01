import type { Product } from "@/types/product";
import { ProductType } from "@/types/product";

/** Hàng mua bán lại / đóng gói NCC — FE bắt buộc HSD khai báo khi nhập (theo nghiệp vụ kitchen). */
export function requiresStatedExpiryForInbound(product: Pick<Product, "type"> | null | undefined): boolean {
    const t = product?.type;
    return String(t ?? "") === ProductType.RESELL_PRODUCT;
}
