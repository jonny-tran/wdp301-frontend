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

export const StaffItemSchema = z.object({
  storeId: z.string().min(1, "Vui lòng chọn chi nhánh"),
  fullName: z.string().min(1, "Tên nhân viên không được để trống"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
  note: z.string().optional(),
});

export const CreateStaffListBody = z.object({
  staff: z.array(StaffItemSchema).min(1, "Cần ít nhất một nhân viên"),
});

export type CreateStaffListBodyType = z.infer<typeof CreateStaffListBody>;
export type CreateStoreBodyType = z.infer<typeof CreateStoreBody>;
export type UpdateStoreBodyType = z.infer<typeof UpdateStoreBody>;
