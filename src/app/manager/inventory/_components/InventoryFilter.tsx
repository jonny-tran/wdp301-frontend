"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BuildingStorefrontIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export interface InventoryFilterValues {
  search?: string;
  warehouseId?: string | number;
}

interface InventoryFilterProps {
  filters: InventoryFilterValues;
  onFilterChange: (updates: Partial<InventoryFilterValues>) => void;
}

export default function InventoryFilter({
  filters,
  onFilterChange,
}: InventoryFilterProps) {
  // Danh sách kho hàng mẫu dựa trên dữ liệu JSON bạn cung cấp
  const warehouseOptions = [
    { id: 1, name: "Central Kitchen (Test)" },
    { id: 2, name: "Kho Tổng (CK)" },
    { id: 3, name: "Kho Franchise Store 1" },
  ];

  return (
    <div className="bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-3 animate-in slide-in-from-top duration-500">
      {/* 1. Tìm kiếm Sản phẩm hoặc SKU */}
      <div className="relative flex-1 min-w-[300px]">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="TÌM TÊN SẢN PHẨM HOẶC SKU..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full bg-slate-50 border-none rounded-full py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-slate-900 transition-all placeholder:text-slate-300"
        />
      </div>

      {/* 2. Lọc theo Kho hàng */}
      <div className="relative min-w-[200px]">
        {/* Icon để bên ngoài hoặc bọc trong div wrapper */}
        <BuildingStorefrontIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />

        <Select
          value={filters.warehouseId ? String(filters.warehouseId) : "all"}
          onValueChange={(value: string) =>
            onFilterChange({
              warehouseId: value === "all" ? undefined : Number(value),
            })
          }
        >
          {/* CHÚ Ý: Đưa toàn bộ class CSS vào SelectTrigger */}
          <SelectTrigger className="w-full bg-slate-50 border-none rounded-full py-3 pl-10 pr-8 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:ring-2 focus:ring-slate-900 appearance-none text-slate-700">
            <SelectValue placeholder="TẤT CẢ KHO HÀNG" />
          </SelectTrigger>

          <SelectContent>
            {/* Sử dụng SelectItem thay cho option */}
            <SelectItem value="all">TẤT CẢ KHO HÀNG</SelectItem>
            {warehouseOptions.map((w) => (
              <SelectItem key={w.id} value={String(w.id)}>
                {w.name.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 3. Nút Reset bộ lọc */}
      <button
        onClick={() => onFilterChange({ search: "", warehouseId: "" })}
        className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400 active:scale-90 group"
        title="Xóa bộ lọc"
      >
        <FunnelIcon className="h-5 w-5 group-hover:text-slate-900" />
      </button>
    </div>
  );
}
