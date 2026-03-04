"use client";

import BaseLayout from "@/components/layout/BaseLayout";
import { Role } from "@/utils/enum";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout title="Manager Control Center">
      {children}
    </BaseLayout>
  );
}
