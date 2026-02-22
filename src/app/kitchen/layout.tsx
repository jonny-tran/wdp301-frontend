"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { NavItem } from "@/components/layout/NavSidebar";
import {
    CubeIcon,
    CalendarDaysIcon,
    ArchiveBoxIcon,
    HomeIcon,
    InboxArrowDownIcon
} from "@heroicons/react/24/outline";
import { permission } from "@/utils/helper";
export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {





    const navItems = [
        { name: "Dashboard", href: "/kitchen/dashboard", icon: HomeIcon },
        { name: "Inventory", href: "/kitchen/inventory", icon: CubeIcon },
        { name: "Inbound", href: "/kitchen/inbound", icon: InboxArrowDownIcon },
        { name: "Batches", href: "/kitchen/batches", icon: CubeIcon },
        { name: "Warehouse", href: "/kitchen/warehouse", icon: ArchiveBoxIcon },
    ];

    const bottomItems: NavItem[] = [
        // Add bottom items if needed
    ];

    return (
        <DashboardLayout
            navItems={navItems}
            title="Kitchen Management"
        >
            {children}
        </DashboardLayout>
    );
}
