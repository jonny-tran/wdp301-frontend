import { OrderStatus } from "@/utils/enum";
import { BaseRequestPagination } from "./base";

export type Order = {
    id: string
    storeId: string
    status: OrderStatus
    totalAmount: string
    deliveryDate: string
    note: string | null
    priority: string
    createdAt: string
    updatedAt: string
};
export type OrderReview = {
    orderId: string;
    storeName: string;
    status: string;
    items: OrderReviewItem[];
}

export type OrderReviewItem = {
    productId: number;
    productName: string;
    requestedQty: number;
    currentStock: number;
    canFulfill: boolean;
}


export type CatalogItem = {
    productId: number;
    sku: string;
    name: string;
    unit: string;
    imageUrl: string;
    isAvailable: boolean;
};


export type Category = {
    id: number
    sku: string
    name: string
    baseUnitId: number
    shelfLifeDays: number
    minStockLevel: number
    imageUrl: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}


export type OrderDetail = {
    id: string;
    storeId: string;
    status: string;
    totalAmount: string;
    deliveryDate: string;
    priority: string;
    note: string | null;
    createdAt: string;
    updatedAt: string;
    items: OrderDetailItem[];
    store: Store;
}

export type OrderDetailItem = {
    id: number;
    orderId: string;
    productId: number;
    quantityRequested: string;
    quantityApproved: string | null;
    product: Product;
}

export type Product = {
    id: number;
    sku: string;
    name: string;
    baseUnitId: number;
    shelfLifeDays: number;
    minStockLevel: number;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type Store = {
    id: string;
    name: string;
    address: string;
    managerName: string | null;
    phone: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type QueryOrder = BaseRequestPagination & {
    sortBy?: string
    status?: OrderStatus
    search?: string
    storeId?: string
    fromDate?: string
    toDate?: string
}

export type QueryCatelog = BaseRequestPagination & {
    sortBy?: string
    isActive?: boolean
    search?: string  // name
}

export type FillRateAnalytics = {
    totalOrdered: number;
    totalApproved: number;
    fillRate: number;
    shortageItems: {
        productId: number;
        productName: string;
        requested: number;
        approved: number;
        shortage: number;
        reason: string;
    }[];
};

export type SLAPerformanceLeadTime = {
    avgReviewTime: number;
    avgPickingTime: number;
    avgDeliveryTime: number;
    totalLeadTime: number;
    unit: string;
};
