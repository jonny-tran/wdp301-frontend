import { Suspense } from "react";
import DashboardClient from "./_components/DashboardClient";

export const metadata = {
  title: "Admin Dashboard | Central Kitchen System",
  description: "Tổng quan hệ thống quản lý chuỗi cung ứng trung tâm",
};

export default function AdminDashboardPage() {
  return (
    <main className="p-4 md:p-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-[3px] border-slate-100 border-t-primary rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Đang khởi tạo Dashboard...
              </p>
            </div>
          </div>
        }
      >
        <DashboardClient />
      </Suspense>
    </main>
  );
}
