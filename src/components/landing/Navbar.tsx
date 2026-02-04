"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import LoginPage from "@/app/auth/login/page";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

            {/* Action Section - Right */}
            <div className="flex items-center space-x-6 flex-shrink-0">
                <span className="hidden xl:inline-block text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Support 24/7</span>
                <button type="button" className="bg-primary text-white hover:bg-primary-dark font-bold rounded-full text-xs px-8 py-3 transition-all duration-300 uppercase tracking-widest shadow-sm shadow-primary/20">
                    <Link href="/auth/login">Login</Link>
                </button>
            </div>
        </nav>
    );
}
