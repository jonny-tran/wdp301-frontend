/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUnitRow } from "./base-unit.types";

export const extractBaseUnits = (response: any, rowStart: number = 0): BaseUnitRow[] => {
    // Truy cập đúng vào response.data.items dựa trên JSON mới
    const rawItems = response?.items || []; 
    
    if (!Array.isArray(rawItems)) return [];

    // Bước quan trọng: Chỉ lấy các đơn vị đang hoạt động (isActive: true)
    return rawItems
        .filter((item: any) => item.isActive === true) 
        .map((item: any, index: number) => ({
            no: `#${String(rowStart + index + 1).padStart(2, "0")}`,
            id: item.id,
            name: item.name,
            description: item.description ?? "Không có mô tả",
        }));
};