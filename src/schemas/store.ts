import { z } from "zod";

export const CreateStoreBody = z.object({
    name: z.string().min(1, "Tên cửa hàng không được để trống"),
    address: z.string().min(1, "Địa chỉ không được để trống"),
    phone: z.string().optional(),
    managerName: z.string().optional()
});



export const UpdateStoreBody = CreateStoreBody.partial().extend({
    isActive: z.boolean().optional()
});

export type CreateStoreBodyType = z.infer<typeof CreateStoreBody>;
export type UpdateStoreBodyType = z.infer<typeof UpdateStoreBody>;
