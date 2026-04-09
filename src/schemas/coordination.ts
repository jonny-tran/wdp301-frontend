import { z } from "zod";

export const CoordinationSummaryQuerySchema = z.object({
    deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const CoordinationInquirySchema = z.object({
    deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    lines: z
        .array(
            z.object({
                productId: z.number().int().positive(),
                quantity: z.number().positive(),
            }),
        )
        .optional(),
    note: z.string().max(2000).optional(),
});

export const CoordinationBatchApproveSchema = z.object({
    deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    orderApprovals: z.array(
        z.object({
            orderId: z.string().min(1),
            items: z.array(
                z.object({
                    orderItemId: z.coerce.number().int().positive(),
                    quantityApproved: z.number().nonnegative(),
                }),
            ),
        }),
    ),
    force_approve: z.boolean().optional(),
    price_acknowledged: z.boolean().optional(),
    production_confirm: z.boolean().optional(),
});

