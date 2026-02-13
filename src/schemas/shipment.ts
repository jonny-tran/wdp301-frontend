import { z } from "zod";

export const ReceiveShipmentBody = z.object({
    items: z.array(z.object({
        batchId: z.number().int().positive('ID lô hàng không hợp lệ'),
        actualQty: z.number().int().positive('Số lượng thực nhận không hợp lệ'),
        damagedQty: z.number().int().positive('Số lượng hàng hỏng không hợp lệ'),
        evidenceUrls: z.array(z.url()).optional()
    })),
    notes: z.string().optional(),
    evidenceUrls: z.array(z.url()).optional()
});

export type ReceiveShipmentBodyType = z.infer<typeof ReceiveShipmentBody>;
