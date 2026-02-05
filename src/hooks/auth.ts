'use client'
import { authRequest } from "@/apiRequest/auth";
import { EmailInput, LoginInput, ResetPasswordInput } from "@/schemas/auth";

import { useMutation } from "@tanstack/react-query";



export const useAuth = () => {

    const login = useMutation({
        mutationFn: async (data: LoginInput) => {
            const res = await authRequest.loginClient(data)
            return res.data
        },
        onSuccess: async (data) => {
            await authRequest.loginServer(data)

        }
    })
    const logout = useMutation({
        mutationFn: async () => {
            await authRequest.logoutClient()
        },
        onSuccess: async () => {
            await authRequest.logoutServer()
        }
    })
    const forgotPassword = useMutation({
        mutationFn: async (data: EmailInput) => {
            const res = await authRequest.forgotPassword(data)
            return res.data
        }
    })
    const resetPassword = useMutation({
        mutationFn: async (data: ResetPasswordInput) => {
            const res = await authRequest.resetPassword(data)
            return res.data
        }
    })


    return { login, logout, forgotPassword, resetPassword, }
}

