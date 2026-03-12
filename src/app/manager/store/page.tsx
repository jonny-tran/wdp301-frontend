import { Suspense } from "react";
import StoreClient from "./_components/StoreClient";

export const metadata = {
  title: "Quản lý Cửa hàng | Manager Portal",
  description: "Hệ thống quản lý cửa hàng nhượng quyền và kho bãi chi nhánh",
};

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-semibold text-slate-400">
          Đang tải danh sách cửa hàng...
        </div>
      }
    >
      <StoreClient />
    </Suspense>
  );
}
