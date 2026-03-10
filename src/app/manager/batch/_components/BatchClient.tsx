"use client";

import { useState, useMemo } from "react";
import { useProduct } from "@/hooks/useProduct";
import { Batch } from "@/types/product";
import BatchTable from "./BatchTable";
import BatchFormModal from "./BatchFormModal";
import BatchFilter from "./BatchFilter";
import {
  parseManagerListQuery,
  normalizeMeta,
  createPaginationSearchParams,
  type RawSearchParams,
} from "@/app/manager/_components/query";
import { BasePagination } from "@/components/layout/BasePagination";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  InboxStackIcon,
} from "@heroicons/react/24/outline";

export default function BatchClient({
  searchParams,
}: {
  searchParams: RawSearchParams;
}) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const pathname = usePathname();

  const { batchList } = useProduct();

  // 1. URL-driven query
  const parsedQuery = useMemo(
    () => parseManagerListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
    [searchParams],
  );

  // 2. State modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  const { data, isLoading, isError, isPlaceholderData } = batchList({
    page: parsedQuery.page,
    limit: parsedQuery.limit,
    sortOrder: parsedQuery.sortOrder,
    search: parsedQuery.search, 
    productId: parsedQuery.productId,
  });

  const responseData = data as Record<string, unknown> | undefined;

  const items: Batch[] = useMemo(() => {
    const all = (responseData?.items || responseData || []) as Batch[];
    return all.map((b) => ({
      ...b,
      currentQuantity: Number(b.currentQuantity) || 0,
      initialQuantity: Number(b.initialQuantity) || 0,
    }));
  }, [responseData]);

  const meta = useMemo(() => {
    const rawMeta = responseData?.meta;
    return normalizeMeta(rawMeta, parsedQuery.page, parsedQuery.limit, items.length);
  }, [responseData, items.length, parsedQuery.page, parsedQuery.limit]);

  const handleOpenEdit = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const handlePageChange = (nextPage: number) => {
    const query = createPaginationSearchParams(searchParamsHook, nextPage);
    router.push(`${pathname}?${query}`);
  };

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-500">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-primary rounded-[2rem] flex items-center justify-center shadow-xl shadow-slate-200">
            <InboxStackIcon className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-slate-900 font-display tracking-tighter uppercase italic leading-none">
              Inventory Batches
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-1">
              Manager Portal • Batch & Expiry Control
            </p>
          </div>
        </div>
      </div>

      <BatchFilter currentLimit={parsedQuery.limit} />

      {/* Main Table Content */}
      <div className="rounded-[3.5rem] border border-slate-100 bg-white shadow-2xl overflow-hidden min-h-[550px] flex flex-col relative">
        <div className="flex-1">
          <BatchTable
            items={items}
            isLoading={isLoading && !isPlaceholderData}
            isError={isError}
            onEdit={handleOpenEdit}
          />
        </div>

        {/* Pagination Section */}
        <div className="px-12 py-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">
              HIỂN THỊ {items.length} / {meta.totalItems} LÔ HÀNG
            </span>
          </div>

          <BasePagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            totalItems={meta.totalItems}
            itemsPerPage={meta.itemsPerPage}
          />
        </div>
      </div>

      <BatchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        batch={selectedBatch}
      />
    </div>
  );
}
