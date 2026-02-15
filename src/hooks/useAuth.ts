'use client'
import { authRequest } from "@/apiRequest/auth";
import { handleErrorApi } from "@/lib/errors";
import { CreateUserBodyType, LoginBodyType, ForgotPasswordBodyType, ResetPasswordBodyType, LogoutBodyType } from "@/schemas/auth";
import { useSessionStore } from "@/stores/sesionStore";
import { KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
    const router = useRouter();
    const login = useMutation({
        mutationFn: async (data: LoginBodyType) => {
            const res = await authRequest.loginClient(data)
            return res.data
        },
        onSuccess: async (data) => {
            await authRequest.loginServer(data)
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })
    const clearSession = useSessionStore((state) => state.clearSession);
    const logout = useMutation({
        mutationFn: async (data: LogoutBodyType) => {
            await authRequest.logoutClient(data)
        },
        onSuccess: async () => {
            await authRequest.logoutServer();
            clearSession();
            toast.success("Logout successfully");
            router.replace("/auth/login")
        },
        onError: async (error) => {
            // Force logout even if backend API fails
            await authRequest.logoutServer();
            clearSession();
            router.replace("/auth/login");
            handleErrorApi({ error })
        }
    })
    const forgotPassword = useMutation({
        mutationFn: async (data: ForgotPasswordBodyType) => {
            const res = await authRequest.forgotPassword(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })
    const resetPassword = useMutation({
        mutationFn: async (data: ResetPasswordBodyType) => {
            const res = await authRequest.resetPassword(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const createUser = useMutation({
        mutationFn: async (data: CreateUserBodyType) => {
            const res = await authRequest.createUser(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const accessToken = useSessionStore((state) => state.accessToken);
    const profile = useQuery({
        queryKey: KEY.me,
        queryFn: async () => {
            const res = await authRequest.me()
            return res.data
        },
        enabled: !!accessToken,
    })


    return { login, logout, forgotPassword, resetPassword, createUser, profile }
}



