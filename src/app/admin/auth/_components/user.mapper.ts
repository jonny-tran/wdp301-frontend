import { UserRow, RoleOption, StoreOption } from "./user.types";

/**
 * Map danh sách người dùng từ API GET /v1/auth/users
 */
export function extractUserItems(raw: any): UserRow[] {
  const source = raw?.data?.items || raw?.items || [];
  
  if (!Array.isArray(source)) return [];

  return source.map((u: any) => ({
    id: u.id,
    username: u.username || "N/A",
    email: u.email || "N/A",
    role: u.role || "staff",
    storeId: u.storeId || null,
    // Chuyển đổi status chuỗi sang boolean phòng thủ
    isActive: u.status === "active", 
    createdAt: u.createdAt
  }));
}

/**
 * Map danh sách Role cho Select
 */
export function extractRoleOptions(raw: any): RoleOption[] {
  // API Roles trả về mảng trực tiếp trong data
  const source = raw?.data || [];
  
  if (!Array.isArray(source)) return [];

  return source.map((r: any) => ({
    value: r.value || "",
    label: r.label || r.value || "N/A" // Lấy nhãn tiếng Việt (ví dụ: "Quản lý khu vực")
  }));
}
/**
 * Map danh sách Cửa hàng cho Select
 */
export function extractStoreOptions(raw: any): StoreOption[] {
  const source = raw?.data?.items || raw?.data || [];
  if (!Array.isArray(source)) return [];
  return source.map((s: any) => ({ value: s.id, label: s.name || `Cửa hàng ${s.id}` }));
}