"use client";

import { useMemo, useState, useEffect } from "react";
import { useOrder } from "@/hooks/useOrder";
import { QueryOrder } from "@/types/order";
import { extractOrderItems, extractOrderAnalytics } from "./order.mapper";
import OrderTable from "./OrderTable";
import OrderAnalytics from "./OrderAnalytics";
import OrderFilter from "./OrderFilter";

// Helper: Kiểm tra UUID chuẩn
const isValidUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );

export default function OrderClient() {
  const { orderList, fillRateAnalytics, slaPerformanceLeadTime } = useOrder();

  // 1. State quản lý Filter
  const [queryParams, setQueryParams] = useState<QueryOrder>({
    page: 1,
    limit: 10,
    sortOrder: "DESC",
    sortBy: "createdAt",
    search: "",
    storeId: "",
    status: undefined,
  });

  // 2. Debounce tránh gửi request liên tục
  const [debouncedParams, setDebouncedParams] = useState(queryParams);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedParams(queryParams), 400);
    return () => clearTimeout(handler);
  }, [queryParams]);

  /**
   * 3. VỆ SINH QUERY (Safe Query)
   * Chặn đứng ký tự đặc biệt và mã Store chưa hoàn chỉnh để tránh lỗi 500/400.
   */
  const safeQuery = useMemo(() => {
    const cleaned: any = { ...debouncedParams };

    // Lọc Search: Bỏ #, %
    if (cleaned.search) {
      cleaned.search = cleaned.search.replace(/[#%]/g, "").trim();
      if (cleaned.search.length < 2) delete cleaned.search;
    }

    // Lọc StoreId: Chỉ gửi khi là UUID chuẩn
    if (cleaned.storeId && !isValidUUID(cleaned.storeId)) {
      delete cleaned.storeId;
    }

    // Loại bỏ chuỗi rỗng để Backend không báo lỗi định dạng
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === "" || cleaned[key] === undefined)
        delete cleaned[key];
    });

    return cleaned;
  }, [debouncedParams]);

  // 4. Fetch Data
  const { data: rawOrders, isLoading } = orderList(safeQuery);
  const { data: rawFill } = fillRateAnalytics({
    storeId: safeQuery.storeId,
  } as any);
  const { data: rawLead } = slaPerformanceLeadTime({} as any);

  // 5. Mapping
  const items = useMemo(() => extractOrderItems(rawOrders), [rawOrders]);
  const stats = useMemo(
    () => extractOrderAnalytics(rawFill, rawLead),
    [rawFill, rawLead],
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="px-1 space-y-1">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
          Order Management
        </h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {isLoading
            ? "Đang đồng bộ..."
            : `Hệ thống tìm thấy ${rawOrders?.data?.meta?.totalItems || 0} đơn hàng`}
        </p>
      </div>

      <OrderAnalytics data={stats} />

      <OrderFilter
        filters={queryParams}
        onFilterChange={(updates) =>
          setQueryParams((p) => ({ ...p, ...updates, page: 1 }))
        }
      />
      {/* Vùng hiển thị bảng */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <OrderTable items={items} isLoading={isLoading} />
      </div>
    </div>
  );
}
