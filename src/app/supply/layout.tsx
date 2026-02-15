"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    ClipboardDocumentListIcon,
    TruckIcon,
    ExclamationTriangleIcon,
    Squares2X2Icon,
    HomeIcon
} from "@heroicons/react/24/outline";



export default function SupplyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const navItems = [
        { name: "Dashboard", href: "/supply", icon: HomeIcon },
        { name: "Orders", href: "/supply/orders", icon: ClipboardDocumentListIcon },
        { name: "Allocation", href: "/supply/allocation", icon: Squares2X2Icon },
        { name: "Delivery", href: "/supply/delivery", icon: TruckIcon },
        { name: "Issues", href: "/supply/issues", icon: ExclamationTriangleIcon },
    ];

    return (
        <DashboardLayout
            navItems={navItems}
            title="Supply Chain Management"
        >
            {children}
        </DashboardLayout>
    );
}
