"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { useWarehouse } from "@/hooks/useWarehouse";
import { handleErrorApi } from "@/lib/errors";
import { createPaginationSearchParams, normalizeMeta, parseKitchenListQuery, RawSearchParams } from "@/app/kitchen/_components/query";
import { extractTasks } from "./warehouse.mapper";
import WarehouseTasksTable from "./WarehouseTasksTable";

interface WarehouseClientProps {
    searchParams: RawSearchParams;
}

export default function WarehouseClient({ searchParams }: WarehouseClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();
    const queryClient = useQueryClient();

    const parsedQuery = useMemo(
        () => parseKitchenListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const { getPickingTaskList, resetPickingTask } = useWarehouse();

    const listQuery = getPickingTaskList({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        search: parsedQuery.search,
        date: parsedQuery.date,
        sortOrder: parsedQuery.sortOrder,
    });

    const tasks = useMemo(() => extractTasks(listQuery.data), [listQuery.data]);
    const meta = useMemo(
        () => normalizeMeta((listQuery.data as { meta?: unknown } | undefined)?.meta, parsedQuery.page, parsedQuery.limit, tasks.length),
        [listQuery.data, parsedQuery.limit, parsedQuery.page, tasks.length],
    );
    const rowStart = (meta.currentPage - 1) * meta.itemsPerPage;

    const filterConfig: FilterConfig[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Order ID or store...",
            className: "md:col-span-2",
        },
        {
            key: "date",
            label: "Delivery Date",
            type: "date",
        },
        {
            key: "limit",
            label: "Rows",
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
        const query = createPaginationSearchParams(searchParamsHook, nextPage);
        router.push(`${pathname}?${query}`);
    };

    const handleResetTask = async (orderId: string) => {
        try {
            await resetPickingTask.mutateAsync(orderId);
            await queryClient.invalidateQueries({ queryKey: ["picking-task-list"] });
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-text-main">Picking & Outbound</h1>
                    <p className="text-sm text-text-muted">Track and process central kitchen picking tasks for store orders.</p>
                </div>
                <button
                    onClick={() => listQuery.refetch()}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-text-main hover:border-primary/50 hover:text-primary"
                >
                    <ArrowPathIcon className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            <BaseFilter filters={filterConfig} />

            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                <WarehouseTasksTable
                    tasks={tasks}
                    rowStart={rowStart}
                    isLoading={listQuery.isLoading}
                    isError={listQuery.isError}
                    isResetting={resetPickingTask.isPending}
                    onReset={handleResetTask}
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
