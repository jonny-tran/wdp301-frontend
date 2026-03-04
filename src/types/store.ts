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
    systemAverage: {
        averageClaimRatePercentage: number;
        totalShipments: number;
    };
    storeAnalysis: {
        storeId: string;
        storeName: string;
        claimRatePercentage: number;
        totalDamagedQty: number;
        isFraudWarning: boolean;
    }[];
};

export type StoreDemandPatternAnalytics = {
    productIdFilter: number;
    demandByDay: {
        dayOfWeek: string;
        totalRequestedQuantity: number;
    }[];
};
