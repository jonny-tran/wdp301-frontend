import { Suspense } from "react";
import ManagerDashboardClient from "../_components/ManagerDashboardClient";
import { Skeleton } from "@/components/ui/skeleton";

/** * Skeleton Loading cho Dashboard
 * Thay vì để trắng trang, ta hiện các khung giả để tránh bị "nháy"
 */
function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[400px] rounded-2xl" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    // Bọc Suspense với Skeleton chuẩn để trải nghiệm mượt mà
    <Suspense fallback={<DashboardSkeleton />}>
      <ManagerDashboardClient />
    </Suspense>
  );
}
