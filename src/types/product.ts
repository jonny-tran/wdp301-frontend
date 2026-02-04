export interface Product {
    id: number;
    name: string;
    sku: string;
    baseUnit: string;
    shelfLifeDays: number;
    imageUrl?: string;
}