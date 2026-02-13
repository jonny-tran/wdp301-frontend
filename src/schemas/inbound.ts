import { z } from "zod";

export const CreateReceiptBody = z.object({
    supplierId: z.number().min(1, "ID nhà cung cấp không được để trống"),
    note: z.string().optional()
});

export type CreateReceiptBodyType = z.infer<typeof CreateReceiptBody>;

export const AddReceiptItemBody = z.object({
    productId: z.number().int().positive("ID sản phẩm không hợp lệ"),
    quantity: z.number().int().positive("Số lượng không hợp lệ"),
});

export type AddReceiptItemBodyType = z.infer<typeof AddReceiptItemBody>;

export const ReprintBatchBody = z.object({
    batchId: z.number().int().positive("ID lô hàng không hợp lệ")
});

export type ReprintBatchBodyType = z.infer<typeof ReprintBatchBody>;
