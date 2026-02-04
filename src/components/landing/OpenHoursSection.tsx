
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

export default function OpenHoursSection() {
    return (
        <section className="w-full py-24 bg-white relative overflow-hidden">
            {/* Decorative side element */}
            <div className="absolute top-1/2 right-[-5%] transform -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[60px]"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">

                {/* Modern Circular Sign */}
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[12px] border-bg-light flex items-center justify-center bg-white shadow-2xl relative group">
                    <div className="text-center transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                        <span className="block text-primary font-bold text-lg uppercase tracking-widest mb-1 italic">Welcome to VFC</span>
                        <span className="block text-text-main font-black text-5xl uppercase leading-none">We&apos;re</span>
                        <span className="block text-primary font-black text-7xl uppercase leading-none mt-1">OPEN</span>
                    </div>
                    {/* Subtle light effect instead of neon */}
                    <div className="absolute inset-[-15px] rounded-full border border-primary/10 shadow-[0_0_30px_rgba(132,163,87,0.15)]"></div>
                </div>

                <div className="text-center md:text-left max-w-lg">
                    <span className="text-primary font-bold uppercase text-[10px] tracking-[0.3em] mb-4 block">Technical Support</span>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-text-main mb-6 uppercase leading-[0.9]">
                        Need <br />
                        <span className="text-primary">Help?</span>
                    </h2>
                    <div className="space-y-4 mb-10">
                        <p className="text-text-muted text-sm leading-relaxed">
                            Our technical team is available 24/7 to ensure smooth system operations.
                        </p>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <span className="w-8 flex justify-center text-primary"><PhoneIcon className="w-5 h-5" /></span>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Hotline</span>
                                <span className="text-text-main font-sans text-sm font-bold">1900 123 456</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
                            <span className="w-8 flex justify-center text-primary"><EnvelopeIcon className="w-5 h-5" /></span>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</span>
                                <span className="text-text-main font-sans text-sm font-bold">support@vfc-system.com</span>
                            </div>
                        </div>
                    </div>

                    <button className="group relative px-8 py-4 overflow-hidden rounded-full bg-primary text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                        <span className="relative z-10">Contact Now</span>
                        <div className="absolute inset-0 bg-primary-dark transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                    </button>
                </div>

            </div>
        </section>
    );
}
