import { Product } from './product';

export interface Batch {
    id: number;
    batchCode: string;
    product: Product;
    quantity: number;
    initialQuantity: number;
    manufactureDate: string; // ISO Date
    expiryDate: string;      // ISO Date
    status: 'active' | 'expired' | 'depleted';
    imageUrl?: string;
}

export interface CreateBatchDto {
    initialQuantity: number;
    imageUrl?: string;
    productId: number;
}

export interface UpdateBatchDto {
    initialQuantity?: number;
    imageUrl?: string;
    status?: Batch['status'];
}