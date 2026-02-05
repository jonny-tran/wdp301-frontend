
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 font-sans">
            {/* Card wrapper */}
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row p-5 h-auto md:h-[680px] gap-2">

                {/* Left Side: Brand Color Block */}
                <div className="bg-primary rounded-[3.5rem] relative flex flex-col justify-between p-12 text-white w-full md:w-[46%] overflow-hidden hidden md:flex">
                    {/* Background Texture/Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                    </div>

                    <div className="relative z-10 mt-4">
                        <h2 className="text-4xl font-extrabold mb-4 leading-[1.1] tracking-tight">
                            Simplify <br />
                            management with <br />
                            our dashboard.
                        </h2>
                        {/* Artistic underline / accent */}
                        <div className="w-24 h-1.5 bg-secondary rounded-full -mt-2 opacity-80"></div>

                        <p className="text-white/80 text-sm mt-8 max-w-[280px] leading-relaxed">
                            Simplify your franchise operations management with our user-friendly admin dashboard.
                        </p>
                    </div>

                    {/* Illustration at bottom */}
                    <div className="relative w-full h-64 mt-auto translate-y-6">
                        {/* Placeholder for hero image - User provided /hero.webp */}
                        <Image
                            src="/hero.webp"
                            alt="System Management"
                            fill
                            className="object-contain object-bottom scale-110 drop-shadow-2xl"
                            priority
                        />
                    </div>

                    {/* Decorative Blurs */}
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                {/* Right Side: Content Area (Login/Register/Forgot forms) */}
                <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-10 bg-white">
                    {/* Header with Logo - Visible on mobile/top of form area */}
                    <div className="flex items-center justify-center md:justify-start mb-10 gap-3">
                        <Image
                            src="/logo.png"
                            alt="VFC Franchise System"
                            width={60}
                            height={60}
                            className="object-contain w-auto h-14"
                            priority
                        />
                        <div className="flex flex-col justify-center gap-0.5">
                            <span className="text-2xl font-extrabold text-primary tracking-tight leading-none">VFC System</span>
                            <span className="text-[10px] text-text-muted font-bold tracking-[0.3em] uppercase pl-0.5">Franchise</span>
                        </div>
                    </div>

                    {/* Dynamic Children Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
