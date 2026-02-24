export type BatchStatus = 'pending' | 'available' | 'expired' | 'out_of_stock';

export interface BatchRow {
  id: number;
  batchCode: string;
  productId: number;
  productName?: string; // Sẽ map thêm nếu cần
  expiryDate: string;
  status: BatchStatus;
  imageUrl: string | null;
  currentQuantity: number; // Chuyển từ string sang number để tính toán
  createdAt: string;
}

export interface BatchDetail extends BatchRow {
  initialQuantity?: number;
}

export interface BatchUpdateBody {
  initialQuantity?: number;
  imageUrl?: string;
  status?: BatchStatus;
}