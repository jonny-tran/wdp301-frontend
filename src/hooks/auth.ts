import { authRequest } from "@/apiRequest/auth";
import { EmailInput, LoginInput, ResetPasswordInput } from "@/schemas/auth";
import { KEY } from "@/utils/contranst";
import { useMutation, useQuery } from "@tanstack/react-query";



export const useAuth = () => {
    const me = useQuery({
        queryKey: KEY.me,
        queryFn: () => authRequest.me(),
        retry: false,
    });
    const login = useMutation({
        mutationFn: async (data: LoginInput) => {
            const res = await authRequest.loginClient(data)
            return res.data
        },
        onSuccess: async (data) => {
            await authRequest.loginServer(data)
            await me.refetch();

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

    return { login, logout, forgotPassword, resetPassword, me }
}