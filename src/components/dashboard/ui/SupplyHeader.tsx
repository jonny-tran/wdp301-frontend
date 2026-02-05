"use client";
import {
    MagnifyingGlassIcon,
    BellIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";

interface SupplyHeaderProps {
    title?: string;
}

export default function SupplyHeader({ title }: SupplyHeaderProps) {
    return (
        <header className="h-24 bg-white/50 backdrop-blur-sm sticky top-0 z-40 px-8 flex items-center justify-between">
            {/* Title */}
            <div>
                <h1 className="text-2xl font-extrabold text-text-main">{title || ""}</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-12 hidden md:block">
                <div className="relative group">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search orders, deliveries..."
                        className="w-full bg-bg-light border-none rounded-full py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <BellIcon className="w-6 h-6 text-text-main" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200"></div>

                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-blue-100 text-blue-600">
                        <UserCircleIcon className="w-full h-full" />
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-sm font-bold text-text-main leading-tight">Supply Coord</p>
                        <p className="text-[10px] text-text-muted font-medium">Logistics Team</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
