"use client";

import {
  createPaginationSearchParams,
  normalizeMeta,
  parseManagerListQuery,
  type RawSearchParams,
} from "@/app/manager/_components/query";
import { BasePagination } from "@/components/layout/BasePagination";
import { Input } from "@/components/ui/input";
import { useClaim } from "@/hooks/useClaim";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { extractClaims } from "./claims.mapper";

import ClaimDetailView from "./ClaimDetailView";
import ClaimTable from "./ClaimsTable";

interface Props {
  searchParams: RawSearchParams;
}

export default function ClaimClient({ searchParams }: Props) {
  const searchParamsHook = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Quản lý ID để chuyển đổi giữa View Danh sách và View Chi tiết
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  // 2. URL-Driven State cho Pagination
  const parsedQuery = useMemo(
    () =>
      parseManagerListQuery(searchParams, {
        page: 1,
        limit: 10,
        sortOrder: "DESC",
      }),
    [searchParams],
  );

  // 3. Khởi tạo Hook và Queries
  const { claimList, resolveClaim } = useClaim();
  const {
    data: response,
    isLoading,
    isError,
  } = claimList({
    page: parsedQuery.page,
    limit: parsedQuery.limit,
    search: parsedQuery.search,
    sortOrder: parsedQuery.sortOrder,
  });

  const claims = useMemo(() => {
    const rawData = (response as { data?: unknown })?.data || response;
    const sourceItems = Array.isArray(rawData) ? rawData : (rawData as { items?: unknown })?.items || [];
    return extractClaims(sourceItems, (parsedQuery.page - 1) * parsedQuery.limit);
  }, [response, parsedQuery.page, parsedQuery.limit]);

  const meta = useMemo(() => {
    const rawData = (response as { data?: unknown })?.data || response;
    const rawMeta = Array.isArray(rawData) ? undefined : (rawData as { meta?: unknown })?.meta;
    return normalizeMeta(
      rawMeta,
      parsedQuery.page,
      parsedQuery.limit,
      claims.length,
    );
  }, [response, claims.length, parsedQuery.page, parsedQuery.limit]);

  // Handle Search Input Component
  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParamsHook.toString());
    if (val) params.set("search", val);
    else params.delete("search");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (nextPage: number) => {
    const query = createPaginationSearchParams(searchParamsHook, nextPage);
    router.push(`${pathname}?${query}`);
  };

  // 6. Logic xử lý Phê duyệt nhanh
  const handleResolve = (id: string) => {
    resolveClaim.mutate({
      id,
      data: {
        status: "approved",
        resolutionNote: "Đã phê duyệt thông qua trình quản lý nhanh.",
      },
    });
  };

  if (selectedClaimId) {
    return (
      <ClaimDetailView
        claimId={selectedClaimId}
        onBack={() => setSelectedClaimId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Khiếu nại
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi và giải quyết {meta.totalItems} vấn đề vận hành
          </p>
        </div>
      </div>

      {/* MAIN DATA CONTAINER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* TOP BAR: SEARCH */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              defaultValue={parsedQuery.search || ""}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm mã vận đơn (Shipment ID)..."
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-400/50"
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="flex-1 min-h-[400px]">
          <ClaimTable
            data={claims}
            isLoading={isLoading}
            isError={isError}
            onSelect={(id: string) => setSelectedClaimId(id)}
            onResolve={handleResolve}
          />
        </div>

        {/* FOOTER: Pagination */}
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
    </div>
  );
}
