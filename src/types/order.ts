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
    /** Đơn chưa gán shipment — dùng cho gom manifest */
    shipmentId?: string | null
    /** Bếp đã đồng ý hỗ trợ sản xuất (sau production-response accept) */
    isProductionConfirmed?: boolean
    is_production_confirmed?: boolean
    requiresProductionConfirm?: boolean
    requires_production_confirm?: boolean
    store?: Store
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

export type ApprovalSuggestionMode = "FULL_APPROVE" | "PARTIAL_FULFILLMENT" | "NO_STOCK";

export type ApprovalSuggestionLine = {
    productId: number;
    productName?: string;
    requested: number;
    atpAvailable: number;
    suggestedApprove: number;
    canceledByStock?: boolean;
    mode?: ApprovalSuggestionMode;
    /** Mốc HSD tối thiểu an toàn (YYYY-MM-DD) — có thể theo dòng hoặc dùng giá trị chung ở `ApprovalSuggestion`. */
    safetyMinimumExpiryDate?: string | null;
};

export type ApprovalSuggestion = {
    orderId?: string;
    lines: ApprovalSuggestionLine[];
    safetyMinimumExpiryDate?: string | null;
    travelHoursUsed?: number;
    bufferHours?: number;
    summarySuggestion?: string;
    /** Ví dụ: PARTIAL_STOCK — từ envelope approval-suggestion */
    summaryStatus?: string;
};


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


export type OrderCollaborationEvent = {
    occurredAt: string;
    kind: "request_production" | "kitchen_accept" | "kitchen_reject" | "system" | "unknown";
    title: string;
    detail?: string;
};

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
    isProductionConfirmed?: boolean;
    is_production_confirmed?: boolean;
    requiresProductionConfirm?: boolean;
    requires_production_confirm?: boolean;
    /** BE có thể trả mảng log; nếu không, FE tổng hợp từ note + cờ */
    collaborationLog?: OrderCollaborationEvent[];
    collaboration_log?: unknown;
}

export type OrderDetailItem = {
    id: number;
    orderId: string;
    productId: number;
    quantityRequested: string;
    quantityApproved: string | null;
    /** Giá snapshot tại lúc đặt — ưu tiên hiển thị trên đơn đã duyệt/hoàn tất */
    unitPriceAtOrder?: string | null;
    unit_price_at_order?: string | null;
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
    /** Khối lượng một đơn vị (kg) — phục vụ tính tải manifest */
    weightKg?: number | null;
    weight_kg?: number | null;
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
    routeId?: string | null;
    route_id?: string | null;
    route?: { id?: string; estimatedHours?: number | null; estimated_hours?: number | null } | null;
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
