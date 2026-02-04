export interface Batch {
    id: string;
    planId: string;
    productId: string;
    quantity: number;
    status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
}
