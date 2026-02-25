import { ShipmentRow } from "./shipment.types";

export function extractShipmentItems(raw: any): ShipmentRow[] {
  // Dò tìm mảng items từ các tầng data
  const items = raw?.data?.items || raw?.items || [];

  if (!Array.isArray(items)) return [];

  return items.map((item: any) => ({
    id: item.id || "N/A",
    orderId: item.orderId || "N/A",
    storeName: item.storeName || "Cửa hàng không xác định",
    status: item.status || "preparing",
    shipDate: item.shipDate || null,
    createdAt: item.createdAt || "",
  }));
}