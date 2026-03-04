"use client";

import { useMemo, useState } from "react";
import { StoreDemandPatternAnalytics } from "@/types/store";
import { ChartBarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function DemandPattern({ data, isLoading, onSearchId }: { data: StoreDemandPatternAnalytics | null, isLoading: boolean, onSearchId: (id: number) => void }) {
  const [tempId, setTempId] = useState<string | number>(data?.productIdFilter || "");

  // Đảm bảo chartData luôn là mảng để không gây lỗi render
  const chartData = useMemo(() => data?.demandByDay || [], [data]);

  // Tính giá trị cao nhất để làm mốc 100% chiều cao
  const maxValue = useMemo(
    () => Math.max(...chartData.map((d) => d.totalRequestedQuantity), 1),
    [chartData],
  );

  if (isLoading)
    return (
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 h-[400px] flex items-center justify-center animate-pulse font-black text-black/5 uppercase">
        Đang phân tích nhu cầu...
      </div>
    );

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ChartBarIcon className="h-4 w-4 text-black" />
            <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">
              Store Demand
            </p>
          </div>
          <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter">
            Nhu cầu hàng tuần
          </h3>
          <p className="text-[10px] font-bold text-red-500 uppercase mt-2 italic">
            Đỉnh điểm: {chartData.find((d) => d.totalRequestedQuantity === maxValue)?.dayOfWeek} (
            {maxValue} đơn)
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchId(Number(tempId));
          }}
          className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100 focus-within:border-black transition-all"
        >
          <input
            type="number"
            placeholder="ID..."
            value={tempId}
            onChange={(e) => setTempId(e.target.value)}
            className="bg-transparent border-none text-[11px] font-black px-4 py-2 w-24 outline-none placeholder:text-black/20"
          />
          <button
            type="submit"
            className="bg-black text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all"
          >
            <MagnifyingGlassIcon className="h-4 w-4 stroke-[3px]" />
          </button>
        </form>
      </div>

      <div className="flex items-end justify-between h-48 gap-3 md:gap-5 px-2 relative z-10">
        {chartData.length > 0 ? (
          chartData.map((d: any, i: number) => {
            const height = (d.totalRequestedQuantity / maxValue) * 100;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-4 group/bar"
              >
                <div className="w-full relative flex flex-col justify-end h-full bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className="w-full bg-black transition-all duration-1000 ease-out origin-bottom group-hover/bar:bg-slate-700"
                    style={{ height: `${height}%` }}
                  />
                  {d.totalRequestedQuantity > 0 && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-black text-white text-[8px] font-black px-2 py-1 rounded-md mb-2 pointer-events-none whitespace-nowrap">
                      {d.totalRequestedQuantity.toLocaleString()} đơn
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-black text-black/40 group-hover/bar:text-black transition-colors tracking-tighter uppercase italic">
                  {d.dayOfWeek.includes("Thứ")
                    ? d.dayOfWeek.replace("Thứ ", "T")
                    : d.dayOfWeek.substring(0, 3)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="w-full text-center text-[10px] font-black text-black/10 uppercase italic pb-20">
            Không có dữ liệu
          </div>
        )}
      </div>

      <span className="absolute -bottom-4 -right-4 text-7xl font-black text-slate-50 italic -z-10 select-none uppercase">
        {data?.productIdFilter || "DEMAND"}
      </span>
    </div>
  );
}
