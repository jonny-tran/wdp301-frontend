import { z } from "zod";

export const InventoryAdjustBody = z.object({
    warehouseId: z.coerce.number().int().nonnegative("ID kho không hợp lệ"),
    batchId: z.coerce.number().int().nonnegative("ID lô hàng không hợp lệ"),
    adjustmentQuantity: z.coerce.number().int().refine((val) => val !== 0, "Số lượng điều chỉnh phải khác 0"),
    reason: z.string().min(1, "Lý do điều chỉnh không được để trống"),
    note: z.string().optional()
});

export type InventoryAdjustBodyType = z.infer<typeof InventoryAdjustBody>;

/** Form điều chỉnh tay tại bếp — map sang InventoryAdjustBody khi submit */
export const KitchenStockAdjustFormSchema = z.object({
    warehouseId: z.coerce.number().int().positive("Nhập ID kho hợp lệ"),
    batchId: z.coerce.number().int().positive("Chọn một lô"),
    direction: z.enum(["add", "subtract"]),
    quantity: z.coerce.number().int().positive("Số lượng phải lớn hơn 0"),
    reason: z.enum(["WASTE", "PRODUCTION_LOSS", "INPUT_ERROR"], {
        message: "Chọn lý do bắt buộc",
    }),
    note: z.string().optional(),
});

export type KitchenStockAdjustFormType = z.infer<typeof KitchenStockAdjustFormSchema>;

export const InventoryWasteBodySchema = z.object({
    batchId: z.coerce.number().int().positive("Thiếu batchId hợp lệ"),
    quantity: z.coerce.number().positive("Số lượng hủy phải lớn hơn 0"),
    reason: z.enum(["EXPIRED", "DAMAGED"], {
        message: "Lý do hủy chỉ chấp nhận EXPIRED hoặc DAMAGED",
    }),
    note: z.string().optional(),
    evidenceImage: z.string().url("Ảnh chứng minh không hợp lệ").optional(),
});

export type InventoryWasteBodyType = z.infer<typeof InventoryWasteBodySchema>;
