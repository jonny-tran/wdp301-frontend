"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import { Role } from "@/utils/enum";

export default function SupplyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BaseLayout title="Quản lý Chuỗi cung ứng">
            {children}
        </BaseLayout>
    );
}
