import { z } from "zod";

export const ReceiveShipmentBody = z.object({
    items: z.array(z.object({
        batchId: z.number().int().positive("ID lô hàng không hợp lệ"),
        actualQty: z.number().min(0, "Số lượng thực nhận phải >= 0"),
        damagedQty: z.number().min(0, "Số lượng hàng hỏng phải >= 0"),
        evidenceUrls: z.array(z.string().url()).optional(),
    })),
    notes: z.string().optional(),
});

export type ReceiveShipmentBodyType = z.infer<typeof ReceiveShipmentBody>;
