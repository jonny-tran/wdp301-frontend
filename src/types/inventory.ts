export interface InventoryDto {
    inventoryId: number;
    batchId: number;
    productId: number;
    productName: string;
    sku: string;
    batchCode: string;
    quantity: number;
    expiryDate: string;
    unit: string;
    imageUrl?: string;
}

export interface ReportIssueDto {
    batchId: number;
    reason: 'damaged' | 'missing' | 'expired';
    description?: string;
}