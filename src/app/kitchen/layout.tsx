"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import { Role } from "@/utils/enum";

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BaseLayout title="Central Kitchen System">
            {children}
        </BaseLayout>
    );
}
