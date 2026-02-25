export type UserRole = "manager" | "supply_coordinator" | "central_kitchen_staff" | "franchise_store_staff";

export interface UserRow {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  storeId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface RoleOption {
  value: UserRole;
  label: string;
}

export interface CreateUserBody {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  storeId?: string;
}