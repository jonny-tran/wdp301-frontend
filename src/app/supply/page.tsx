import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Bảng điều khiển Điều phối | VFC",
    description: "Theo dõi trạng thái chuỗi cung ứng và đơn hàng.",
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
