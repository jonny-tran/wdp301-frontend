"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useOrder } from "@/hooks/useOrder";
<<<<<<< HEAD
import { extractOrders } from "./order.mapper";
=======
import { Order, QueryOrder, FillRateAnalytics, SLAPerformanceLeadTime } from "@/types/order";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
import OrderTable from "./OrderTable";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/utils/enum";
import { clsx } from "clsx";

export default function OrderClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 1. Bóc tách params từ URL
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const sortOrder = searchParams.get("sortOrder") || "DESC";

  // 2. Fetch dữ liệu
  const { orderList } = useOrder();
  const { data: response, isLoading } = orderList({
    page,
    limit,
    search,
    status: status as OrderStatus,
    sortOrder,
  });

  const orders = extractOrders(response);
  const meta = response?.meta; // Lấy thông tin phân trang từ API
  const totalPages = meta?.totalPages || 1;
  const rowStart = (page - 1) * limit;

  // 3. Logic xử lý URL "Super Clean" - Chống lỗi 400
  const updateParams = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim() !== "" && value !== "approved") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page khi filter, trừ khi đang thực hiện chuyển trang
    if (!updates.page) params.set("page", "1");
    if (!params.has("sortOrder")) params.set("sortOrder", "DESC");

    // Quét sạch các key rỗng lọt lưới
    const keysToDelete: string[] = [];
    params.forEach((val, key) => {
      if (!val || val === "") keysToDelete.push(key);
    });
    keysToDelete.forEach((k) => params.delete(k));

<<<<<<< HEAD
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    updateParams({ page: String(newPage) });
  };

  const clearFilters = () => router.push(`${pathname}?page=1&sortOrder=DESC`);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end px-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Quản lý <span className="text-indigo-600">Đơn hàng</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-3 italic">
            Hệ thống cung ứng • {meta?.totalItems || 0} bản ghi
          </p>
        </div>
=======
  // 5. Mapping
  const items: Order[] = useMemo(() => (rawOrders as any)?.items || rawOrders?.items || [], [rawOrders]);
  const stats = useMemo(
    () => ({
      fillRate: (rawFill as any)?.data || rawFill,
      leadTime: (rawLead as any)?.data || rawLead,
    }),
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
            : `Hệ thống tìm thấy ${rawOrders?.meta?.totalItems || 0} đơn hàng`}
        </p>
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* FILTER BAR */}
        <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 stroke-[2.5px] z-10" />
            <Input
              defaultValue={search}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                updateParams({ search: e.currentTarget.value })
              }
              placeholder="Tìm mã đơn hàng (ID)..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-7 pl-14 h-auto shadow-sm font-bold placeholder:text-slate-300"
            />
          </div>

          <Select
            value={status || "ALL"}
            onValueChange={(val) => updateParams({ status: val })}
          >
            <SelectTrigger className="w-240px bg-white border border-slate-200 rounded-2xl py-7 px-6 h-auto shadow-sm font-black uppercase text-[10px] tracking-widest">
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-4 h-4 text-indigo-500" />
                <SelectValue placeholder="Trạng thái" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
              <SelectItem
                value="ALL"
                className="text-[10px] font-black uppercase"
              >
                Tất cả trạng thái
              </SelectItem>
              {[
                "pending",
                "approved",
                "rejected",
                "cancelled",
                "picking",
                "delivering",
                "completed",
                "claimed",
              ].map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  className="text-[10px] font-black uppercase tracking-widest"
                >
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || status) && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-14 w-14 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all shadow-sm"
            >
              <XMarkIcon className="w-6 h-6 stroke-[3px]" />
            </Button>
          )}
        </div>

        {/* DATA TABLE */}
        <OrderTable data={orders} rowStart={rowStart} />

        {/* FOOTER: Info & Pagination */}
        <div className="bg-slate-50/50 px-10 py-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">
              Trang {page} / {totalPages}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Hiển thị {orders.length} đơn hàng
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="w-12 h-12 rounded-2xl bg-white border-slate-200 hover:bg-black hover:text-white transition-all disabled:opacity-30"
            >
              <ChevronLeftIcon className="w-5 h-5 stroke-[3px]" />
            </Button>

            <div className="flex items-center gap-2 px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .map((p, index, array) => (
                  <div key={p} className="flex items-center gap-2">
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="text-slate-300 font-black">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(p)}
                      className={clsx(
                        "w-12 h-12 rounded-2xl text-[11px] font-black transition-all",
                        page === p
                          ? "bg-indigo-600 text-white shadow-lg scale-110"
                          : "bg-white border border-slate-100 text-slate-400 hover:border-indigo-200",
                      )}
                    >
                      {p}
                    </button>
                  </div>
                ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="w-12 h-12 rounded-2xl bg-white border-slate-200 hover:bg-black hover:text-white transition-all disabled:opacity-30"
            >
              <ChevronRightIcon className="w-5 h-5 stroke-[3px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
