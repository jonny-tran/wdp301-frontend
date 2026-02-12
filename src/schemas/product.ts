import * as z from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  baseUnitId: z.number().min(1, "Vui lòng chọn đơn vị tính"),
  shelfLifeDays: z.number().min(1, "Hạn dùng phải lớn hơn 0"),
  imageUrl: z.string().url("Link ảnh không hợp lệ").or(z.literal("")),
});

export type CreateProductType = z.infer<typeof CreateProductSchema>;

export interface Product extends CreateProductType {
  id: string;
}