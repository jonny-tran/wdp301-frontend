
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, EmailInput } from "@/schemas/auth";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/auth";
import { handleErrorApi } from "@/lib/errors";

export default function ForgotPasswordForm() {
    const { forgotPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setError: setErrorForm,
        formState: { errors },
    } = useForm<EmailInput>({
        resolver: zodResolver(emailSchema),
    });

    const onSubmit = async (data: EmailInput) => {
        if (forgotPassword.isPending) return;
        setIsLoading(true);
        setError(null);
        try {
            await forgotPassword.mutateAsync(data);
            setIsSubmitted(true);
        } catch (err: any) {
            handleErrorApi({
                error: err,
                setError: setErrorForm
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="w-full text-center slide-in-bottom">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-text-main mb-2">Check your email</h2>
                <p className="text-text-muted text-sm mb-8 leading-relaxed">
                    We have sent a password reset link to <br />
                    <span className="font-bold text-text-main">your email</span>
                </p>

                <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center w-full bg-primary text-white font-bold rounded-2xl py-4 shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-[0.98] uppercase text-xs tracking-widest"
                >
                    Back to Login
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full">
            <Link href="/auth/login" className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors mb-8 group">
                <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
            </Link>

            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-text-main mb-2">Forgot Password?</h1>
                <p className="text-text-muted text-sm">Don't worry! It happens. Please enter the email associated with your account.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        className={`w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-gray-400 text-text-main ${errors.email ? '!border-red-500 bg-red-50/50' : ''}`}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 ml-2">{errors.email.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white font-bold rounded-2xl py-4 shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-[0.98] uppercase text-xs tracking-widest disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "Send Code"
                    )}
                </button>
            </form>
        </div>
    );
}
