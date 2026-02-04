import Image from "next/image";
import Link from "next/link";
import { EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 font-sans">
            {/* Thẻ Card trắng bao ngoài - Giống hình 2 */}
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row p-5 h-auto md:h-[680px] gap-2">

                {/* Left Side: Brand Color Block */}
                <div className="bg-primary rounded-[3.5rem] relative flex flex-col justify-between p-12 text-white w-full md:w-[46%] overflow-hidden">
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

                {/* Right Side: Login Form */}
                <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-10 bg-white">
                    {/* Logo Section */}
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

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-text-main mb-2">Welcome Back</h1>
                        <p className="text-text-muted text-sm">Please login to your account</p>
                    </div>

                    <form className="space-y-5">
                        <div className="space-y-1">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 text-text-main"
                            />
                        </div>

                        <div className="space-y-1 relative">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400 text-text-main"
                            />
                            <button type="button" className="absolute right-5 top-[18px] text-gray-400 hover:text-primary transition-colors">
                                <EyeSlashIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <Link href="#" className="text-xs font-bold text-text-muted hover:text-primary transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button className="w-full bg-primary text-white font-bold rounded-2xl py-4 shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-[0.98] uppercase text-xs tracking-widest">
                            Login
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="h-[1px] bg-gray-100 flex-1"></div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Or Login with</span>
                        <div className="h-[1px] bg-gray-100 flex-1"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-1">
                        <button className="flex items-center justify-center gap-2 border border-gray-100 rounded-2xl py-3 hover:bg-gray-50 transition-all font-bold text-xs text-text-main">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
                            Google
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}