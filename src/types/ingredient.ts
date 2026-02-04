export type IngredientCategory = 'spice' | 'meat' | 'vegetable' | 'dairy' | 'packaging';

export interface Ingredient {
    id: number;
    name: string;
    sku: string;
    category: IngredientCategory;
    currentStock: number;
    unit: string;
    minStockLevel: number;
    lastRestocked: string;
    imageUrl?: string;
}