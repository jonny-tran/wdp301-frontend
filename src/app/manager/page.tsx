import { Suspense } from "react";
import ManagerDashboardClient from "./_components/ManagerDashboardClient";

export default function ManagerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs font-semibold text-slate-400">
          Đang tải Dashboard Manager...
        </div>
      }
    >
      <ManagerDashboardClient />
    </Suspense>
  );
}

