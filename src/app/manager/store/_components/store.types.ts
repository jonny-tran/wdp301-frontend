export interface Warehouse {
  id: number;
  name: string;
  type: 'central' | 'franchise';
  createdAt: string;
}

export interface StoreRow {
  id: string;
  name: string;
  address: string;
  managerName: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  warehouseCount: number;
}

export interface StoreDetail extends StoreRow {
  warehouses: Warehouse[];
}