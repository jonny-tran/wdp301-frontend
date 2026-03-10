"use client";

import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";

/** Warehouse options — ideally fetched from API, hardcoded for now */
const WAREHOUSE_OPTIONS = [
    { label: "Central Kitchen (Test)", value: "1" },
    { label: "Kho Tổng (CK)", value: "2" },
    { label: "Kho Franchise Store 1", value: "3" },
];

interface InventoryFilterProps {
    /** Current limit from parsed query, used as default value for the select */
    currentLimit: number;
}

/**
 * InventoryFilter — Presentational filter component.
 * Delegates URL updates entirely to BaseFilter (URL-driven state).
 */
export default function InventoryFilter({ currentLimit }: InventoryFilterProps) {
    const filterConfig: FilterConfig[] = [
        {
            key: "search",
            label: "Tìm kiếm",
            type: "text",
            placeholder: "Tìm tên sản phẩm hoặc SKU...",
            className: "md:col-span-2",
        },
        {
            key: "warehouseId",
            label: "Kho hàng",
            type: "select",
            options: WAREHOUSE_OPTIONS,
        },
        {
            key: "limit",
            label: "Số dòng",
            type: "select",
            defaultValue: String(currentLimit),
            options: [
                { label: "10", value: "10" },
                { label: "20", value: "20" },
                { label: "50", value: "50" },
            ],
        },
    ];

    return <BaseFilter filters={filterConfig} />;
}
