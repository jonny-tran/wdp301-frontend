import { BatchRow } from "./batch.types";

export function extractBatchItems(raw: any): BatchRow[] {
  // Trích xuất từ data.items theo cấu trúc JSON mới
  const source = raw?.items || raw?.data?.items || [];
  
  if (!Array.isArray(source)) return [];

  return source.map((item: any) => ({
    id: item.id,
    batchCode: item.batchCode || "N/A",
    productId: item.productId,
    currentQuantity: item.currentQuantity || "0",
    expiryDate: item.expiryDate || "",
    status: item.status || "pending",
    imageUrl: item.imageUrl,
    updatedAt: item.updatedAt || ""
  }));
}