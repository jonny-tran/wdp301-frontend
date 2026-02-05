import { z } from "zod";

export const authSchema = z.object({
    email: z.email("Email không hợp lệ"),
    password: z
        .string()
        .min(6, "Password tối thiểu 6 ký tự")
        .max(32, "Password tối đa 32 ký tự"),
});

export const emailSchema = z.object({
    email: z.email("Email không hợp lệ"),
});

export const resetPasswordSchema = z
    .object({
        email: z.email("Email không hợp lệ"),
        code: z
            .string()
            .length(6, "Code phải có đúng 6 ký tự số")
            .regex(/^\d+$/, "Code chỉ được chứa chữ số"),
        password: z
            .string()
            .min(6, "Password tối thiểu 6 ký tự")
            .max(32, "Password tối đa 32 ký tự"),
        confirmPassword: z.string().min(6, "Xác nhận mật khẩu là bắt buộc"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

// type dùng cho TS
export type LoginInput = z.infer<typeof authSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;