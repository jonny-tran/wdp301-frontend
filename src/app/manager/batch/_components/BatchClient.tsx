/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createPaginationSearchParams,
  normalizeMeta,
  parseManagerListQuery,
  type RawSearchParams,
} from "@/app/manager/_components/query";
import { BasePagination } from "@/components/layout/BasePagination";
import { useProduct } from "@/hooks/useProduct";
import { Batch } from "@/types/product";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import BatchFilter from "./BatchFilter";
import BatchFormModal from "./BatchFormModal";
import BatchTable from "./BatchTable";

export default function BatchClient({
  searchParams,
}: {
  searchParams: RawSearchParams;
}) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const pathname = usePathname();

  const { batchList } = useProduct();

  // URL-driven query
  const parsedQuery = useMemo(
    () =>
      parseManagerListQuery(searchParams, {
        page: 1,
        limit: 10,
        sortOrder: "DESC",
      }),
    [searchParams],
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  const { data, isLoading, isError, isPlaceholderData } = batchList({
    page: parsedQuery.page,
    limit: parsedQuery.limit,
    sortOrder: parsedQuery.sortOrder,
    search: parsedQuery.search,
    productId: parsedQuery.productId,
  });

  const items: Batch[] = useMemo(() => {
    const rawData = (data as { data?: unknown })?.data || data;
    const sourceItems = Array.isArray(rawData)
      ? rawData
      : (rawData as { items?: unknown[] })?.items || [];
    return sourceItems.map((b: any) => ({
      ...b,
      currentQuantity: Number(b?.currentQuantity) || 0,
      initialQuantity: Number(b?.initialQuantity) || 0,
    }));
  }, [data]);

  const meta = useMemo(() => {
    const rawData = (data as { data?: unknown })?.data || data;
    const rawMeta = Array.isArray(rawData)
      ? undefined
      : (rawData as { meta?: unknown })?.meta;
    return normalizeMeta(
      rawMeta,
      parsedQuery.page,
      parsedQuery.limit,
      items.length,
    );
  }, [data, items.length, parsedQuery.page, parsedQuery.limit]);

  const handleOpenEdit = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const handlePageChange = (nextPage: number) => {
    const query = createPaginationSearchParams(searchParamsHook, nextPage);
    router.push(`${pathname}?${query}`);
  };

  // Lô hàng có thể được tạo từ Shipment/Receiving, nên ở đây chỉ có Edit info.
  // We keep + functionality hidden unless there's an actual direct create endpoint. (Original code mostly handled edit)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kho & Lô Hàng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading
              ? "Đang tải..."
              : `${meta.totalItems} lô hàng đang được quản lý`}
          </p>
        </div>
      </div>

      <BatchFilter currentLimit={parsedQuery.limit} />

      {/* Main Table Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <BatchTable
          items={items}
          isLoading={isLoading && !isPlaceholderData}
          isError={isError}
          onEdit={handleOpenEdit}
        />

        {/* Pagination Section */}
        {!isLoading && meta.totalPages > 1 && (
          <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
            <BasePagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
              totalItems={meta.totalItems}
              itemsPerPage={meta.itemsPerPage}
            />
          </div>
        )}
      </div>

      <BatchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        batch={selectedBatch}
      />
    </div>
  );
}
