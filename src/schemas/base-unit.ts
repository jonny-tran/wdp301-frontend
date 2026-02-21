import { z } from "zod";

export const CreateBaseUnitBody = z.object({
    name: z.string().min(1, "Tên đơn vị tính không được để trống"),
    description: z.string().optional(),
});


export const UpdateBaseUnitBody = z.object({
    name: z.string().min(1, "Tên đơn vị tính không được để trống").optional(),
    description: z.string().optional(),
});

export type CreateBaseUnitBodyType = z.infer<typeof CreateBaseUnitBody>;
export type UpdateBaseUnitBodyType = z.infer<typeof UpdateBaseUnitBody>;
