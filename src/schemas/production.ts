import { z } from "zod";

/** Body POST /production/orders/:id/complete (camelCase theo Nest DTO). */
export const CompleteProductionBodySchema = z.object({
    actualQuantity: z.coerce.number().positive("Số lượng thực nhận phải lớn hơn 0"),
    wasteReason: z.string().optional(),
});

export type CompleteProductionBodyType = z.infer<typeof CompleteProductionBodySchema>;

export function createCompleteProductionFormSchema(targetQuantity: number) {
    return CompleteProductionBodySchema.superRefine((data, ctx) => {
        if (data.actualQuantity < targetQuantity) {
            const reason = data.wasteReason?.trim() ?? "";
            if (reason.length < 2) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nhập lý do hao hụt (tối thiểu 2 ký tự) khi thực tế < mục tiêu",
                    path: ["wasteReason"],
                });
            }
        }
    });
}
