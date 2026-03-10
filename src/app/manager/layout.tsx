"use client";

import BaseLayout from "@/components/layout/BaseLayout";

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BaseLayout title="Manager Portal">
            {children}
        </BaseLayout>
    );
}
