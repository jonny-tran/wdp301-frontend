"use client";

import React, { useMemo } from "react";
import DashboardLayout from "./DashboardLayout";
import { useSessionStore } from "@/stores/sesionStore";
import { checkPermission } from "@/lib/authz";
import { ROLE_NAVIGATION } from "@/config/navigation";
import { Role } from "@/utils/enum";

interface BaseLayoutProps {
    children: React.ReactNode;
    title: string;
}

/**
 * BaseLayout tập trung vào việc quản lý hiển thị UI dựa trên RBAC.
 * Việc chặn truy cập theo Path/Role đã được đảm nhận bởi Middleware (proxy.ts).
 */
export default function BaseLayout({
    children,
    title,
}: BaseLayoutProps) {
    const { user } = useSessionStore();

    // 1. Lọc menu dựa trên permission đã định nghĩa trong navigation.ts
    const filteredNavItems = useMemo(() => {
        if (!user || !user.role) return [];

        const roleItems = ROLE_NAVIGATION[user.role as Role] || [];

        return roleItems.filter(item => {
            // Nếu item menu không yêu cầu quyền đặc biệt thì hiển thị luôn
            if (!item.requiredPermission) return true;

            // Check permission cụ thể cho Resource/Action của menu item
            return checkPermission(
                user,
                item.requiredPermission.resource as any,
                item.requiredPermission.action as any
            );
        });
    }, [user]);

    // Render Dashboard với menu đã được lọc. 
    // Nếu chưa có user (đang trong quá trình hydrate hoặc auth), DashboardLayout sẽ xử lý trạng thái skeleton.
    return (
        <DashboardLayout
            navItems={filteredNavItems}
            title={title}
        >
            {children}
        </DashboardLayout>
    );
}
