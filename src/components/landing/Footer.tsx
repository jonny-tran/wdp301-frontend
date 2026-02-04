import Link from "next/link";
import Image from "next/image";
import { PlayIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/solid";

export default function Footer() {
    return (
        <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-12 mb-16">

                    {/* Logo and Info */}
                    <div className="max-w-xs">
                        <div className="mb-6 flex justify-center md:justify-start">
                            <Image
                                src="/logo.png"
                                alt="VFC Franchise System"
                                width={140}
                                height={140}
                                className="object-contain"
                            />
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed font-sans">
                            Indulge in our mouth-watering fried chicken, made with secret spices and cooked to perfection. Experience it on our web and mobile apps today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-text-main font-bold text-xs uppercase tracking-[0.2em] mb-6">Explore</h4>
                        <ul className="space-y-3">
                            {['Home', 'About Us', 'Our Menu', 'Locations', 'Franchise'].map(link => (
                                <li key={link}>
                                    <Link href="#" className="text-text-muted hover:text-primary text-sm font-medium transition-colors font-sans">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social and App */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-text-main font-bold text-xs uppercase tracking-[0.2em] mb-6">Connect</h4>
                        <div className="flex gap-4 mb-8">
                            <a href="#" className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all duration-300">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all duration-300">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.77 24h20.46c.98 0 1.77-.774 1.77-1.729V1.729C24 .774 23.21 0 22.23 0zM7.12 20.452H3.56V9h3.56v11.452zM5.34 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm17.12 13.019h-3.56v-5.561c0-1.324-.025-3.037-1.85-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H11.35V9h3.42v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-all duration-300">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </a>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button className="bg-text-main text-white rounded-xl px-4 py-2.5 flex items-center gap-3 hover:bg-primary transition-colors min-w-[160px]">
                                <PlayIcon className="w-5 h-5 text-white" />
                                <div className="text-left border-l border-white/20 pl-3">
                                    <div className="text-[7px] uppercase font-bold text-white/40">Available on</div>
                                    <div className="text-xs font-bold leading-tight">Google Play</div>
                                </div>
                            </button>
                            <button className="bg-text-main text-white rounded-xl px-4 py-2.5 flex items-center gap-3 hover:bg-primary transition-colors min-w-[160px]">
                                <DevicePhoneMobileIcon className="w-5 h-5 text-white" />
                                <div className="text-left border-l border-white/20 pl-3">
                                    <div className="text-[7px] uppercase font-bold text-white/40">Download on the</div>
                                    <div className="text-xs font-bold leading-tight">App Store</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-center gap-4">
                    <div className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        © 2026 VFC Franchise System. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link href="#" className="text-text-muted hover:text-primary text-[10px] font-bold uppercase tracking-[0.1em]">Privacy Policy</Link>
                        <Link href="#" className="text-text-muted hover:text-primary text-[10px] font-bold uppercase tracking-[0.1em]">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
