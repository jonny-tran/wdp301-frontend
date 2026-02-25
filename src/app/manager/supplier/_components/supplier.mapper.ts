import { SupplierRow } from "./supplier.types";

/**
 * Mapper bóc tách dữ liệu Supplier với cơ chế phòng thủ 3 lớp
 */
export function extractSupplierItems(raw: any): SupplierRow[] {
  // Log để kiểm tra nhanh trong Console nếu dữ liệu vẫn không hiện
  console.log("Dữ liệu thô từ API:", raw);

  // Thử lần lượt các đường dẫn dữ liệu phổ biến
  const items = 
    raw?.data?.items || // Cấu trúc chính xác từ JSON bạn gửi
    raw?.items ||       
    raw?.data ||        
    (Array.isArray(raw) ? raw : []);

  if (!Array.isArray(items)) {
    console.warn("Mapper: Dữ liệu không phải là mảng.");
    return [];
  }

  return items.map((item: any) => ({
    id: item.id ?? 0,
    name: item.name ?? "N/A",
    contactName: item.contactName ?? "Chưa rõ",
    phone: item.phone ?? "N/A",
    address: item.address ?? "Không có địa chỉ",
    isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
  }));
}