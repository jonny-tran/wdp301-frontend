
import { OrderRow } from "./order.types";

/**
 * Mapper xử lý dữ liệu từ API /orders
 * Đã fix để nhận diện đúng mảng items từ response của useOrder
 */
export const extractOrders = (response: unknown): OrderRow[] => {
  const res = response as Record<string, unknown> | undefined;
  
  const rawItems = res?.items ?? (Array.isArray(res) ? res : []);

  if (!Array.isArray(rawItems)) {
    console.error("Mapper Error: Dữ liệu không phải là mảng items", rawItems);
    return [];
  }

  return rawItems.map((item: unknown): OrderRow => {
    const data = item as Record<string, unknown>;
    return {
    ...(data as unknown as OrderRow),
    formattedAmount: new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(Number(data.totalAmount || 0)),

    deliveryDateFormatted: data.deliveryDate 
      ? new Date(data.deliveryDate as string).toLocaleDateString('vi-VN')
      : "N/A",

    createdAtFormatted: data.createdAt 
      ? new Date(data.createdAt as string).toLocaleDateString('vi-VN') 
      : "N/A",
    };
  });
};

export const extractShortfallChartData = (shortfallAnalysis: Record<string, unknown>[]) => {
  if (!Array.isArray(shortfallAnalysis)) return [];

  return shortfallAnalysis
    .filter(item => Number(item.shortfallQuantity) > 0) // Chỉ lấy các lý do có thực tế thất thoát
    .map(item => ({
      name: item.reason || "Không xác định",
      value: Number(item.shortfallQuantity)
    }))
    .sort((a, b) => b.value - a.value); // Sắp xếp từ lớn đến bé để màu sắc đẹp hơn
};