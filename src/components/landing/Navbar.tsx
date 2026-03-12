"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSessionStore } from "@/stores/sesionStore";
import { useRouter } from "next/navigation";
import { Role } from "@/utils/enum";
import {
    UserIcon,
    ArrowRightOnRectangleIcon,
    Squares2X2Icon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const router = useRouter();
    const user = useSessionStore((state) => state.user);
    const clearSession = useSessionStore((state) => state.clearSession);

    const roleRedirects: Record<string, string> = {
        [Role.ADMIN]: "/admin",
        [Role.MANAGER]: "/manager",
        [Role.SUPPLY_COORDINATOR]: "/supply",
        [Role.CENTRAL_KITCHEN_STAFF]: "/kitchen/dashboard",
        [Role.FRANCHISE_STORE_STAFF]: "/",
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        clearSession();
        router.push("/");
        setIsDropdownOpen(false);
    };

    const dashboardLink = user ? roleRedirects[user.role as Role] || "/" : "/";

    return (
        <nav className={`fixed w-full z-50 top-0 start-0 transition-all duration-300 py-4 px-6 md:px-12 flex justify-between items-center ${isScrolled ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm" : "bg-transparent border-transparent"}`}>

            {/* Logo Section - Left */}
            <div className="flex-shrink-0">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="VFC Franchise System"
                        width={150}
                        height={150}
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Menu Section - Centered */}
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2" id="navbar-default">
                <ul className="font-bold flex p-4 md:p-0 border border-gray-100 rounded-lg md:flex-row md:space-x-10 md:mt-0 md:border-0 uppercase text-sm tracking-wider">
                    <li>
                        <Link href="#" className="block py-2 px-3 text-primary transition-colors" aria-current="page">Home</Link>
                    </li>
                    <li>
                        <Link href="#" className="block py-2 px-3 text-text-muted hover:text-primary transition-colors">About</Link>
                    </li>
                    <li>
                        <Link href="#" className="block py-2 px-3 text-text-muted hover:text-primary transition-colors">Roles</Link>
                    </li>
                    <li>
                        <Link href="#" className="block py-2 px-3 text-text-muted hover:text-primary transition-colors">Mobile App</Link>
                    </li>
                    <li>
                        <Link href="#" className="block py-2 px-3 text-text-muted hover:text-primary transition-colors">Contact</Link>
                    </li>
                </ul>
            </div>

            {/* Action Section */}
            <div className="flex items-center space-x-6 flex-shrink-0">
                <span className="hidden xl:inline-block text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Support 24/7</span>

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-3 bg-white border border-slate-100 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all active:scale-95 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-[10px] font-black text-text-main uppercase leading-none">{user.username}</p>
                                <p className="text-[8px] font-bold text-text-muted uppercase tracking-wider mt-0.5">{user.role.replace(/_/g, ' ')}</p>
                            </div>
                            <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-50 overflow-hidden z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                    <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                                        <p className="text-xs font-black text-text-main uppercase">{user.username}</p>
                                        <p className="text-[10px] text-text-muted mt-1 truncate">{user.email}</p>
                                    </div>
                                    <div className="p-2">
                                        <Link
                                            href={dashboardLink}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl text-text-muted hover:bg-slate-50 hover:text-primary transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <Squares2X2Icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-3 w-full px-4 py-3 rounded-2xl text-text-muted hover:bg-red-50 hover:text-red-500 transition-all group mt-1"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/auth/login"
                        className="relative inline-flex items-center justify-center bg-primary text-white font-bold rounded-full text-[10px] md:text-xs px-8 py-3 transition-all duration-300 uppercase tracking-widest shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-105 active:scale-95 overflow-hidden group"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform"></span>
                        <span className="relative z-10">Login</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
