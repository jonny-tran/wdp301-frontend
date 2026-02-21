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

export type StoreReliabilityAnalytics = {
    storeId: string;
    storeName: string;
    totalOrders: number;
    cancelledOrders: number;
    cancellationRate: number;
    reliabilityScore: number;
    riskLevel: "low" | "medium" | "high";
}[];

export type StoreDemandPatternAnalytics = {
    dayOfWeek: string;
    totalOrders: number;
    avgQuantity: number;
}[];
