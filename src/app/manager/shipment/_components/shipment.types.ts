import { ShipmentStatus } from "@/utils/enum";

export interface ShipmentRow {
  id: string;
  orderId: string;
  storeName: string;
  status: ShipmentStatus | string;
  shipDate: string | null;
  createdAt: string;
}

export interface ShipmentTableProps {
  items: ShipmentRow[];
  isLoading: boolean;
}

export interface ShipmentFilterProps {
  filters: any;
  onFilterChange: (updates: any) => void;
}