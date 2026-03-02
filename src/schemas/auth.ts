import { Role } from "@/utils/enum";
import { z } from "zod";


export const LoginBody = z.object({
    email: z.email("Email không đúng định dạng").min(1, "Email không được để trống"),
    password: z.string().min(1, "Mật khẩu không được để trống").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});



export const RefreshTokenBody = z.object({
    refreshToken: z.string().min(1, "Refresh token không được để trống"),
});



export const LogoutBody = z.object({
    refreshToken: z.string().min(1, "Refresh token không được để trống"),
});



export const CreateUserBody = z
    .object({
        username: z.string().min(1),
        email: z.email(),
        password: z.string().min(6),
        role: z.enum(Role),
        storeId: z.string().uuid().optional(),
    })
    .refine(
        (data) =>
            data.role !== Role.FRANCHISE_STORE_STAFF ||
            !!data.storeId,
        {
            message: "Store ID bắt buộc khi role là franchise_store_staff",
            path: ["storeId"],
        }
    );

export const UpdateUserBody = z.object({
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    role: z.enum(Role).optional(),
    email: z.email("Email không đúng định dạng").min(1, "Email không được để trống").optional(),
    phone: z.string().optional(),
});

export const ForgotPasswordBody = z.object({
    email: z.email("Email không đúng định dạng").min(1, "Email không được để trống"),
});



export const ResetPasswordBody = z.object({
    email: z.email("Email không đúng định dạng").min(1, "Email không được để trống"),
    code: z.string().min(1, "Mã xác thực không được để trống"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});



export type LoginBodyType = z.infer<typeof LoginBody>;
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBody>;
export type LogoutBodyType = z.infer<typeof LogoutBody>;
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBody>;
export type CreateUserBodyType = z.infer<typeof CreateUserBody>;
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBody>;