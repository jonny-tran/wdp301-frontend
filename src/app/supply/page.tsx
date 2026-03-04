import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Supply Coordinator Dashboard | VFC",
    description: "Monitor supply chain status and order fulfillment.",
};
import SupplyDashboardClient from "./_components/SupplyDashboardClient";

function SupplyDashboardFallback() {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 text-sm text-text-muted shadow-sm">
            Loading supply dashboard...
        </div>
    );
}

export default function SupplyPage() {
    return (
        <Suspense fallback={<SupplyDashboardFallback />}>
            <SupplyDashboardClient />
        </Suspense>
    );
}
