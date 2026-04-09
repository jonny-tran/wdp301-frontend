export type CoordinationSummaryItem = {
    productId: number;
    totalDemand: number;
    atpAvailable: number;
    shortage: number;
    productName?: string;
    unit?: string;
};

export type CoordinationSummary = {
    deliveryDate: string; // YYYY-MM-DD
    centralWarehouseId?: number;
    items: CoordinationSummaryItem[];
};

export type CoordinationInquiryLine = { productId: number; quantity: number };

export type CoordinationInquiryBody = {
    deliveryDate: string; // YYYY-MM-DD
    lines?: CoordinationInquiryLine[];
    note?: string;
};

export type CoordinationInquiryResult = {
    message?: string;
    productionOrderId?: string;
};

export type CoordinationBatchApproveItem = { orderItemId: string; quantityApproved: number };

export type CoordinationBatchApproveOrder = {
    orderId: string;
    items: CoordinationBatchApproveItem[];
};

export type CoordinationBatchApproveBody = {
    deliveryDate: string;
    orderApprovals: CoordinationBatchApproveOrder[];
};

export type CoordinationBatchApproveResult = {
    message?: string;
    approvedCount?: number;
};

