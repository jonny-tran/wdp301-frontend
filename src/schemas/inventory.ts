import { z } from "zod";

export const InventoryAdjustBody = z.object({
    warehouseId: z.number().int().positive("ID kho không hợp lệ"),
    batchId: z.number().int().positive("ID lô hàng không hợp lệ"),
    adjustmentQuantity: z.number().int().positive("Số lượng điều chỉnh không hợp lệ"),
    reason: z.string().min(1, "Lý do điều chỉnh không được để trống"),
    note: z.string().optional()
});

export type InventoryAdjustBodyType = z.infer<typeof InventoryAdjustBody>;
