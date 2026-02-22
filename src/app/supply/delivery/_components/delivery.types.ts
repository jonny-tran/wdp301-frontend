export type ShipmentRow = {
    id: string;
    orderId?: string;
    storeName?: string;
    status?: string;
    shipDate?: string;
};

export type PickingItem = {
    productName?: string;
    sku?: string;
    batchCode?: string;
    quantity?: string | number;
    expiryDate?: string;
};

export type PickingDetail = {
    shipmentId?: string;
    orderId?: string;
    storeName?: string;
    status?: string;
    items: PickingItem[];
};
