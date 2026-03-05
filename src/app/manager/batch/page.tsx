import BatchClient from "./_components/BatchClient";

export const metadata = {
  title: "Quản lý Lô hàng",
  description: "Theo dõi tồn kho theo đợt nhập và hạn sử dụng sản phẩm",
};

export default function BatchPage() {
  return (
    <main className="p-4 md:p-10">
      {/* Component chính chứa logic Fetch, Filter và Phân trang */}
      <BatchClient />
    </main>
  );
}
