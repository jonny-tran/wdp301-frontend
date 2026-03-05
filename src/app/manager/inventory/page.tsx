import InventoryClient from "./_components/InventoryClient";

// 1. Cấu hình Metadata cho trang
export const metadata = {
  title: "Quản lý Tồn kho | Manager Portal",
  description:
    "Hệ thống theo dõi tồn thực tế, hàng sắp hết hạn và điều chỉnh kho vận",
};


export default function InventoryPage() {
  return (
    <main className="p-4 lg:p-6 min-h-screen bg-slate-50/20">
      <InventoryClient />
    </main>
  );
}
