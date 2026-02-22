export type OrderCard = {
    id: string;
    storeId: string;
    status: string;
    deliveryDate?: string;
};

export type ShipmentCard = {
    id: string;
    orderId?: string;
    storeName?: string;
    status?: string;
    shipDate?: string;
};

export type ReviewItem = {
    canFulfill?: boolean;
    productName?: string;
    requestedQty?: number;
    currentStock?: number;
};
