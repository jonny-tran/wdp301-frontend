"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    HomeIcon,
    ClipboardDocumentListIcon,
    TruckIcon,
    ExclamationTriangleIcon,
    Squares2X2Icon
} from "@heroicons/react/24/outline";

export default function SupplySidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Orders", href: "/supply/orders", icon: ClipboardDocumentListIcon },
        { name: "Allocation", href: "/supply/allocation", icon: Squares2X2Icon },
        { name: "Delivery", href: "/supply/delivery", icon: TruckIcon },
        { name: "Issues", href: "/supply/issues", icon: ExclamationTriangleIcon },
    ];

    return (
        <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-100 z-50 fixed left-0 top-0">
            {/* Logo Area */}
            <div className="p-8 flex items-center gap-3">
                <Image src="/logo.png" alt="VFC" width={40} height={40} className="w-10 h-10 object-contain" />
                <div className="flex flex-col">
                    <span className="font-bebas text-xl tracking-wide text-text-main leading-none">VFC System</span>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Supply Chain</span>
                </div>
            </div>

            {/* Main Action Button */}
            <div className="px-6 mb-6">
                <Link href="/supply" className="flex items-center gap-3 bg-primary text-white p-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all group">
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
        </aside>
    );
}
