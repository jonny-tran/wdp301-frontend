import { BatchStatus } from "@/utils/enum";
import { z } from "zod";

export const CreateProductBody = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  baseUnitId: z.coerce.number().int().positive('ID đơn vị tính không hợp lệ'),
  shelfLifeDays: z.coerce.number().int().positive('Hạn sử dụng không hợp lệ'),
  imageUrl: z.array(z.url("Đường dẫn ảnh không hợp lệ"))
});



export const UpdateProductBody = CreateProductBody.partial();



export const UpdateBatchBody = z.object({
  initialQuantity: z.coerce.number().positive("Số lượng ban đầu phải > 0").optional(),
  imageUrl: z.array(z.url("Đường dẫn ảnh không hợp lệ")).optional(),
  status: z.nativeEnum(BatchStatus).optional(),
});

export type CreateProductBodyType = z.infer<typeof CreateProductBody>;
export type UpdateProductBodyType = z.infer<typeof UpdateProductBody>;
export type UpdateBatchBodyType = z.infer<typeof UpdateBatchBody>;
