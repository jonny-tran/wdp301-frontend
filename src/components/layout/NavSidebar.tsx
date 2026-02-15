"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    HomeIcon,
    CubeIcon,
    CalendarDaysIcon,
    ArchiveBoxIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

export interface NavItem {
    name: string;
    href: string;
    icon: (props: React.ComponentProps<"svg">) => React.ReactNode;
}

interface NavSidebarProps {
    items: NavItem[];
    logo?: string;
    bottomItems?: NavItem[];
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export default function NavSidebar({
    items,
    logo = "/logo.png",
    bottomItems = [],
    isCollapsed = false,
    onToggle
}: NavSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={`relative flex flex-col z-50 transition-all duration-300 bg-[#1A1A1A] rounded-[40px] shadow-2xl overflow-hidden py-8 shrink-0 ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Logo and Header */}
            <div className={`px-4 mb-10 flex items-center transition-all duration-300 ${isCollapsed ? "justify-center" : "justify-between"}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                        <Image src={logo} alt="Logo" width={28} height={28} className="object-contain" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bebas text-lg text-white leading-none whitespace-nowrap">VFC System</span>
                            <span className="text-[10px] uppercase font-bold text-primary tracking-widest whitespace-nowrap">Dashboard</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 flex flex-col gap-2 px-3">
                {items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative group/item flex items-center rounded-2xl transition-all duration-300 py-3 ${isCollapsed ? "justify-center px-0 h-12 w-12 mx-auto" : "px-4 gap-4 w-full"
                                } ${isActive
                                    ? "bg-white text-gray-900 shadow-xl"
                                    : "text-white/40 hover:text-white hover:bg-white/10"
                                }`}
                            title={isCollapsed ? item.name : ""}
                        >
                            <item.icon className={`${isCollapsed ? "w-6 h-6" : "w-5 h-5"} shrink-0`} />

                            {!isCollapsed && (
                                <span className="text-sm font-bold whitespace-nowrap overflow-hidden">
                                    {item.name}
                                </span>
                            )}

                            {/* Tooltip on hover (only when collapsed) */}
                            {isCollapsed && (
                                <span className="absolute left-full ml-4 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-50">
                                    {item.name}
                                </span>
                            )}

                            {/* Active indicator dot */}
                            {isActive && (
                                <div className={`absolute bg-primary rounded-full shadow-[0_0_8px_rgba(132,163,87,0.8)] ${isCollapsed
                                        ? "-right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5"
                                        : "right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5"
                                    }`} />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions and Toggle */}
            <div className="mt-auto px-4 flex flex-col gap-4">
                {bottomItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center text-white/40 hover:text-white transition-colors ${isCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 gap-4 h-10 w-full"
                            }`}
                        title={isCollapsed ? item.name : ""}
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                    </Link>
                ))}

                {/* Collapse/Expand Toggle Button */}
                <button
                    onClick={onToggle}
                    className={`flex items-center text-white/40 hover:text-white transition-colors w-full cursor-pointer ${isCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 gap-4 h-10"
                        }`}
                >
                    {isCollapsed ? (
                        <ChevronRightIcon className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeftIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Collapse</span>
                        </>
                    )}
                </button>

                <div className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? "justify-center" : "px-4"}`}>
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 p-0.5 overflow-hidden shrink-0">
                        <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                            M
                        </div>
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-white whitespace-nowrap">Admin User</span>
                            <span className="text-[10px] text-white/40 whitespace-nowrap">Manager</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
