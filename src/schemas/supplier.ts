import { z } from "zod";

export const CreateSupplierBody = z.object({
    name: z.string().min(1, "Tên nhà cung cấp không được để trống"),
    contactName: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    isActive: z.boolean().optional(),
});



export const UpdateSupplierBody = CreateSupplierBody.partial();
export type CreateSupplierBodyType = z.infer<typeof CreateSupplierBody>;
export type UpdateSupplierBodyType = z.infer<typeof UpdateSupplierBody>;
