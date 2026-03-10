"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useOrder } from "@/hooks/useOrder";
import { extractOrders } from "./order.mapper";
import {
    createPaginationSearchParams,
    normalizeMeta,
    parseManagerListQuery,
    type RawSearchParams,
} from "@/app/manager/_components/query";
import { BasePagination } from "@/components/layout/BasePagination";
import { OrderRow } from "./order.types";
import { OrderStatus } from "@/utils/enum";

import OrderTable from "./OrderTable";
import OrderFilter from "./OrderFilter";

interface OrderClientProps {
    searchParams: RawSearchParams;
}

export default function OrderClient({ searchParams }: OrderClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();

    // 1. URL-Driven State
    const parsedQuery = useMemo(
        () => parseManagerListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    // Modal state (for future extensions if needed)
    const [viewOrder, setViewOrder] = useState<OrderRow | null>(null);

    // 2. Fetch dữ liệu
    const { orderList } = useOrder();
    const listQuery = orderList({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        search: parsedQuery.search,
        status: parsedQuery.status as OrderStatus | undefined,
        storeId: parsedQuery.storeId,
        fromDate: parsedQuery.fromDate,
        toDate: parsedQuery.toDate,
        sortOrder: parsedQuery.sortOrder,
    });

    // 3. Mapping dữ liệu API → View Models (OrderRow)
    const orders = useMemo(() => extractOrders(listQuery.data), [listQuery.data]);
    
    // Xử lý thông tin Pagination meta
    const meta = useMemo(
        () => normalizeMeta(listQuery.data?.meta, parsedQuery.page, parsedQuery.limit, orders.length),
        [listQuery.data, orders.length, parsedQuery.limit, parsedQuery.page],
    );
    const rowStart = (meta.currentPage - 1) * meta.itemsPerPage;

    // 4. Handlers
    const handlePageChange = (nextPage: number) => {
        const query = createPaginationSearchParams(searchParamsHook, nextPage);
        router.push(`${pathname}?${query}`);
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-700">
            {/* HEADER SECTION */}
            <div className="flex justify-between items-end px-4">
                <div>
                    <h1 className="text-4xl font-black font-display tracking-wider uppercase text-text-main leading-none">
                        Quản lý <span className="text-primary">Đơn hàng</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-3 italic">
                        Hệ thống cung ứng • {meta.totalItems} bản ghi
                    </p>
                </div>
            </div>

            {/* URL DATA FILTER (Smart/Dumb pattern) */}
            <OrderFilter currentLimit={parsedQuery.limit} />

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
                
                {/* DATA TABLE */}
                <OrderTable 
                    data={orders} 
                    rowStart={rowStart} 
                    isLoading={listQuery.isLoading}
                    isError={listQuery.isError}
                    onView={(order) => setViewOrder(order)}
                />

                {/* FOOTER: Pagination */}
                <div className="px-8 py-5 border-t border-slate-50/50 bg-white">
                    <BasePagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={meta.totalItems}
                        itemsPerPage={meta.itemsPerPage}
                    />
                </div>
            </div>

            {/* Modal placeholder (Optional extension based on viewOrder) */}
            {viewOrder && (
               <div className="hidden">
                  {/* Detailed Modal implementation can be inserted here */}
               </div>
            )}
        </div>
    );
}
