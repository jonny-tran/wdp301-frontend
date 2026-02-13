import { BaseRequestPagination } from "./base";
export type Store = {
    id: string;
    name: string;
    address: string;
    phone: string;
    managerName: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};



export type QueryStore = BaseRequestPagination & {
    sortBy?: string;
    search?: string;
    isActive?: boolean;
};
