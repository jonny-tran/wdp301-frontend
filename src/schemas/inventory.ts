import { z } from "zod";

export const InventoryAdjustBody = z.object({
    batchId: z.coerce.number().int().positive("ID lô hàng không hợp lệ"),
    actualQuantity: z.coerce.number().nonnegative("Số lượng thực tế phải >= 0"),
    reasonCode: z.enum(["DAMAGE", "WASTE", "PRODUCTION_WASTE", "INPUT_ERROR", "EXPIRED"], {
        message: "Lý do điều chỉnh không hợp lệ",
    }),
    note: z.string().optional()
});

export type InventoryAdjustBodyType = z.infer<typeof InventoryAdjustBody>;

/** Form điều chỉnh tay tại bếp — map sang InventoryAdjustBody khi submit */
export const KitchenStockAdjustFormSchema = z.object({
    batchId: z.coerce.number().int().positive("Chọn một lô"),
    actualQuantity: z.coerce.number().nonnegative("Số lượng thực tế phải >= 0"),
    reasonCode: z.enum(["DAMAGE", "WASTE", "PRODUCTION_WASTE", "INPUT_ERROR", "EXPIRED"], {
        message: "Chọn lý do bắt buộc",
    }),
    note: z.string().optional(),
});

export type KitchenStockAdjustFormType = z.infer<typeof KitchenStockAdjustFormSchema>;

export const InventoryWasteBodySchema = z.object({
    batchId: z.coerce.number().int().positive("Thiếu batchId hợp lệ"),
    reason: z.enum(["EXPIRED", "DAMAGED"], {
        message: "Lý do hủy chỉ chấp nhận EXPIRED hoặc DAMAGED",
    }),
    note: z.string().optional(),
});

export type InventoryWasteBodyType = z.infer<typeof InventoryWasteBodySchema>;
