
export type Supplier = {
    id: number;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
};

import { BaseRequestPagination } from "./base";

export type QuerySupplier = BaseRequestPagination & {
    sortBy?: string;
    search?: string;
    isActive?: boolean;
};
