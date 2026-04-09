/* eslint-disable @typescript-eslint/no-explicit-any */
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
import OrderDetailView from "./OrderDetailView"; // Import component vừa viết

interface OrderClientProps {
  searchParams: RawSearchParams;
}

export default function OrderClient({ searchParams }: OrderClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  // 1. URL-Driven State
  const parsedQuery = useMemo(
    () =>
      parseManagerListQuery(searchParams, {
        page: 1,
        limit: 10,
        sortOrder: "DESC",
      }),
    [searchParams],
  );

  // State quản lý xem chi tiết
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);

  // 2. Fetch dữ liệu danh sách
  const { orderList, orderDetail } = useOrder();

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

  // 3. Fetch dữ liệu chi tiết khi có ID
  const detailQuery = (orderDetail as any)(viewOrderId || "", {
    enabled: !!viewOrderId,
  });

  const orders = useMemo(() => {
    const rawData =
      (listQuery.data as { data?: unknown })?.data || listQuery.data;
    const sourceItems = Array.isArray(rawData)
      ? rawData
      : (rawData as { items?: unknown })?.items || [];
    return extractOrders(sourceItems);
  }, [listQuery.data]);

  const meta = useMemo(() => {
    const rawData =
      (listQuery.data as { data?: unknown })?.data || listQuery.data;
    const rawMeta = Array.isArray(rawData)
      ? undefined
      : (rawData as { meta?: unknown })?.meta;
    return normalizeMeta(
      rawMeta,
      parsedQuery.page,
      parsedQuery.limit,
      orders.length,
    );
  }, [listQuery.data, orders.length, parsedQuery.limit, parsedQuery.page]);

  // 4. Handlers
  const handlePageChange = (nextPage: number) => {
    const query = createPaginationSearchParams(searchParamsHook, nextPage);
    router.push(`${pathname}?${query}`);
  };

  // --- LOGIC HIỂN THỊ CHI TIẾT ---
  if (viewOrderId) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <OrderDetailView
          order={detailQuery} // Truyền query object để xử lý loading bên trong
          onBack={() => setViewOrderId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase italic text-slate-900 tracking-tight">
            Quản lý Đơn hàng
          </h1>
          <p className="text-[10px] font-bold uppercase italic text-slate-400 mt-1 tracking-widest">
            Hệ thống cung ứng Trung tâm • {meta.totalItems} bản ghi
          </p>
        </div>
      </div>

      {/* URL DATA FILTER */}
      <OrderFilter currentLimit={parsedQuery.limit} />

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* DATA TABLE */}
        <OrderTable
          data={orders}
          isLoading={listQuery.isLoading}
          isError={listQuery.isError}
          onView={(order) => setViewOrderId(order.id)} // Truyền ID để kích hoạt fetch detail
        />

        {/* FOOTER: Pagination */}
        {!listQuery.isLoading && meta.totalPages > 1 && (
          <div className="border-t border-slate-50 px-8 py-5 bg-slate-50/30">
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
