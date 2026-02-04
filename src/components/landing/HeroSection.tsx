import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="relative w-full min-h-screen flex items-center bg-bg-light overflow-hidden pt-20">
            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="text-left space-y-6">
                    <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold tracking-[0.2em] rounded-sm uppercase mb-2">
                        System Management
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-text-main leading-none uppercase">
                        CENTRAL KITCHEN <br />
                        <span className="text-primary italic">MANAGEMENT SYSTEM</span> <br />
                        & FRANCHISE STORE
                    </h1>
                    <p className="text-text-muted text-base max-w-lg leading-relaxed font-sans">
                        A centralized, accurate, and real-time software solution. Ensuring synchronized operations, minimizing waste, and maintaining product quality from the central kitchen to every franchise store.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <button className="bg-primary text-white px-8 py-4 font-bold rounded-full hover:bg-primary-dark transition-all duration-300 uppercase tracking-[0.15em] text-xs shadow-lg shadow-primary/30">
                            Access System
                        </button>
                        <div className="hidden lg:flex items-center gap-2 text-primary opacity-40">
                            <div className="w-12 h-[1px] bg-primary"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">VFC System</span>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative h-[500px] w-full flex justify-center items-center">
                    <div className="relative w-full h-full">
                        {/* Visual representation of system/dashboard if possible, or keep abstract/chicken for now but maybe less food focused? User kept the chicken image in recent request. I will keep consistent style for now but maybe the image should change later. For now, strict content update. */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
                            <Image
                                src="/hero.webp"
                                alt="Central Kitchen System"
                                width={800}
                                height={800}
                                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
