"use client";

import BaseLayout from "@/components/layout/BaseLayout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BaseLayout title="Admin Portal">
            {children}
        </BaseLayout>
    );
}
