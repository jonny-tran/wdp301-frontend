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
        { name: "Tổng quan", href: "/supply", icon: HomeIcon },
        { name: "Đơn hàng", href: "/supply/orders", icon: ClipboardDocumentListIcon },
        { name: "Phân bổ", href: "/supply/allocation", icon: Squares2X2Icon },
        { name: "Giao hàng", href: "/supply/delivery", icon: TruckIcon },
        { name: "Sự cố", href: "/supply/issues", icon: ExclamationTriangleIcon },
    ];

    return (
        <DashboardLayout
            navItems={navItems}
            title="Quản lý Chuỗi cung ứng"
        >
            {children}
        </DashboardLayout>
    );
}
