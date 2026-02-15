"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { checkPermission } from "@/lib/authz";
import { useSessionStore } from "@/stores/sesionStore";
import { Resource, Action } from "@/utils/constant";
import {
    CubeIcon,
    CalendarDaysIcon,
    ArchiveBoxIcon,
    HomeIcon,
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
        { name: "Production Plan", href: "/kitchen/production-plan", icon: CalendarDaysIcon },
        { name: "Batches", href: "/kitchen/batches", icon: CubeIcon },
        { name: "Warehouse", href: "/kitchen/warehouse", icon: ArchiveBoxIcon },
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
