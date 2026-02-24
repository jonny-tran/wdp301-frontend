"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Hooks & Types
import { useBatches } from "@/hooks/useBatches";
import { BatchRow } from "./batch.types";

// Helpers & Mappers
import { extractBatchItems } from "./batch.mapper";
import {
  RawSearchParams,
  createPaginationSearchParams,
} from "@/app/kitchen/_components/query";

// UI Components
import BatchTable from "./BatchTable";
import BatchEditModal from "./BatchEditModal";
import { BasePagination } from "@/components/layout/BasePagination";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import {
  CubeIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface BatchClientProps {
  searchParams: RawSearchParams;
}

export default function BatchClient({ searchParams }: BatchClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  // --- 1. QUẢN LÝ MODAL ---
  const [selectedBatch, setSelectedBatch] = useState<BatchRow | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- 2. DATA FETCHING (REACT QUERY) ---
  const { batchList } = useBatches();

  const parsedQuery = useMemo(() => {
    return {
      page: Number(searchParams.page) || 1,
      limit: Number(searchParams.limit) || 10,
      sortBy: (searchParams.sortBy as string) || "createdAt",
      sortOrder: (searchParams.sortOrder as "ASC" | "DESC") || "DESC",
      // Param search khớp với Swagger để tìm theo batchCode
      search: (searchParams.search as string) || undefined,
      // Lọc theo status (pending, available...)
      status: (searchParams.status as string) || undefined,
    };
  }, [searchParams]);

  const batchQuery = batchList(parsedQuery);

  // --- 3. MAPPING DỮ LIỆU PHÒNG THỦ ---
  const items = useMemo(
    () => extractBatchItems(batchQuery.data),
    [batchQuery.data],
  );

  const meta = useMemo(() => {
    // API bọc meta trong data.meta
    const m =
      (batchQuery.data as any)?.data?.meta || (batchQuery.data as any)?.meta;
    return {
      currentPage: m?.currentPage ?? 1,
      totalPages: m?.totalPages ?? 1,
      totalItems: m?.totalItems ?? 0,
      itemsPerPage: m?.itemsPerPage ?? 10,
    };
  }, [batchQuery.data]);

  // --- 4. NAVIGATION HANDLERS ---
  const updateNavigation = useCallback(
    (params: Record<string, any>) => {
      const newSearchParams = createPaginationSearchParams(
        searchParamsHook,
        params,
      );
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParamsHook],
  );

  const handleOpenEdit = (batch: BatchRow) => {
    setSelectedBatch(batch);
    setIsEditModalOpen(true);
  };

  // --- 5. BỘ LỌC (CẤU HÌNH THEO SWAGGER BATCHES) ---
  const filters: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Nhập mã lô hàng...",
      defaultValue: searchParams.search ?? "",
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Tất cả", value: "" },
        { label: "Chờ duyệt (Pending)", value: "pending" },
        { label: "Sẵn sàng (Available)", value: "available" },
        { label: "Hết hạn (Expired)", value: "expired" },
      ],
      defaultValue: (searchParams.status as string) ?? "",
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-[1.2rem] shadow-xl">
              <CubeIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Quản lý Lô hàng
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-1">
            <SparklesIcon className="h-3 w-3 text-blue-500 animate-pulse" />
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              Inventory Tracking • {meta.totalItems} Lô trong kho [cite:
              2026-02-25]
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-[2.5rem] bg-white p-2 shadow-sm border border-slate-100">
        <BaseFilter filters={filters} />
      </div>

      {/* Table Section */}
      <div className="rounded-[3rem] border border-slate-100 bg-white shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="bg-slate-50/50 px-10 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MagnifyingGlassIcon className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Kết quả:{" "}
              {searchParams.search
                ? `"${searchParams.search}"`
                : "Tất cả lô hàng"}
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            FEFO System Active
          </span>
        </div>

        <div className="flex-1">
          <BatchTable
            items={items}
            isLoading={batchQuery.isLoading}
            onEdit={handleOpenEdit}
          />
        </div>

        {/* Pagination */}
        <div className="border-t border-slate-50 px-10 py-8 bg-white/50">
          <BasePagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            itemsPerPage={meta.itemsPerPage}
            onPageChange={(page) => updateNavigation({ page })}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <BatchEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBatch(null);
        }}
        batch={selectedBatch}
      />
    </div>
  );
}
