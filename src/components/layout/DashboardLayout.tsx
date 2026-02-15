"use client";

import React, { useState } from "react";
import NavSidebar, { NavItem } from "./NavSidebar";
import Header from "@/components/dashboard/ui/Header";

interface DashboardLayoutProps {
    children: React.ReactNode;
    navItems: NavItem[];
    bottomItems?: NavItem[];
    title?: string;
}

export default function DashboardLayout({
    children,
    navItems,
    bottomItems,
    title,
}: DashboardLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-[#F4F6F0] p-4 gap-4 overflow-hidden font-sans">
            {/* Sidebar - A separate rounded "island" */}
            <NavSidebar
                items={navItems}
                bottomItems={bottomItems}
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />

            {/* Main Content Area - Another separate rounded "island" */}
            <div
                className="flex-1 bg-white rounded-[40px] shadow-sm flex flex-col overflow-hidden transition-all duration-300 relative"
            >
                <Header title={title} />
                <main className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
