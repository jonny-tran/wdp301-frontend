import { UserRow, RoleOption } from "./user.types";

export const extractStoreOptions = (data: unknown): { value: string; label: string }[] => {
  // Bóc tách items từ data.items theo đúng cấu trúc JSON bạn gửi
  const response = data as { items?: Array<{ id: string; name: string }> } | undefined;
  const rawItems = response?.items || [];
  
  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((store) => ({
    value: store.id,
    label: store.name,
  }));
};

/**
 * Mapper xử lý danh sách Roles từ API
 */
export const extractRoleOptions = (data: unknown): RoleOption[] => {
  const res = data as Array<{ value: string; label: string }> | undefined;
  if (!Array.isArray(res)) return [];
  
  return res.map((role) => ({
    value: role.value,
    label: role.label,
  }));
};

export const extractUserItems = (data: unknown): UserRow[] => {
  // Bóc tách từ cấu trúc { data: { items: [...] } } hoặc { items: [...] }
  const response = data as any;
  const rawItems = response?.items || response?.data?.items || [];
  
  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((item: any) => ({
    id: item.id,
    username: item.username,
    email: item.email,
    role: item.role,
    isActive: item.status === 'active' || item.isActive === true, // Đồng bộ trạng thái
    createdAt: item.createdAt
  }));
};