"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useSessionStore } from "@/stores/sesionStore";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
export interface NavItem {
    name: string;
    href: string;
    icon: (props: React.ComponentProps<"svg">) => React.ReactNode;
    onClick?: () => void;
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
    const { logout } = useAuth();
    const handleLogout = () => {
        // check reffreshtoken
        const refreshToken = useSessionStore.getState().refreshToken;
        if (!refreshToken) {
            toast.error("You are not logged in");
            return;
        }
        logout.mutateAsync({ refreshToken });
    }
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
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions and Toggle */}
            <div className="mt-auto px-4 flex flex-col gap-4">
                {bottomItems.map((item) => (
                    item.onClick ? (
                        <button
                            key={item.name}
                            onClick={item.onClick}
                            className={`flex items-center text-white/40 hover:text-white transition-colors ${isCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 gap-4 h-10 w-full"
                                }`}
                            title={isCollapsed ? item.name : ""}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                        </button>
                    ) : (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center text-white/40 hover:text-white transition-colors ${isCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 gap-4 h-10 w-full"
                                }`}
                            title={isCollapsed ? item.name : ""}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                        </Link>
                    )
                ))}

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button
                            className={`flex items-center transition-colors ${isCollapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 gap-4 h-10 w-full"
                                } text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg mt-[5px]`}
                            title={isCollapsed ? "Logout" : ""}
                        >
                            <LogOut className="w-5 h-5 shrink-0 text-red-500" />
                            {!isCollapsed && <span className="text-sm font-medium text-red-500">Logout</span>}
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1A1A1A] border-gray-800 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                Are you sure you want to log out of your session?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white border-none"
                            >
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

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
            </div>
        </aside>
    );
}
