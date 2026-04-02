"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import KitchenScanFab from "@/app/kitchen/_components/KitchenScanFab";

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BaseLayout title="Central Kitchen System">
            <div className="min-h-screen bg-zinc-50/50 pb-20 text-zinc-900">
                {children}
            </div>
            <KitchenScanFab />
        </BaseLayout>
    );
}
