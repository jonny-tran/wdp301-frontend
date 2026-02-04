import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function AppPromoSection() {
    return (
        <section className="relative w-full py-20 bg-primary overflow-hidden">
            {/* Texture/Pattern background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
            </div>

            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative z-10">

                {/* Left Side: Text */}
                <div className="w-full md:w-1/2 text-left mb-10 md:mb-0">
                    <span className="inline-block px-3 py-1 bg-white/20 text-white text-[10px] font-bold tracking-[0.2em] rounded-sm uppercase mb-4">
                        Mobile App
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 uppercase leading-tight drop-shadow-sm">
                        For Franchise <br />
                        Store Staff
                    </h2>
                    <p className="text-white/90 mb-8 max-w-sm font-sans text-sm leading-relaxed">
                        A specialized mobile application helping store staff create orders, track delivery status, and provide quality feedback instantly.
                    </p>

                    <ul className="space-y-3 mb-8">
                        {[
                            "Create orders from Central Kitchen",
                            "Track real-time order status",
                            "Confirm Receipt & Feedback",
                            "View Store Inventory"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-white text-sm font-medium">
                                <CheckCircleIcon className="w-5 h-5 text-white" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg hover:bg-gray-50 transition-colors">
                        Download App
                    </button>
                </div>

                {/* Right Side: Phone Mockups */}
                <div className="w-full md:w-1/2 relative h-[450px] flex justify-center md:justify-end items-center mt-10 md:mt-0">
                    {/* Creating a more modern phone mockup */}
                    <div className="relative w-[200px] h-[400px] bg-white rounded-[2.5rem] border-[6px] border-[#1a1a1a] shadow-2xl rotate-[-5deg] z-10 overflow-hidden transform md:translate-x-12">
                        <div className="w-full h-full bg-bg-light flex flex-col p-0">
                            <div className="h-6 w-full flex justify-between items-center px-4 pt-2 bg-primary">
                                <div className="w-12 h-1 bg-white/50 rounded-full"></div>
                            </div>
                            {/* App Interface Mockup */}
                            <div className="flex-1 bg-bg-light p-4 flex flex-col gap-3">
                                <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-2">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-2">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Bottom Nav */}
                            <div className="h-14 bg-white border-t border-gray-100 flex justify-around items-center px-2">
                                <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
                                <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                                <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
