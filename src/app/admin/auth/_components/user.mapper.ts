import { UserRow, RoleOption } from "./user.types";

/**
 * Interface hỗ trợ bóc tách cấu trúc API chung
 */
interface ApiResponseWrapper {
  data?: {
    items?: unknown[];
  };
  items?: unknown[];
}

/**
 * Trích xuất danh sách cửa hàng
 * Xử lý cả 2 trường hợp: data.items hoặc items trực tiếp
 */
export const extractStoreOptions = (data: unknown): { value: string; label: string }[] => {
  // Bóc tách theo cấu trúc: response.data (lớp 1) -> data.data (lớp 2) -> data.items (lớp 3)
  const response = data as any;
  const rawItems = response?.data?.items || response?.items || [];
  
  // LOG KIỂM TRA: Hàn mở console xem dòng này có ra mảng 2 phần tử không
  // console.log("Items bóc tách được:", rawItems);

  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((store: any) => ({
    value: store.id,
    label: store.name,
  }));
};

/**
 * Trích xuất danh sách vai trò
 * Roles thường trả về mảng trực tiếp hoặc bọc trong data
 */
export const extractRoleOptions = (data: unknown): RoleOption[] => {
  const response = data as any;
  const res = response?.data || response || [];
  
  return res.map((role: any) => ({
    // QUAN TRỌNG: Kiểm tra xem Backend trả về 'value' hay 'id' hay 'name'
    value: role.value || role.id || role.name, 
    label: role.label || role.displayName
  }));
};

/**
 * Trích xuất danh sách nhân sự
 * Xử lý đồng bộ hóa trạng thái ACTIVE/INACTIVE
 */
export const extractUserItems = (data: unknown): UserRow[] => {
  const response = data as ApiResponseWrapper | undefined;
  const rawItems = response?.data?.items || response?.items || [];
  
  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((item) => {
    const u = item as Record<string, unknown>;
    return {
      id: String(u.id || ""),
      username: String(u.username || ""),
      email: String(u.email || ""),
      role: String(u.role || ""),
      // Đồng bộ hóa trạng thái linh hoạt (Chuỗi hoặc Boolean)
      isActive: 
        String(u.status).toUpperCase() === 'ACTIVE' || 
        u.isActive === true,
      createdAt: String(u.createdAt || ""),
      phone: String(u.phone || ""), // Bổ sung cho UserEditModal
    };
  });
};