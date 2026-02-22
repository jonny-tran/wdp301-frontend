
import { Suspense } from "react";
import DashboardClient from "./_components/DashboardClient";
import DashboardSkeleton from "./_components/DashboardSkeleton";

export default function KitchenDashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardClient />
        </Suspense>
    );
}
