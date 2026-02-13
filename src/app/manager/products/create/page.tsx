import CreateProduct from "../_components/create-product";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thêm sản phẩm mới | Central Kitchen",
};

export default function CreateProductPage() {
  return (
    <div className="container mx-auto py-10">
      <CreateProduct />
    </div>
  );
}