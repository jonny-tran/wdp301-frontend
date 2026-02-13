import { z } from "zod";

export const CreateStoreBody = z.object({
    name: z.string().min(3, "Tên cửa hàng phải có ít nhất 3 ký tự"),
    address: z.string().min(1, "Địa chỉ không được để trống"),
    phone: z.string().optional(),
    managerName: z.string().optional()
});

export type CreateStoreBodyType = z.infer<typeof CreateStoreBody>;

export const UpdateStoreBody = CreateStoreBody.partial().extend({
    isActive: z.boolean().optional()
});

export type UpdateStoreBodyType = z.infer<typeof UpdateStoreBody>;
