export type ProductRow = {
    id: number;
    name: string;
    sku: string;
    baseUnit: string;
    status: 'ACTIVE' | 'INACTIVE';
    imageUrl: string;
    shelfLife: number;
    minStock: number;
};

export type BatchRow = {
    id: number;
    batchCode: string;
    expiryDate: string;
    status: 'pending' | 'available' | 'expired' | string;
    createdAt: string;
};

export type ProductDetail = {
    id: number;
    name: string;
    sku: string;
    baseUnit: string;
    imageUrl: string;
    isActive: boolean;
    batches: BatchRow[];
};