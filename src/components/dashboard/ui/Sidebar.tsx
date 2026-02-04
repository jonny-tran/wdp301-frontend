"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    HomeIcon,
    CubeIcon,
    CalendarDaysIcon,
    ArchiveBoxIcon,
    ChartBarIcon,
    // Cog6ToothIcon,
    // QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        // { name: "Dashboard", href: "/kitchen/dashboard", icon: HomeIcon },
        { name: "Inventory", href: "/kitchen/inventory", icon: CubeIcon }, // Material Raw
        { name: "Production Plan", href: "/kitchen/production-plan", icon: CalendarDaysIcon }, // Mapping 'Staff Scheduling' concept
        { name: "Batches", href: "/kitchen/batches", icon: CubeIcon }, // Mapping 'Training Center' concept (Process)
        { name: "Warehouse", href: "/kitchen/warehouse", icon: ArchiveBoxIcon }, //     Mapping 'Inventory'
        // { name: "Reports", href: "/kitchen/reports", icon: ChartBarIcon },
    ];

    // const bottomItems = [
    //     { name: "Support", href: "/kitchen/support", icon: QuestionMarkCircleIcon },
    //     { name: "Settings", href: "/kitchen/settings", icon: Cog6ToothIcon },
    // ];

    return (
        <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-100 z-50 fixed left-0 top-0">
            {/* Logo Area */}
            <div className="p-8 flex items-center gap-3">
                <Image src="/logo.png" alt="VFC" width={40} height={40} className="w-10 h-10 object-contain" />
                <div className="flex flex-col">
                    <span className="font-bebas text-xl tracking-wide text-text-main leading-none">VFC System</span>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Kitchen</span>
                </div>
            </div>

            {/* Main Action Button - Matches 'Dashboard' red button in reference */}
            <div className="px-6 mb-6">
                <Link href="/kitchen/dashboard" className="flex items-center gap-3 bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all group">
                    <HomeIcon className="w-6 h-6" />
                    <span className="font-bold text-sm tracking-wide">Dashboard</span>
                </Link>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <div className="px-4 pb-2">
                    <span className="text-xs font-bold text-text-muted/50 uppercase tracking-widest">Menu</span>
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? "bg-primary/10 text-primary font-bold"
                                : "text-text-muted hover:bg-gray-50 hover:text-text-main font-medium"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Items */}
            {/* <div className="p-4 border-t border-gray-50 space-y-1">
                {bottomItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-gray-50 hover:text-text-main font-medium transition-all"
                    >
                        <item.icon className="w-5 h-5 text-gray-400" />
                        <span className="text-sm">{item.name}</span>
                    </Link>
                ))}
            </div> */}
        </aside>
    );
}
