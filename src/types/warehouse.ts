export interface PickingItem {
    batchId: number;
    batchCode: string;
    productName: string;
    quantityToPick: number;
    expiryDate: string; // FEFO strategy
    picked: boolean;
}

export interface PickingList {
    orderId: string;
    items: PickingItem[];
}

export interface WarehouseTask {
    orderId: string;
    type: 'picking' | 'packing';
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: string;
    totalItems: number;
}

export interface FinalizeShipmentDto {
    orderId: string;
}