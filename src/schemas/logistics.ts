import { z } from "zod";

// Enum định nghĩa trạng thái phương tiện
export const VehicleStatusEnum = z.enum(['available', 'in_use', 'maintenance']);


export const VehicleSchema = z.object({
  licensePlate: z.string().min(1, "Biển số không được để trống"),
  payloadCapacity: z.number().positive("Tải trọng phải lớn hơn 0"), 
  fuelRatePerKm: z.string().min(1, "Định mức không được để trống"),
  status: z.enum(["available", "maintenance"]),
});

export const RouteSchema = z.object({
  routeName: z.string().min(1, "Tên tuyến không được để trống"),
  distanceKm: z.number().positive("Khoảng cách phải lớn hơn 0"),
  estimatedHours: z.number().positive("Thời gian phải là số dương"),
  baseTransportCost: z.number().min(0, "Chi phí không được là số âm"),
});

// Xuất các Type tương ứng để sử dụng trong dự án
export type VehicleSchemaType = z.infer<typeof VehicleSchema>;
export type RouteSchemaType = z.infer<typeof RouteSchema>;