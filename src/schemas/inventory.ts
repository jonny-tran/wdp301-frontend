import { z } from "zod";

export const InventoryAdjustBody = z.object({
    warehouseId: z.coerce.number().int().nonnegative("ID kho không hợp lệ"),
    batchId: z.coerce.number().int().nonnegative("ID lô hàng không hợp lệ"),
    adjustmentQuantity: z.coerce.number().int().refine((val) => val !== 0, "Số lượng điều chỉnh phải khác 0"),
    reason: z.string().min(1, "Lý do điều chỉnh không được để trống"),
    note: z.string().optional()
});

export type InventoryAdjustBodyType = z.infer<typeof InventoryAdjustBody>;
