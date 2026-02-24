import { BatchRow, BatchDetail, BatchStatus } from "./batch.types";

export function extractBatchItems(raw: any): BatchRow[] {
  // Bóc tách linh hoạt tầng data.items hoặc items
  const source = raw?.data?.items || raw?.items || [];
  
  if (!Array.isArray(source)) return [];

  return source.map((b: any) => ({
    id: b.id,
    batchCode: b.batchCode || "N/A",
    productId: b.productId,
    expiryDate: b.expiryDate || "",
    status: (b.status?.toLowerCase() as BatchStatus) || 'pending',
    imageUrl: b.imageUrl || null,
    // Ép kiểu số cho string "50.00"
    currentQuantity: parseFloat(b.currentQuantity) || 0,
    createdAt: b.createdAt
  }));
}

export function extractBatchDetail(raw: any): BatchDetail | null {
  const d = raw?.data || raw;
  if (!d || !d.id) return null;

  return {
    id: d.id,
    batchCode: d.batchCode || "N/A",
    productId: d.productId,
    expiryDate: d.expiryDate,
    status: (d.status?.toLowerCase() as BatchStatus) || 'pending',
    imageUrl: d.imageUrl || null,
    currentQuantity: parseFloat(d.currentQuantity) || 0,
    createdAt: d.createdAt,
    initialQuantity: d.initialQuantity 
  };
}