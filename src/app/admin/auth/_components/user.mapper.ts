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

/** Cấu trúc đối tượng store trả về từ API */
interface RawStoreItem {
  id: string;
  name: string;
}

/** Cấu trúc đối tượng role trả về từ API */
interface RawRoleItem {
  value?: string;
  id?: string;
  name?: string;
  label?: string;
  displayName?: string;
}

/**
 * Trích xuất danh sách cửa hàng
 * Xử lý cả 2 trường hợp: data.items hoặc items trực tiếp
 */
export const extractStoreOptions = (data: unknown): { value: string; label: string }[] => {
  const response = data as ApiResponseWrapper | undefined;
  const rawItems = response?.data?.items || response?.items || [];

  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((store) => {
    const s = store as RawStoreItem;
    return {
      value: s.id,
      label: s.name,
    };
  });
};

/**
 * Trích xuất danh sách vai trò
 * Roles thường trả về mảng trực tiếp hoặc bọc trong data
 */
export const extractRoleOptions = (data: unknown): RoleOption[] => {
  const response = data as { data?: RawRoleItem[] } | RawRoleItem[] | undefined;
  const res: RawRoleItem[] = Array.isArray(response)
    ? response
    : Array.isArray((response as { data?: RawRoleItem[] })?.data)
      ? (response as { data: RawRoleItem[] }).data
      : [];

  return res.map((role) => ({
    value: role.value || role.id || role.name || "",
    label: role.label || role.displayName || "",
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