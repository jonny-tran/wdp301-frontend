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
        { name: "Tổng quan", href: "/kitchen/dashboard", icon: HomeIcon },
        { name: "Kho hàng", href: "/kitchen/inventory", icon: CubeIcon },
        { name: "Nhập kho", href: "/kitchen/inbound", icon: InboxArrowDownIcon },
        { name: "Lô hàng", href: "/kitchen/batches", icon: CubeIcon },
        { name: "Nhà kho", href: "/kitchen/warehouse", icon: ArchiveBoxIcon },
    ];

    const bottomItems: NavItem[] = [
        // Add bottom items if needed
    ];

    return (
        <DashboardLayout
            navItems={navItems}
            title="Quản lý Bếp trung tâm"
        >
            {children}
        </DashboardLayout>
    );
}
