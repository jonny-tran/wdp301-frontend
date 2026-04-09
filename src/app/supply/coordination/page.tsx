import { Metadata } from "next";
import { Suspense } from "react";
import CoordinationHubClient from "./_components/CoordinationHubClient";


export const metadata: Metadata = {
    title: "Trung tâm điều phối | Supply Coordinator",
    description: "Tổng cầu theo ngày giao, Inquiry bếp, và duyệt hàng loạt theo phân bổ.",
};

function Fallback() {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 text-sm text-text-muted shadow-sm">
            Đang tải Trung tâm điều phối…
        </div>
    );
}

export default function SupplyCoordinationHubPage() {
    return (
        <Suspense fallback={<Fallback />}>
            <CoordinationHubClient />
        </Suspense>
    );
}

