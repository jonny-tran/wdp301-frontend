/**
 * Định nghĩa các vai trò trong hệ thống
 */
export type UserRole = 
  | "admin" 
  | "manager" 
  | "supply_coordinator" 
  | "central_kitchen_staff" 
  | "franchise_store_staff";

/**
 * Cấu trúc tùy chọn cho các thành phần Select
 */
export interface RoleOption {
  value: string;
  label: string;
}

/**
 * Dữ liệu hiển thị trên từng dòng của bảng UserTable
 * Khớp với backend camelCase response (không cần mapper)
 */
export interface UserRow {
  id: string;
  username: string;
  email: string;
  role: string;        // Key của vai trò (ví dụ: 'manager')
  status: string;      // 'ACTIVE' | 'INACTIVE' — từ backend
  isActive?: boolean;  // Computed field cho tiện hiển thị
  createdAt: string;
  phone?: string;
  storeId?: string;    // UUID cửa hàng (nếu là franchise_store_staff)
}

/**
 * Cấu trúc dữ liệu gửi lên khi cập nhật User
 */
export interface UpdateUserPayload {
  status: "ACTIVE" | "INACTIVE";
  role: string;
  email: string;
  phone: string;
}

/**
 * Cấu trúc phân trang cho API
 */
export interface UserPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}