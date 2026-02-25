export interface BatchRow {
  id: number;
  batchCode: string;
  productId: number;
  currentQuantity: string; // API trả về dạng string "100.00"
  expiryDate: string;
  status: "pending" | "available" | string;
  imageUrl: string | null;
  updatedAt: string;
}

export interface BatchTableProps {
  items: BatchRow[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (batch: BatchRow) => void;
}