"use client";

import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { QueryOrder } from "@/types/order";
import { Input } from "@/components/ui/input";
import { Select } from "react-day-picker";

interface OrderFilterProps {
  filters: QueryOrder;
  onFilterChange: (updates: Partial<QueryOrder>) => void;
}

export default function OrderFilter({
  filters,
  onFilterChange,
}: OrderFilterProps) {
  // Danh sách trạng thái từ image_7b9559.png
  const statusOptions = [
    "pending",
    "approved",
    "rejected",
    "cancelled",
    "picking",
    "delivering",
    "completed",
    "claimed",
  ];

  return (
    <div className="bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-3">
      {/* 1. Tìm kiếm theo ID (search) */}
      <div className="relative flex-1 min-w-[200px]">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="TÌM MÃ ĐƠN HÀNG (ID)..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full bg-slate-50 border-none rounded-full py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-slate-900 transition-all"
        />
      </div>

      {/* 2. Lọc theo Cửa hàng (storeId) */}
      <input
        type="text"
        placeholder="MÃ CỬA HÀNG..."
        value={filters.storeId || ""}
        onChange={(e) => onFilterChange({ storeId: e.target.value })}
        className="bg-slate-50 border-none rounded-full py-3 px-6 text-[10px] font-black uppercase tracking-widest w-40"
      />

      {/* 3. Lọc Trạng thái (status) */}
      <Select
        value={filters.status || ""}
        onChange={(e) => onFilterChange({ status: e.target.value as any })}
        className="bg-slate-50 border-none rounded-full py-3 px-6 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-slate-900"
      >
        <option value="">TẤT CẢ TRẠNG THÁI</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s.toUpperCase()}
          </option>
        ))}
      </Select>

      {/* 4. Khoảng ngày (fromDate - toDate) */}
      <div className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-1.5 border border-slate-100">
        <CalendarIcon className="h-4 w-4 text-slate-400" />
        <Input
          type="date"
          value={filters.fromDate || ""}
          onChange={(e) => onFilterChange({ fromDate: e.target.value })}
          className="bg-transparent border-none text-[9px] font-black uppercase outline-none"
        />
        <span className="text-slate-300 font-bold">→</span>
        <Input
          type="date"
          value={filters.toDate || ""}
          onChange={(e) => onFilterChange({ toDate: e.target.value })}
          className="bg-transparent border-none text-[9px] font-black uppercase outline-none"
        />
      </div>

      {/* 5. Nút Clear Filter */}
      <button
        onClick={() =>
          onFilterChange({
            search: "",
            status: undefined,
            storeId: "",
            fromDate: "",
            toDate: "",
          })
        }
        className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
        title="Xóa bộ lọc"
      >
        <FunnelIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
