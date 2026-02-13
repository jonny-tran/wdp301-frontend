import { z } from "zod";

export const CreateProductBody = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  baseUnitId: z.number().int().positive('ID đơn vị tính không hợp lệ'),
  shelfLifeDays: z.number().int().positive('Hạn sử dụng không hợp lệ'),
  imageUrl: z.url("Đường dẫn ảnh không hợp lệ")
});

export type CreateProductBodyType = z.infer<typeof CreateProductBody>;

export const UpdateProductBody = CreateProductBody.partial();

export type UpdateProductBodyType = z.infer<typeof UpdateProductBody>;

export const UpdateBatchBody = z.object({
  initialQuantity: z.number().int().positive('Số lượng ban đầu không hợp lệ').optional(),
  imageUrl: z.url("Đường dẫn ảnh không hợp lệ").optional()
});

export type UpdateBatchBodyType = z.infer<typeof UpdateBatchBody>;
