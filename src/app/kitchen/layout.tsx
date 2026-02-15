"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    CubeIcon,
    CalendarDaysIcon,
    ArchiveBoxIcon,
    HomeIcon
} from "@heroicons/react/24/outline";

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navItems = [
        { name: "Dashboard", href: "/kitchen/dashboard", icon: HomeIcon },
        { name: "Inventory", href: "/kitchen/inventory", icon: CubeIcon },
        { name: "Production Plan", href: "/kitchen/production-plan", icon: CalendarDaysIcon },
        { name: "Batches", href: "/kitchen/batches", icon: CubeIcon },
        { name: "Warehouse", href: "/kitchen/warehouse", icon: ArchiveBoxIcon },
    ];

    const bottomItems: any[] = [
        // Add bottom items if needed
    ];

    return (
        <DashboardLayout
            navItems={navItems}
            bottomItems={bottomItems}
            title="Kitchen Management"
        >
            {children}
        </DashboardLayout>
    );
}
