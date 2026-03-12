/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { authRequest } from "@/apiRequest/auth";
import { handleErrorApi } from "@/lib/errors";
import {
  CreateUserBodyType,
  ForgotPasswordBodyType,
  LoginBodyType,
  LogoutBodyType,
  ResetPasswordBodyType,
} from "@/schemas/auth";
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
      const res = await authRequest.loginClient(data);
      return res.data;
    },
    onSuccess: async (data) => {
      await authRequest.loginServer(data);
      toast.success("Đăng nhập thành công");
    },
  });
  const clearSession = useSessionStore((state) => state.clearSession);
  const logout = useMutation({
    mutationFn: async (data: LogoutBodyType) => {
      await authRequest.logoutClient(data);
    },
    onSuccess: async () => {
      await authRequest.logoutServer();
      clearSession();
      toast.success("Đăng xuất thành công");
      queryClient.clear();
      router.replace("/auth/login");
    },
    onError: async (error) => {
      // Force logout even if backend API fails
      await authRequest.logoutServer();
      clearSession();
      router.replace("/auth/login");
      handleErrorApi({ error });
    },
  });
  const forgotPassword = useMutation({
    mutationFn: async (data: ForgotPasswordBodyType) => {
      const res = await authRequest.forgotPassword(data);
      return res.data;
    },
  });
  const resetPassword = useMutation({
    mutationFn: async (data: ResetPasswordBodyType) => {
      const res = await authRequest.resetPassword(data);
      return res.data;
    },
  });

  const createUser = useMutation({
    mutationFn: async (data: CreateUserBodyType) => {
      const res = await authRequest.createUser(data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tạo user thành công");
      queryClient.invalidateQueries({ queryKey: KEY.users });
    },
  });
  const updateUser = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const res = await authRequest.updateUser(id, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật user thành công");
      queryClient.invalidateQueries({ queryKey: KEY.users });
    },
  });
  const accessToken = useSessionStore((state) => state.accessToken);
  const profile = useQuery({
    queryKey: KEY.me,
    queryFn: async () => {
      const res = await authRequest.me();
      return res.data;
    },
    enabled: !!accessToken,
  });
  const getRoles = () => {
    return useQuery({
      queryKey: KEY.roles,
      queryFn: async () => {
        const res = await authRequest.getRoles();
        return res.data;
      },
    });
  };
  return {
    login,
    logout,
    forgotPassword,
    resetPassword,
    createUser,
    updateUser,
    profile,
    getRoles,
  };
};
