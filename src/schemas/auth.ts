import { Role } from "@/utils/enum";
import { z } from "zod";


export const LoginBody = z.object({
    email: z.email("Email không đúng định dạng").min(1, "Email không được để trống"),
    password: z.string().min(1, "Mật khẩu không được để trống").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginBodyType = z.infer<typeof LoginBody>;

export const RefreshTokenBody = z.object({
    refreshToken: z.string().min(1, "Refresh token không được để trống"),
});

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBody>;

export const LogoutBody = z.object({
    refreshToken: z.string().min(1, "Refresh token không được để trống"),
});

export type LogoutBodyType = z.infer<typeof LogoutBody>;

export const CreateUserBody = z.object({
    username: z.string().min(1, "Tên hiển thị không được để trống"),
    email: z.email("Email không đúng định dạng").min(1, "Email không được để trống"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    role: z.enum(Role),
    storeId: z.uuid().optional(),
}).refine((data) => {
    if (data.role === Role.FRANCHISE_STORE_STAFF && !data.storeId) {
        return false;
    }
    return true;
}, {
    message: "Store ID bắt buộc khi role là franchise_store_staff",
    path: ["storeId"],
});

export type CreateUserBodyType = z.infer<typeof CreateUserBody>;

export const ForgotPasswordBody = z.object({
    email: z.email("Email không đúng định dạng").min(1, "Email không được để trống"),
});

export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBody>;

export const ResetPasswordBody = z.object({
    email: z.email("Email không đúng định dạng").min(1, "Email không được để trống"),
    code: z.string().min(1, "Mã xác thực không được để trống"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;