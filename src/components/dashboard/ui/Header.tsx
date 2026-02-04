"use client";
import {
    MagnifyingGlassIcon,
    BellIcon,
    ShoppingCartIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Header({ title = "Dashboard" }: { title?: string }) {
    return (
        <header className="h-24 bg-white/50 backdrop-blur-sm sticky top-0 z-40 px-8 flex items-center justify-between">
            {/* Title */}
            <div>
                <h1 className="text-2xl font-extrabold text-text-main">{title}</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-12 hidden md:block">
                <div className="relative group">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search here..."
                        className="w-full bg-bg-light border-none rounded-full py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ShoppingCartIcon className="w-6 h-6 text-text-main" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                </button>
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <BellIcon className="w-6 h-6 text-text-main" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200"></div>

                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        {/* Placeholder Avatar */}
                        <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold">K</div>
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-sm font-bold text-text-main leading-tight">Kitchen Mgr</p>
                        <p className="text-[10px] text-text-muted font-medium">Head Chef</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
