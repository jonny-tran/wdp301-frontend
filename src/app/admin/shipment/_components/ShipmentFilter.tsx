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

export interface ShipmentFilterValues {
  search: string;
  status: string;
  fromDate: string;
  toDate: string;
}

interface ShipmentFilterProps {
  filters: ShipmentFilterValues;
  onFilterChange: (updates: Partial<ShipmentFilterValues>) => void;
}

export default function ShipmentFilter({
  filters,
  onFilterChange,
}: ShipmentFilterProps) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 animate-in slide-in-from-top duration-500">
      <div className="relative flex-1 min-w-[300px]">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="TÌM THEO MÃ SHIPMENT HOẶC MÃ ĐƠN HÀNG..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full bg-slate-100/50 border-none rounded-full py-3 pl-10 pr-4 text-xs font-bold text-slate-900 uppercase tracking-widest focus:bg-white focus:ring-2 focus:ring-blue-400/50 transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Lọc theo Trạng thái */}
      <Select
        // Chuyển giá trị undefined/null thành "ALL" để đồng bộ logic dropdown
        value={filters.status || "ALL"}
        onValueChange={(value) =>
          onFilterChange({ status: value === "ALL" ? undefined : value })
        }
      >
        {/* Đưa toàn bộ styling cũ từ className của select vào SelectTrigger */}
        <SelectTrigger className="w-[180px] bg-slate-100/50 border-none rounded-full py-3 px-6 text-xs font-bold text-slate-900 uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-blue-400/50 shadow-none">
          <SelectValue placeholder="TẤT CẢ TRẠNG THÁI" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL" className="text-[10px] font-bold uppercase">
            TẤT CẢ TRẠNG THÁI
          </SelectItem>
          {[
            { value: "preparing", label: "Đang chuẩn bị" },
            { value: "in_transit", label: "Đang vận chuyển" },
            { value: "delivered", label: "Đã giao" },
            { value: "completed", label: "Hoàn thành" },
          ].map((s) => (
            <SelectItem
              key={s.value}
              value={s.value}
              className="text-[10px] font-bold uppercase"
            >
              {s.label.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        onClick={() =>
          onFilterChange({ search: "", status: "", fromDate: "", toDate: "" })
        }
        className="h-11 w-11 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition-all active:scale-95 shrink-0"
      >
        <FunnelIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
