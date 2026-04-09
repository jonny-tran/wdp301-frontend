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



export const ApproveOrderBody = z.object({
    force_approve: z.boolean().optional(),
    price_acknowledged: z.boolean().optional(),
    production_confirm: z.boolean().optional(),
    /** Tạo lệnh sản xuất bù độc lập cho phần thiếu */
    productionRequests: z
        .array(
            z.object({
                productId: z.number().int().positive(),
                quantity: z.number().positive(),
            }),
        )
        .optional(),
});


export const RejectOrderBody = z.object({
    reason: z.string().min(1, "Lý do từ chối không được để trống")
});

export type CreateOrderBodyType = z.infer<typeof CreateOrderBody>;
export type ApproveOrderBodyType = z.infer<typeof ApproveOrderBody>;
export type RejectOrderBodyType = z.infer<typeof RejectOrderBody>;

export const RequestProductionBody = z.object({
    note: z.string().max(2000).optional(),
});

export type RequestProductionBodyType = z.infer<typeof RequestProductionBody>;

export const KitchenProductionResponseBody = z
    .object({
        action: z.enum(["accept", "reject"]),
        note: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.action === "reject") {
            const n = data.note?.trim() ?? "";
            if (n.length < 2) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nhập lý do từ chối (tối thiểu 2 ký tự)",
                    path: ["note"],
                });
            }
        }
    });

export type KitchenProductionResponseBodyType = z.infer<typeof KitchenProductionResponseBody>;
