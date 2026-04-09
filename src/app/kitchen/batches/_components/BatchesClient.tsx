"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { useProduct } from "@/hooks/useProduct";
import { Batch } from "@/types/product";
import { createPaginationSearchParams, normalizeMeta, parseKitchenListQuery, RawSearchParams } from "@/app/kitchen/_components/query";
import BatchesTable from "./BatchesTable";

interface BatchesClientProps {
    searchParams: RawSearchParams;
}

export default function BatchesClient({ searchParams }: BatchesClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();

    const parsedQuery = useMemo(
        () => parseKitchenListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const { batchList } = useProduct();

    const listQuery = batchList({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        search: parsedQuery.search,
        sortOrder: parsedQuery.sortOrder,
    });

    const batches: Batch[] = useMemo(() => (listQuery.data as any)?.items || (listQuery.data as any)?.data?.items || [], [listQuery.data]);
    const meta = useMemo(
        () => normalizeMeta((listQuery.data as { meta?: unknown } | undefined)?.meta, parsedQuery.page, parsedQuery.limit, batches.length),
        [batches.length, listQuery.data, parsedQuery.limit, parsedQuery.page],
    );
    const rowStart = (meta.currentPage - 1) * meta.itemsPerPage;

    const filterConfig: FilterConfig[] = [
        {
            key: "search",
            label: "Tìm kiếm",
            type: "text",
            placeholder: "Mã lô hoặc sản phẩm...",
            className: "md:col-span-2",
        },
        {
            key: "limit",
            label: "Số dòng",
            type: "select",
            defaultValue: String(parsedQuery.limit),
            options: [
                { label: "10", value: "10" },
                { label: "20", value: "20" },
                { label: "50", value: "50" },
            ],
        },
    ];

    const handlePageChange = (nextPage: number) => {
        const query = createPaginationSearchParams(searchParamsHook, { page: nextPage });
        router.push(`${pathname}?${query}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black text-text-main">Quản lý Lô hàng</h1>
                    <p className="text-sm text-text-muted">Xem các lô hàng trong kho từ dữ liệu hệ thống.</p>
                </div>
            </div>

            <BaseFilter filters={filterConfig} />

            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                <BatchesTable
                    batches={batches}
                    rowStart={rowStart}
                    isLoading={listQuery.isLoading}
                    isError={listQuery.isError}
                />

                <div className="border-t border-gray-100 px-6 py-4">
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
