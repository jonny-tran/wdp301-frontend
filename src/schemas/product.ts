import * as z from "zod";

export const ProductSchema = z.object({
  sku: z.string().min(1, "SKU là bắt buộc"),
  name: z.string().min(1, "Tên là bắt buộc"),
  baseUnit: z.string().min(1, "Đơn vị là bắt buộc"),
  shelfLifeDays: z.number().min(1, "Hạn dùng phải > 0"),
  imageUrl: z.string().optional().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;

export interface Product extends ProductFormValues {
  id: string;
}