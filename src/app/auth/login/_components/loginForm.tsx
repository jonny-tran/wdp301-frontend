
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthContext } from "@/context/authContext";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Link from "next/link";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { handleErrorApi } from "@/lib/errors";
import { LoginBody, LoginBodyType, } from "@/schemas/auth";


export default function LoginForm() {
    const { login } = useAuth();
    const { setTokenFromContext } = useAuthContext();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const roleRedirects: Record<string, string> = {
        [Role.ADMIN]: '/admin',
        [Role.MANAGER]: '/manager/products',
        [Role.SUPPLY_COORDINATOR]: '/supply',
        [Role.CENTRAL_KITCHEN_STAFF]: '/kitchen/dashboard'
    };

    const {
        register,
        handleSubmit,
        setError: setErrorForm,
        formState: { errors },
    } = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
    });

    const onSubmit = async (data: LoginBodyType) => {
        if (login.isPending) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await login.mutateAsync(data);
            setTokenFromContext(result.accessToken, result.refreshToken);
        } catch (err: any) {
            handleErrorApi({
                error: err,
                setError: setErrorForm
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-text-main mb-2">Welcome Back</h1>
                <p className="text-text-muted text-sm">Please login to your account</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <input
                        type="email"
                        placeholder="Email address"
                        {...register("email")}
                        className={`w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-gray-400 text-text-main ${errors.email ? '!border-red-500 bg-red-50/50' : ''}`}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 ml-2">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1 relative">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...register("password")}
                            className={`w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-gray-400 text-text-main ${errors.password ? '!border-red-500 bg-red-50/50' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500 ml-2">{errors.password.message}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <Link href="/auth/forgot-password" className="text-xs font-bold text-text-muted hover:text-primary transition-colors">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-bold rounded-2xl py-4 shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-[0.98] uppercase text-xs tracking-widest disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "LOGIN"
                    )}
                </button>
            </form>

            <div className="my-8 flex items-center gap-4">
                <div className="h-[1px] bg-gray-100 flex-1"></div>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Or Login with</span>
                <div className="h-[1px] bg-gray-100 flex-1"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-1">
                <button type="button" className="flex items-center justify-center gap-2 border border-gray-100 rounded-2xl py-3 hover:bg-gray-50 transition-all font-bold text-xs text-text-main">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-4 h-4" />
                    Google
                </button>
            </div>
        </div>
    );
}
