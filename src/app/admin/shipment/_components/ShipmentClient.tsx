"use client";

import { useMemo, useState, useEffect } from "react";
import { useShipment } from "@/hooks/useShipment";
import { extractShipmentItems } from "./shipment.mapper";
import ShipmentTable from "./ShipmentTable";
import ShipmentFilter from "./ShipmentFilter";

const isValidUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id,
  );

export default function ShipmentClient() {
  const { shipmentList } = useShipment();

  // Khởi tạo state theo đúng tài liệu API
  const [queryParams, setQueryParams] = useState({
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

  /**
   * Safe Query: Vệ sinh dữ liệu trước khi gửi lên API
   */
  const safeQuery = useMemo(() => {
    const cleaned: any = { ...debouncedParams };

    // Lọc ký tự đặc biệt trong Search
    if (cleaned.search)
      cleaned.search = cleaned.search.replace(/[#%]/g, "").trim();

    // Chỉ gửi storeId nếu là UUID hợp lệ
    if (cleaned.storeId && !isValidUUID(cleaned.storeId))
      delete cleaned.storeId;

    // Xóa các trường rỗng
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === "" || cleaned[key] === undefined)
        delete cleaned[key];
    });

    return cleaned;
  }, [debouncedParams]);

  const { data: rawData, isLoading } = shipmentList(safeQuery);
  const items = useMemo(() => extractShipmentItems(rawData), [rawData]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end px-1">
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950 leading-none">
            Shipment Portal
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
            {isLoading
              ? "Đang đồng bộ..."
              : `Hệ thống tìm thấy ${rawData?.data?.meta?.totalItems || 0} vận đơn`}
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <ShipmentFilter
        filters={queryParams}
        onFilterChange={(updates) =>
          setQueryParams((prev) => ({ ...prev, ...updates, page: 1 }))
        }
      />

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <ShipmentTable items={items} isLoading={isLoading} />
      </div>
    </div>
  );
}
