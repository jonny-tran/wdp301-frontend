import { Product } from "@/schemas/product";

export const MOCK_PRODUCTS: (Product & { id: string })[] = [
  { 
    id: "1", 
    sku: "PROD-004", 
    name: "Gà rán KFC Vippro", 
    baseUnit: "Kg", 
    shelfLifeDays: 5, 
    imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    id: "2", 
    sku: "PROD-005", 
    name: "Khoai tây chiên", 
    baseUnit: "Phần", 
    shelfLifeDays: 2, 
    imageUrl: "https://images.unsplash.com/photo-1630384066242-17a17833f347?q=80&w=1973&auto=format&fit=crop" 
  },
  { 
    id: "3", 
    sku: "PROD-006", 
    name: "Hamburger Bò", 
    baseUnit: "Cái", 
    shelfLifeDays: 1, 
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop" 
  }
];