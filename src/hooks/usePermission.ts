import { useSessionStore } from "@/stores/sesionStore";
import { checkPermission, PermissionType, ResourceType } from "@/lib/authz";
import { useCallback } from "react";

export const usePermission = () => {
    const { user } = useSessionStore();

    const can = useCallback((resource: ResourceType, permission: PermissionType): boolean => {
        return checkPermission(user, resource, permission);
    }, [user]);

    return {
        can,
        role: user?.role,
        user
    };
};
