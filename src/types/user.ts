import { Role } from "@/utils/enum";
import { BaseRequestPagination } from "./base";



export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export type User = {
    id: string;
    username: string;
    email: string;
    role: Role;
    storeId?: string;
    phone?: string;
    isActive?: boolean;
    createdAt: string;
};

export type QueryUser = BaseRequestPagination & {
    role?: Role;
    status?: 'ACTIVE' | 'INACTIVE';
    search?: string;
}
