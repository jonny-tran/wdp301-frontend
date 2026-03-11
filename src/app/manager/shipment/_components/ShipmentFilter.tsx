/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

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

      <Select
        value={filters.status || "all"}
        onValueChange={(value) =>
          onFilterChange({ status: value === "all" ? "" : value })
        }
      >
        <SelectTrigger className="w-[200px] bg-slate-100/50 border-none rounded-full py-3 px-6 h-auto text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200/50 transition-colors focus:ring-1 focus:ring-slate-300 outline-none">
          <SelectValue placeholder="TẤT CẢ TRẠNG THÁI" />
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-200 shadow-lg rounded-xl">
          <SelectItem
            value="all"
            className="text-[10px] font-bold uppercase tracking-wider text-slate-500 focus:bg-slate-100 focus:text-slate-900"
          >
            TẤT CẢ TRẠNG THÁI
          </SelectItem>
          {statusOptions.map((s) => (
            <SelectItem
              key={s}
              value={s}
              className="text-[10px] font-bold uppercase tracking-wider text-slate-700 focus:bg-blue-50 focus:text-blue-700"
            >
              {s.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={() =>
          onFilterChange({ search: "", status: "", fromDate: "", toDate: "" })
        }
        className="h-10 w-10 p-0 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition-all active:scale-95 shrink-0 bg-transparent border-none"
      >
        <FunnelIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
