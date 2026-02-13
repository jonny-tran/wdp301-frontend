import EditProduct from "../../_components/edit-product";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉnh sửa sản phẩm | Central Kitchen",
};

export default function EditProductPage() {
  return (
    <div className="container mx-auto py-10">
      <EditProduct />
    </div>
  );
}
