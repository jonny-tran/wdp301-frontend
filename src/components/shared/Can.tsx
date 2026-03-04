"use client";

import React from "react";
import { usePermission } from "@/hooks/usePermission";
import { PermissionType, ResourceType } from "@/lib/authz";

interface CanProps {
    I: PermissionType;
    on: ResourceType;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Universal component for conditional rendering based on RBAC permissions.
 * Usage:
 * <Can I={P.ORDER_APPROVE} on={Resource.ORDER}>
 *    <Button>Approve</Button>
 * </Can>
 */
export default function Can({ I, on, children, fallback = null }: CanProps) {
    const { can } = usePermission();

    if (!can(on, I)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
