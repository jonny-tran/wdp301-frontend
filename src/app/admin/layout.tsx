"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import { Role } from "@/utils/enum";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout title="Admin Management">
      {children}
    </BaseLayout>
  );
}
