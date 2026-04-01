import { z } from "zod";

export const CreateReceiptBody = z.object({
    supplierId: z.number().min(1, "ID nhà cung cấp không được để trống"),
    note: z.string().optional(),
});

/**
 * Thêm dòng phiếu nháp — chỉ ghi receipt_items; batch sinh khi PATCH complete (INB-OPTIMIZE).
 * `quantity` = alias SL nhận (quantityAccepted) để tương thích form cũ.
 */
export const AddReceiptItemBody = z
    .object({
        productId: z.coerce.number().int().positive("ID sản phẩm không hợp lệ"),
        expectedQuantity: z.coerce.number().positive().optional(),
        quantity: z.coerce.number().min(0.01, "Số lượng phải > 0").optional(),
        quantityAccepted: z.coerce.number().min(0).optional(),
        quantityRejected: z.coerce.number().min(0).optional(),
        rejectionReason: z.string().optional(),
        manufacturedDate: z.string().optional(),
        statedExpiryDate: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
        const accepted = n(data.quantityAccepted) || n(data.quantity);
        const expected = n(data.expectedQuantity);
        const rejected = n(data.quantityRejected);
        if (accepted <= 0 && expected <= 0 && rejected <= 0) {
            ctx.addIssue({
                code: "custom",
                message: "Nhập SL dự kiến (PO), SL nhận hoặc SL từ chối",
                path: ["quantity"],
            });
        }
        if (rejected > 0 && (!data.rejectionReason || data.rejectionReason.trim().length < 2)) {
            ctx.addIssue({
                code: "custom",
                message: "Bắt buộc ghi lý do khi có số lượng từ chối",
                path: ["rejectionReason"],
            });
        }
    });

export const ReprintBatchBody = z.object({
    batchId: z.number().int().positive("ID lô hàng không hợp lệ"),
});

/** Phê duyệt nhập dư (manager / supply_coordinator) */
export const VarianceApprovalBody = z.object({
    approved: z.boolean(),
    note: z.string().optional(),
});

export type CreateReceiptBodyType = z.infer<typeof CreateReceiptBody>;
export type AddReceiptItemBodyType = z.infer<typeof AddReceiptItemBody>;
export type ReprintBatchBodyType = z.infer<typeof ReprintBatchBody>;
export type VarianceApprovalBodyType = z.infer<typeof VarianceApprovalBody>;

/** Dòng gửi kèm PATCH /inbound/receipts/:id/complete — QC cuối cùng trước khi sinh lô. */
export const CompleteReceiptItemBody = z.object({
    itemId: z.union([z.coerce.number().int().positive(), z.string().min(1)]),
    quantityAccepted: z.coerce.number().min(0).optional(),
    statedExpiryDate: z.string().optional().nullable(),
});

export const CompleteReceiptBody = z.object({
    items: z.array(CompleteReceiptItemBody).optional(),
});

export type CompleteReceiptItemBodyType = z.infer<typeof CompleteReceiptItemBody>;
export type CompleteReceiptBodyType = z.infer<typeof CompleteReceiptBody>;

/** Payload gửi API (camelCase). */
export function toAddReceiptItemApiPayload(data: AddReceiptItemBodyType): Record<string, unknown> {
    const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
    const quantityAccepted = n(data.quantityAccepted) || n(data.quantity);
    const body: Record<string, unknown> = {
        productId: data.productId,
    };
    const exp = n(data.expectedQuantity);
    if (exp > 0) body.expectedQuantity = exp;
    if (quantityAccepted > 0) body.quantityAccepted = quantityAccepted;
    if (n(data.quantityRejected) > 0) body.quantityRejected = n(data.quantityRejected);
    if (data.rejectionReason?.trim()) body.rejectionReason = data.rejectionReason.trim();
    if (data.manufacturedDate?.trim()) body.manufacturedDate = data.manufacturedDate.trim();
    if (data.statedExpiryDate?.trim()) body.statedExpiryDate = data.statedExpiryDate.trim();
    return body;
}
