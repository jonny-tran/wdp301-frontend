import { SystemConfig } from "./config.types";

export function extractConfigItems(raw: any): SystemConfig[] {
  // API trả về mảng trực tiếp trong data
  const source = raw?.data || raw || [];
  
  if (!Array.isArray(source)) return [];

  return source.map((item: any) => ({
    id: item.id,
    key: item.key || "UNKNOWN_KEY",
    value: item.value || "",
    description: item.description || "Chưa có mô tả cho tham số này.",
    updatedAt: item.updatedAt || new Date().toISOString(),
  }));
}