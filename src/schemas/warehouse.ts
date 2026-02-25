import { WarehouseType } from "@/utils/enum";
import { z } from "zod";

export const CreateWarehouseBody = z.object({
    name: z.string().min(1, "Tên kho không được để trống"),
    type: z.enum(WarehouseType),
    storeId: z.uuid().optional(),


});




export const FinalizeBulkShipmentBody = z.object({
    orders: z.array(
        z.object({
            orderId: z.string().uuid(),
            pickedItems: z.array(
                z.object({
                    batchId: z.number(),
                    quantity: z.number().min(0.1, "Số lượng phải >= 0.1"),
                })
            )
        })
    )
});


export const ReportIssueBody = z.object({
    batchId: z.number(),
    reason: z.string().min(1, "Lý do không được để trống"),
});

export type FinalizeBulkShipmentBodyType = z.infer<typeof FinalizeBulkShipmentBody>;
export type CreateWarehouseBodyType = z.infer<typeof CreateWarehouseBody>;
export type ReportIssueBodyType = z.infer<typeof ReportIssueBody>;


