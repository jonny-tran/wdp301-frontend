import StoreClient from "./_components/StoreClient";

export const metadata = {
  title: "Quản lý Cửa hàng | Manager Portal",
  description: "Hệ thống quản lý cửa hàng nhượng quyền và kho bãi chi nhánh",
};

export default function StorePage() {
  return (
    <main className="p-4 md:p-10 space-y-8 animate-in fade-in duration-1000">
      <StoreClient />
    </main>
  );
}
