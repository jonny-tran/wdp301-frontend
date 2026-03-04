
import { Metadata } from "next";
import { Suspense } from "react";
import DashboardClient from "./_components/DashboardClient";

export const metadata: Metadata = {
    title: "Kitchen Dashboard | VFC",
    description: "Real-time kitchen operations and inventory monitoring.",
};
import DashboardSkeleton from "./_components/DashboardSkeleton";


export default function KitchenDashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardClient />
        </Suspense>
    );
}
