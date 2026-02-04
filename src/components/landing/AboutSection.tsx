import Image from "next/image";

export default function AboutSection() {
    return (
        <section className="relative w-full py-24 bg-bg-light overflow-hidden">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Left Side: Image Composition */}
                <div className="relative flex justify-center order-2 md:order-1">
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                        {/* Circular Mask / Background with new theme */}
                        <div className="absolute inset-x-[-20px] inset-y-[-20px] rounded-full border border-primary/20 scale-105"></div>
                        <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=600&auto=format&fit=crop"
                                alt="Workspace"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-center p-2 shadow-lg border-4 border-white rotate-0">
                            <span className="text-[10px] font-bold uppercase leading-tight">Real-time Operations</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="text-left order-1 md:order-2">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">Problem & Solution</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-text-main mb-6 uppercase leading-tight">
                        Optimizing <br />
                        <span className="text-primary italic">Chain Operations</span>
                    </h2>
                    <p className="text-text-muted text-sm leading-relaxed mb-4">
                        In reality, many franchise chains manage central kitchens and stores using disjointed tools (Excel, paper, standalone software), leading to lack of synchronization, inaccurate measurements, and poor quality control.
                    </p>
                    <p className="text-text-muted text-sm leading-relaxed mb-8">
                        The VFC System solves these issues with a transparent process, helping managers monitor efficiency across the entire chain, thereby optimizing costs and scalability.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-primary text-xs uppercase mb-2">Synchronization</h4>
                            <p className="text-[10px] text-text-muted">Real-time updates for inventory and orders.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-primary text-xs uppercase mb-2">Accuracy</h4>
                            <p className="text-[10px] text-text-muted">Efficient demand forecasting and production planning.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
