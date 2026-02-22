"use client";
import { useMemo } from "react";
import { useSessionStore } from "@/stores/sesionStore";
import { Role } from "@/utils/enum";

const ROLE_LABEL: Record<Role, string> = {
    [Role.ADMIN]: "Admin",
    [Role.MANAGER]: "Manager",
    [Role.SUPPLY_COORDINATOR]: "Supply Coordinator",
    [Role.CENTRAL_KITCHEN_STAFF]: "Central Kitchen",
    [Role.FRANCHISE_STORE_STAFF]: "Franchise Staff",
};

export default function Header({ title = "Dashboard" }: { title?: string }) {
    const user = useSessionStore((state) => state.user);
    const todayText = useMemo(
        () =>
            new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }),
        [],
    );

    const username = user?.username || "Unknown User";
    const roleLabel = user?.role ? ROLE_LABEL[user.role] : "No Role";

    return (
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-gray-100 bg-white/80 px-8 backdrop-blur-sm">
            <div>
                <h1 className="text-2xl font-extrabold text-text-main">{title}</h1>
                <p className="text-xs font-medium text-text-muted capitalize">{todayText}</p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {username.slice(0, 1).toUpperCase()}
                </div>
                <div className="text-right">
                    {/* <p className="text-sm font-bold leading-tight text-text-main">{username}</p> */}
                    <p className="text-[11px] font-medium text-text-muted">{roleLabel}</p>
                    {user?.storeId && (
                        <p className="text-[10px] text-text-muted">Store: {user.storeId}</p>
                    )}
                </div>
                <div className="h-8 w-[1px] bg-gray-200" />
                {/* <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Mode</p>
                    <p className="text-xs font-bold text-text-main">API-driven</p>
                </div> */}
                    </div>
        </header>
    );
}
