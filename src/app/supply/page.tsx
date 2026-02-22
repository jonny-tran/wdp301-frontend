import { Suspense } from "react";
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
