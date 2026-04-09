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
                    quantity: z.number().min(0.01, "Số lượng phải >= 0.01"),
                })
            )
        })
    )
});


export const ReportIssueBody = z.object({
    batchId: z.number(),
    reason: z.string().min(1, "Lý do không được để trống"),
});

/** POST /warehouse/tasks/:orderId/cancel — FE yêu cầu tối thiểu 10 ký tự để tránh hủy nhầm */
export const CancelPickingTaskBody = z.object({
    reason: z.string().min(10, "Lý do hủy cần ít nhất 10 ký tự"),
});

/** (Tuỳ chọn / tương lai) — production hiện chỉ dùng GET `scan-check?batchCode=`. */
export const ScanCheckVerifyBody = z
    .object({
        batchId: z.number().int().positive().optional(),
        batchCode: z.string().optional(),
    })
    .superRefine((val, ctx) => {
        const hasId = val.batchId != null && val.batchId > 0;
        const hasCode = val.batchCode != null && val.batchCode.trim() !== "";
        if (!hasId && !hasCode) {
            ctx.addIssue({ code: "custom", message: "Cần batchId hoặc batchCode" });
        }
    });

export type FinalizeBulkShipmentBodyType = z.infer<typeof FinalizeBulkShipmentBody>;
export type ScanCheckVerifyBodyType = z.infer<typeof ScanCheckVerifyBody>;
export type CreateWarehouseBodyType = z.infer<typeof CreateWarehouseBody>;
export type ReportIssueBodyType = z.infer<typeof ReportIssueBody>;
export type CancelPickingTaskBodyType = z.infer<typeof CancelPickingTaskBody>;

export const ConsolidateManifestBody = z.object({
    orderIds: z.array(z.string().uuid()).min(1, "Chọn ít nhất một đơn"),
    /** Backend có thể dùng id số hoặc UUID — đối chiếu Swagger */
    vehicleId: z.union([z.coerce.number().int().positive(), z.string().min(1)]),
    driverName: z.string().min(1).optional(),
    driverPhone: z.string().min(8, "Số điện thoại tài xế không hợp lệ").optional(),
});

export type ConsolidateManifestBodyType = z.infer<typeof ConsolidateManifestBody>;

export const ManifestVerifyItemBody = z.object({
    manifestItemId: z.string().min(1, "Thiếu manifestItemId"),
    batchCode: z.string().trim().min(1, "Thiếu mã QR batch"),
});

export type ManifestVerifyItemBodyType = z.infer<typeof ManifestVerifyItemBody>;

