import { BaseUnitRow } from "./base-unit.types";

export function extractBaseUnitItems(raw: any): BaseUnitRow[] {
    // Debug để Hàn kiểm tra chính xác cấu trúc trong Console
    console.log("Dữ liệu thô từ API BaseUnits:", raw);

    // Kiểm tra tất cả các trường hợp có thể xảy ra của API
    const items = 
        raw?.data?.items || // Trường hợp: { data: { items: [] } }
        raw?.items ||       // Trường hợp: { items: [] }
        raw?.data ||        // Trường hợp: { data: [] }
        (Array.isArray(raw) ? raw : []); // Trường hợp: []

    if (!Array.isArray(items)) {
        console.warn("Mapper không tìm thấy mảng dữ liệu hợp lệ.");
        return [];
    }

    return items.map((item: any) => ({
        id: item.id ?? 0,
        name: item.name ?? "Không tên",
        description: item.description ?? "Chưa có mô tả",
        createdAt: item.createdAt ?? new Date().toISOString(),
    }));
}