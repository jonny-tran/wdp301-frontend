import ProductDetail from "../_components/product-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm | Central Kitchen",
};

export default function ProductDetailPage() {
  return (
    <div className="container mx-auto py-6">
      <ProductDetail />
    </div>
  );
}
