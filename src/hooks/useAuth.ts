'use client'
import { authRequest } from "@/apiRequest/auth";
import { storeRequest } from "@/apiRequest/store";
import { handleErrorApi } from "@/lib/errors";
import { CreateUserBodyType, LoginBodyType, ForgotPasswordBodyType, ResetPasswordBodyType, LogoutBodyType } from "@/schemas/auth";
import { useSessionStore } from "@/stores/sesionStore";
import { KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; 
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
    const router = useRouter();
    const queryClient = useQueryClient(); 
    
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
        onSuccess: () => {
            toast.success("User created successfully");
            // Tự động làm mới danh sách users sau khi tạo thành công
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })
    const updateUser = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
            const res = await authRequest.updateUser(id, payload)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => handleErrorApi({ error })
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

    // --- CÁC HÀM BỔ SUNG CHO ADMIN ---

    // 1. Lấy danh sách Users có phân trang
    const getUsers = (query: any) => {
        return useQuery({
            queryKey: ['users', query],
            queryFn: async () => {
                // Giả định authRequest đã có getUsers, nếu chưa hãy thêm vào apiRequest/auth.ts
                const res = await authRequest.getUsers(query); 
                return res.data;
            }
        });
    }

    // 2. Lấy danh sách Roles để hiển thị trong Select
    const getRoles = () => {
        return useQuery({
            queryKey: ['roles'],
            queryFn: async () => {
                const res = await authRequest.getRoles();
                return res.data;
            }
        });
    }

    // 3. Lấy danh sách Stores để liên kết nhân viên
    const getStores = (query: any = { limit: 100 }) => {
        return useQuery({
            queryKey: ['stores', query],
            queryFn: async () => {
                const res = await storeRequest.getStores(query);
                return res.data;
            }
        });
    }

    return { 
        login, 
        logout, 
        forgotPassword, 
        resetPassword, 
        createUser, 
        profile,
        updateUser, // Bổ sung
        getUsers, // Bổ sung
        getRoles, // Bổ sung
        getStores // Bổ sung
    }
}