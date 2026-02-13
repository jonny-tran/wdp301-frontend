import { z } from "zod";

export const CreateOrderBody = z.object({
    deliveryDate: z.date({ message: "Ngày giao hàng không hợp lệ" }).refine((date) => {
        const d = new Date(date);
        const now = new Date();
        return d > now;
    }, { message: "Ngày giao hàng phải là ít nhất 1 ngày trong tương lai" }),
    items: z.array(z.object({
        productId: z.number().int().positive("ID sản phẩm phải là số nguyên dương"),
        quantity: z.number().int().positive("Số lượng phải là số nguyên dương")
    })).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm")
});

export type CreateOrderBodyType = z.infer<typeof CreateOrderBody>;

export const ApproveOrderBody = z.object({
    force_approve: z.boolean().optional()
});

export type ApproveOrderBodyType = z.infer<typeof ApproveOrderBody>;

export const RejectOrderBody = z.object({
    reason: z.string().min(1, "Lý do từ chối không được để trống")
});

export type RejectOrderBodyType = z.infer<typeof RejectOrderBody>;
