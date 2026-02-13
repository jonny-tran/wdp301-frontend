import { Role } from "@/utils/enum";

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
    createdAt: string;
};

export type LoginResponse = {
    userId: string;
    email: string;
    username: string;
    role: Role;
    storeId: string;
    accessToken: string;
    refreshToken: string;
};