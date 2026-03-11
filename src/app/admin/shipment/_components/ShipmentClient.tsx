"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useShipment } from "@/hooks/useShipment";
import { Shipment } from "@/types/shipment";
import { PaginationMeta } from "@/types/base";
import { BasePagination } from "@/components/layout/BasePagination";
import ShipmentTable from "./ShipmentTable";
import ShipmentFilter, { ShipmentFilterValues } from "./ShipmentFilter";
import { TruckIcon } from "@heroicons/react/24/outline";

const isValidUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );

interface ShipmentQueryParams {
  page: number;
  limit: number;
  sortOrder: string;
  sortBy: string;
  search: string;
  status: string;
  storeId: string;
  fromDate: string;
  toDate: string;
}

/** Response wrapper từ API */
interface ShipmentListResponse {
  items?: Shipment[];
  meta?: PaginationMeta;
  data?: {
    items?: Shipment[];
    meta?: PaginationMeta;
  };
}

export default function ShipmentClient() {
  const { shipmentList } = useShipment();

  const [queryParams, setQueryParams] = useState<ShipmentQueryParams>({
    page: 1,
    limit: 10,
    sortOrder: "DESC",
    sortBy: "createdAt",
    search: "",
    status: "",
    storeId: "",
    fromDate: "",
    toDate: "",
  });

  const [debouncedParams, setDebouncedParams] = useState(queryParams);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedParams(queryParams), 400);
    return () => clearTimeout(handler);
  }, [queryParams]);

  const safeQuery = useMemo(() => {
    const cleaned: Record<string, string | number> = { ...debouncedParams };

    if (typeof cleaned.search === "string")
      cleaned.search = cleaned.search.replace(/[#%]/g, "").trim();

    if (cleaned.storeId && !isValidUUID(String(cleaned.storeId)))
      delete cleaned.storeId;

    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === "" || cleaned[key] === undefined)
        delete cleaned[key];
    });

    return cleaned;
  }, [debouncedParams]);

  const { data: rawData, isLoading } = shipmentList(
    safeQuery as Parameters<typeof shipmentList>[0],
  );

  const responseData = rawData as ShipmentListResponse | undefined;

  const items: Shipment[] = useMemo(
    () => responseData?.items || responseData?.data?.items || [],
    [responseData],
  );

  // Trích xuất pagination meta
  const meta = useMemo(() => {
    const m =
      responseData?.meta || responseData?.data?.meta;
    return {
      currentPage: m?.currentPage ?? queryParams.page,
      totalPages: m?.totalPages ?? 1,
      totalItems: m?.totalItems ?? 0,
      itemsPerPage: m?.itemsPerPage ?? queryParams.limit,
    };
  }, [responseData, queryParams.page, queryParams.limit]);

  const handlePageChange = useCallback(
    (page: number) => {
      setQueryParams((prev) => ({ ...prev, page }));
    },
    [],
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end px-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary rounded-2xl shadow-lg shadow-primary/20">
            <TruckIcon className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 leading-none">
              Vận chuyển
            </h1>
            <p className="text-xs text-slate-400">
              {isLoading
                ? "Đang đồng bộ..."
                : `${meta.totalItems} vận đơn trong hệ thống`}
            </p>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <ShipmentFilter
        filters={queryParams}
        onFilterChange={(updates: Partial<ShipmentFilterValues>) =>
          setQueryParams((prev) => ({ ...prev, ...updates, page: 1 }))
        }
      />

      {/* TABLE + PAGINATION */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden flex flex-col min-h-[500px]">
        <ShipmentTable items={items} isLoading={isLoading} />
        <div className="mt-auto border-t border-slate-100 px-6 py-4">
          <BasePagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            itemsPerPage={meta.itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
