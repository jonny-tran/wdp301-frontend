"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useProduction } from "@/hooks/useProduction";
import {
    parseManagerListQuery,
    normalizeMeta,
    createPaginationSearchParams,
    type RawSearchParams,
} from "@/app/manager/_components/query";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import type { ProductionOrder } from "@/types/production";
import ProductionOrderTable from "./ProductionOrderTable";

export default function OrdersClient({ searchParams }: { searchParams: RawSearchParams }) {
    const router = useRouter();
    const pathname = usePathname();
    const urlParams = useSearchParams();

    const parsed = useMemo(
        () => parseManagerListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const { productionOrders } = useProduction();
    const listQuery = productionOrders({
        page: parsed.page,
        limit: parsed.limit,
        sortOrder: parsed.sortOrder,
        status: parsed.status,
        fromDate: parsed.fromDate,
        toDate: parsed.toDate,
        search: parsed.search,
    });

    const items: ProductionOrder[] = listQuery.data?.items ?? [];
    const meta = useMemo(
        () => normalizeMeta(listQuery.data?.meta, parsed.page, parsed.limit, items.length),
        [listQuery.data?.meta, parsed.page, parsed.limit, items.length],
    );

    const filterConfig: FilterConfig[] = useMemo(
        () => [
            {
                key: "search",
                label: "Tìm kiếm",
                type: "text",
                placeholder: "Mã lệnh, sản phẩm...",
                className: "lg:col-span-2",
            },
            {
                key: "status",
                label: "Trạng thái",
                type: "select",
                placeholder: "Tất cả",
                options: [
                    { label: "Chờ xử lý", value: "PENDING" },
                    { label: "Đang SX", value: "IN_PROGRESS" },
                    { label: "Hoàn tất", value: "COMPLETED" },
                    { label: "Đã hủy", value: "CANCELLED" },
                ],
                className: "lg:col-span-1",
            },
            {
                key: "fromDate",
                label: "Từ ngày",
                type: "date",
                className: "lg:col-span-1",
            },
            {
                key: "toDate",
                label: "Đến ngày",
                type: "date",
                className: "lg:col-span-1",
            },
            {
                key: "limit",
                label: "Số dòng",
                type: "select",
                defaultValue: String(parsed.limit),
                options: [
                    { label: "10 dòng", value: "10" },
                    { label: "20 dòng", value: "20" },
                    { label: "50 dòng", value: "50" },
                ],
                className: "lg:col-span-1",
            },
        ],
        [parsed.limit],
    );

    const handlePageChange = (nextPage: number) => {
        const q = createPaginationSearchParams(urlParams, nextPage);
        router.push(`${pathname}?${q}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Giám sát lệnh sản xuất</h1>
                <p className="text-sm text-slate-500 mt-1">
                    {meta.totalItems} lệnh — theo dõi tiến độ, tạm giữ nguyên liệu và hao hụt
                </p>
            </div>

            <BaseFilter filters={filterConfig} />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <ProductionOrderTable
                    items={items}
                    isLoading={listQuery.isLoading}
                    rowStart={(meta.currentPage - 1) * meta.itemsPerPage}
                />
                <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                    <BasePagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={meta.totalItems}
                        itemsPerPage={meta.itemsPerPage}
                    />
                </div>
            </div>
        </div>
    );
}
