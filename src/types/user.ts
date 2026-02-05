export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};
export type User = {
    id: string;
    username: string;
    email: string;
    role: string;
    storeId?: string;
    status: string;
    createdAt: string;
}