"use client";

import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function ShipmentFilter({ filters, onFilterChange }: any) {
  const statusOptions = [
    "preparing",
    "picking",
    "delivering",
    "completed",
    "cancelled",
  ];

  return (
    <div className="bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-3 animate-in slide-in-from-top duration-500">
      <div className="relative flex-1 min-w-[300px]">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="TÌM THEO MÃ SHIPMENT HOẶC MÃ ĐƠN HÀNG..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full bg-slate-50 border-none rounded-full py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-300"
        />
      </div>

      <select
        value={filters.status || ""}
        onChange={(e) => onFilterChange({ status: e.target.value })}
        className="bg-slate-50 border-none rounded-full py-3 px-6 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-slate-900"
      >
        <option value="">TẤT CẢ TRẠNG THÁI</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s.toUpperCase()}
          </option>
        ))}
      </select>

      <button
        onClick={() =>
          onFilterChange({ search: "", status: "", fromDate: "", toDate: "" })
        }
        className="h-10 w-10 p-0 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition-all active:scale-95 shrink-0 bg-transparent border-none"
      >
        <FunnelIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
