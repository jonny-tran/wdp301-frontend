
import { OrderRow } from "./order.types";

/**
 * Mapper xử lý dữ liệu từ API /orders
 * Đã fix để nhận diện đúng mảng items từ response của useOrder
 */
export const extractOrders = (response: unknown): OrderRow[] => {
  // Vì Hook orderList đã return res.data, nên response ở đây chính là object chứa { items, meta }
  const res = response as any;
  
  // Bóc tách mảng items: Ưu tiên res.items vì Hook đã bóc lớp .data đầu tiên rồi
  const rawItems = res?.items ?? (Array.isArray(res) ? res : []);

  if (!Array.isArray(rawItems)) {
    console.error("Mapper Error: Dữ liệu không phải là mảng items", rawItems);
    return [];
  }

  return rawItems.map((item: any): OrderRow => ({
    ...item,
    // Format tiền tệ Việt Nam (Ví dụ: 0 ₫)
    formattedAmount: new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(Number(item.totalAmount || 0)),

    // Format ngày dự kiến giao hàng
    deliveryDateFormatted: item.deliveryDate 
      ? new Date(item.deliveryDate).toLocaleDateString('vi-VN')
      : "N/A",

    // Format ngày tạo đơn
    createdAtFormatted: item.createdAt 
      ? new Date(item.createdAt).toLocaleDateString('vi-VN') 
      : "N/A",
  }));
};

export const extractShortfallChartData = (shortfallAnalysis: any[]) => {
  if (!Array.isArray(shortfallAnalysis)) return [];

  return shortfallAnalysis
    .filter(item => item.shortfallQuantity > 0) // Chỉ lấy các lý do có thực tế thất thoát
    .map(item => ({
      name: item.reason || "Không xác định",
      value: Number(item.shortfallQuantity)
    }))
    .sort((a, b) => b.value - a.value); // Sắp xếp từ lớn đến bé để màu sắc đẹp hơn
};