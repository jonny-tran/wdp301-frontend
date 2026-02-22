"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { BatchModal } from "@/components/kitchen/batch/BatchModal";
import { useProduct } from "@/hooks/useProduct";
import { handleErrorApi } from "@/lib/errors";
import { Batch } from "@/types/product";
import { createPaginationSearchParams, normalizeMeta, parseKitchenListQuery, RawSearchParams } from "@/app/kitchen/_components/query";
import { extractBatches } from "./batches.mapper";
import BatchesTable from "./BatchesTable";

interface BatchesClientProps {
    searchParams: RawSearchParams;
}

export default function BatchesClient({ searchParams }: BatchesClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();
    const queryClient = useQueryClient();

    const parsedQuery = useMemo(
        () => parseKitchenListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const { batchList, batchDetail, updateBatch } = useProduct();

    const listQuery = batchList({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        search: parsedQuery.search,
        sortOrder: parsedQuery.sortOrder,
    });

    const batches = useMemo(() => extractBatches(listQuery.data), [listQuery.data]);
    const meta = useMemo(
        () => normalizeMeta((listQuery.data as { meta?: unknown } | undefined)?.meta, parsedQuery.page, parsedQuery.limit, batches.length),
        [batches.length, listQuery.data, parsedQuery.limit, parsedQuery.page],
    );
    const rowStart = (meta.currentPage - 1) * meta.itemsPerPage;

    const [editingBatchId, setEditingBatchId] = useState<number | null>(null);
    const detailQuery = batchDetail(editingBatchId ?? 0);

    const filterConfig: FilterConfig[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Batch code or product...",
            className: "md:col-span-2",
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

    const handleSubmitUpdate = async (payload: { initialQuantity?: number; imageUrl?: string }) => {
        if (!editingBatchId) return;

        if (payload.initialQuantity === undefined && !payload.imageUrl) {
            setEditingBatchId(null);
            return;
        }

        try {
            await updateBatch.mutateAsync({
                id: editingBatchId,
                data: payload,
            });
            await queryClient.invalidateQueries({ queryKey: ["batch-list"] });
            await queryClient.invalidateQueries({ queryKey: ["batch-detail", editingBatchId] });
            setEditingBatchId(null);
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black text-text-main">Batch Management</h1>
                    <p className="text-sm text-text-muted">View and update warehouse batches from backend data.</p>
                </div>
            </div>

            <BaseFilter filters={filterConfig} />

            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                <BatchesTable
                    batches={batches}
                    rowStart={rowStart}
                    isLoading={listQuery.isLoading}
                    isError={listQuery.isError}
                    onEdit={setEditingBatchId}
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

            <BatchModal
                isOpen={Boolean(editingBatchId)}
                onClose={() => setEditingBatchId(null)}
                onSubmit={handleSubmitUpdate}
                initialData={(detailQuery.data as Batch) ?? null}
                isPending={updateBatch.isPending}
            />
        </div>
    );
}
