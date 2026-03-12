"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useShipment } from "@/hooks/useShipment";
import { Shipment } from "@/types/shipment";
import { ShipmentStatus } from "@/utils/enum";
import ShipmentTable from "./ShipmentTable";
import ShipmentFilter from "./ShipmentFilter";
import {
  createPaginationSearchParams,
  normalizeMeta,
  parseManagerListQuery,
  type RawSearchParams,
} from "@/app/manager/_components/query";
import { BasePagination } from "@/components/layout/BasePagination";

const isValidUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );

interface Props {
  searchParams: RawSearchParams;
}

export default function ShipmentClient({ searchParams }: Props) {
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const pathname = usePathname();

  const { shipmentList } = useShipment();

  // 1. URL-driven query
  const parsedQuery = useMemo(
    () => parseManagerListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
    [searchParams],
  );

  /**
   * Safe Query: Vệ sinh dữ liệu trước khi gửi lên API
   */
  const safeQuery = useMemo(() => {
    // Lọc ký tự đặc biệt trong Search
    const search = parsedQuery.search ? parsedQuery.search.replace(/[#%]/g, "").trim() : undefined;

    // Chỉ gửi storeId nếu là UUID hợp lệ
    const storeId = parsedQuery.storeId && isValidUUID(parsedQuery.storeId) ? parsedQuery.storeId : undefined;

    return {
      page: parsedQuery.page,
      limit: parsedQuery.limit,
      sortOrder: parsedQuery.sortOrder,
      sortBy: "createdAt",
      search,
      status: parsedQuery.status as ShipmentStatus | undefined,
      storeId,
      fromDate: parsedQuery.fromDate,
      toDate: parsedQuery.toDate,
    };
  }, [parsedQuery]);

  const { data: rawData, isLoading, isError, isPlaceholderData } = shipmentList(safeQuery);
  const items: Shipment[] = useMemo(() => {
    const rawDataOuter = (rawData as { data?: unknown })?.data || rawData;
    return Array.isArray(rawDataOuter) ? rawDataOuter : (rawDataOuter as { items?: Shipment[] })?.items || [];
  }, [rawData]);

  const meta = useMemo(() => {
    const rawDataOuter = (rawData as { data?: unknown })?.data || rawData;
    const rawMeta = Array.isArray(rawDataOuter) ? undefined : (rawDataOuter as { meta?: unknown })?.meta;
    return normalizeMeta(rawMeta, parsedQuery.page, parsedQuery.limit, items.length);
  }, [rawData, items.length, parsedQuery.page, parsedQuery.limit]);

  const handlePageChange = (nextPage: number) => {
    const query = createPaginationSearchParams(searchParamsHook, nextPage);
    router.push(`${pathname}?${query}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Vận đơn (Shipments)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading
              ? "Đang đồng bộ..."
              : `Theo dõi và điều phối ${meta.totalItems} chuyến hàng`}
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <ShipmentFilter currentLimit={parsedQuery.limit} />

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="flex-1">
          <ShipmentTable
            items={items}
            isLoading={isLoading && !isPlaceholderData}
            isError={isError}
          />
        </div>

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
    </div>
  );
}
