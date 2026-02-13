import { z } from "zod";

export const CreateClaimBody = z.object({
    shipmentId: z.uuid("Shipment ID không hợp lệ"),
    description: z.string().optional(),
    items: z.array(z.object({
        productId: z.number().int().positive("ID sản phẩm không hợp lệ"),
        batchId: z.number().int().positive("ID lô hàng không hợp lệ"),
        quantityMissing: z.number().int().min(0, "Số lượng thiếu không được âm"),
        quantityDamaged: z.number().int().min(0, "Số lượng hàng hỏng không được âm"),
        reason: z.string().optional(),
        imageProofUrl: z.url("Link ảnh không hợp lệ").optional()
    }))
});

export type CreateClaimBodyType = z.infer<typeof CreateClaimBody>;

export const ResolveClaimBody = z.object({
    status: z.enum(['approved', 'rejected']),
    resolutionNote: z.string().optional()
});

export type ResolveClaimBodyType = z.infer<typeof ResolveClaimBody>;
