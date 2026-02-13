'use client'
import { authRequest } from "@/apiRequest/auth";
import { CreateUserBodyType, LoginBodyType, ForgotPasswordBodyType, ResetPasswordBodyType, LogoutBodyType } from "@/schemas/auth";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAuth = () => {
    const login = useMutation({
        mutationFn: async (data: LoginBodyType) => {
            const res = await authRequest.loginClient(data)
            return res.data
        },
        onSuccess: async (data) => {
            await authRequest.loginServer(data)
        }
    })
    const logout = (body: LogoutBodyType) => useMutation({
        mutationFn: async () => {
            await authRequest.logoutClient(body)
        },
        onSuccess: async () => {
            await authRequest.logoutServer()
        }
    })
    const forgotPassword = useMutation({
        mutationFn: async (data: ForgotPasswordBodyType) => {
            const res = await authRequest.forgotPassword(data)
            return res.data
        }
    })
    const resetPassword = useMutation({
        mutationFn: async (data: ResetPasswordBodyType) => {
            const res = await authRequest.resetPassword(data)
            return res.data
        }
    })

    const createUser = useMutation({
        mutationFn: async (data: CreateUserBodyType) => {
            const res = await authRequest.createUser(data)
            return res.data
        }
    })
    const profile = useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const res = await authRequest.me()
            return res.data
        }
    })


    return { login, logout, forgotPassword, resetPassword, createUser, profile }
}


