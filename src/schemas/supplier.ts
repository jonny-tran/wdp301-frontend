import { z } from "zod";

export const CreateSupplierBody = z.object({
    name: z.string().min(1, "Tên nhà cung cấp không được để trống"),
    contactName: z.string().optional(),
    phone: z.string().optional(),
    email: z.email("Email không đúng định dạng").optional().or(z.literal("")),
    address: z.string().optional()
});

export type CreateSupplierBodyType = z.infer<typeof CreateSupplierBody>;

export const UpdateSupplierBody = CreateSupplierBody.partial();

export type UpdateSupplierBodyType = z.infer<typeof UpdateSupplierBody>;
