import { z } from "zod";

/** Body POST /production/recipes — định mức `quantity` là trên 1 đơn vị thành phẩm (Nest DTO). */
export type CreateRecipeApiBody = {
    productId: number;
    items: { productId: number; quantity: number }[];
};

/** Body PATCH /production/recipes/:id */
export type UpdateRecipeApiBody = {
    productId?: number;
    items?: { productId: number; quantity: number }[];
    isActive?: boolean;
};

/** Form: nhập tổng nguyên liệu cho `standardOutput` đơn vị TP → FE quy đổi về định mức / 1 đơn vị. */
export const CreateRecipeFormSchema = z
    .object({
        outputProductId: z.coerce.number().int().positive("Chọn thành phẩm đầu ra"),
        standardOutput: z.coerce.number().positive("Sản lượng chuẩn phải lớn hơn 0"),
        items: z
            .array(
                z.object({
                    productId: z.coerce.number().int().positive("Chọn nguyên liệu"),
                    quantity: z.coerce.number().positive("Số lượng phải lớn hơn 0"),
                }),
            )
            .min(1, "Cần ít nhất một dòng nguyên liệu"),
    })
    .superRefine((data, ctx) => {
        data.items.forEach((row, i) => {
            if (row.productId === data.outputProductId) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nguyên liệu không được trùng sản phẩm đầu ra",
                    path: ["items", i, "productId"],
                });
            }
        });
        const seen = new Set<number>();
        data.items.forEach((row, i) => {
            if (seen.has(row.productId)) {
                ctx.addIssue({
                    code: "custom",
                    message: "Không chọn trùng nguyên liệu",
                    path: ["items", i, "productId"],
                });
            }
            seen.add(row.productId);
        });
    });

export type CreateRecipeFormValues = z.infer<typeof CreateRecipeFormSchema>;

/** Body POST /production/orders/:id/complete (camelCase theo Nest DTO). */
export const CompleteProductionBodySchema = z.object({
    actualQuantity: z.coerce.number().positive("Số lượng thực nhận phải lớn hơn 0"),
    surplusNote: z.string().optional(),
});

export type CompleteProductionBodyType = z.infer<typeof CompleteProductionBodySchema>;

/** Body PATCH /production/orders/:id/cancel */
export const CancelProductionOrderBodySchema = z.object({
    reason: z.string().trim().min(2, "Nhập lý do từ chối (tối thiểu 2 ký tự)"),
});

export type CancelProductionOrderBodyType = z.infer<typeof CancelProductionOrderBodySchema>;

/** Body POST /production/orders — tạo lệnh draft (PROD-LOGIC §2). */
export const CreateProductionOrderBodySchema = z.object({
    productId: z.coerce.number().int().positive("Chọn thành phẩm"),
    plannedQuantity: z.coerce.number().positive("Số lượng kế hoạch phải > 0"),
});

export type CreateProductionOrderBodyType = z.infer<typeof CreateProductionOrderBodySchema>;

export function createCompleteProductionFormSchema(targetQuantity: number) {
    return CompleteProductionBodySchema.superRefine((data, ctx) => {
        if (data.actualQuantity > targetQuantity) {
            const note = data.surplusNote?.trim() ?? "";
            if (note.length < 2) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nhập ghi chú dư (tối thiểu 2 ký tự) khi thực tế > mục tiêu",
                    path: ["surplusNote"],
                });
            }
        }
    });
}
