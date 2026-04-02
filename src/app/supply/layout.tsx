"use client";

import BaseLayout from "@/components/layout/BaseLayout";

export default function SupplyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BaseLayout title="Điều phối Chuỗi Cung Ứng">
            {children}
        </BaseLayout>
    );
}
