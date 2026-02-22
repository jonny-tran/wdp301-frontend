export type OrderRow = {
    id: string;
    storeId: string;
    status: string;
    deliveryDate?: string;
    totalAmount?: string;
    createdAt?: string;
};

export type ReviewRow = {
    productId: string;
    productName?: string;
    requestedQty?: number;
    currentStock?: number;
    canFulfill?: boolean;
};

export type OrderReviewView = {
    orderId: string;
    storeName: string;
    status: string;
    items: ReviewRow[];
};
