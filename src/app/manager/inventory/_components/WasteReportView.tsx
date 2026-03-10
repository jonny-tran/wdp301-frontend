"use client";

import { TrashIcon, CalendarIcon } from "@heroicons/react/24/outline";

export interface WasteDetailItem {
  productName: string;
  wasteReason?: string;
  quantity: number;
  unit: string;
}

export interface WasteReportData {
  kpi?: {
    totalWastedQuantity: number;
    period: string;
  };
  details?: WasteDetailItem[];
}

export default function WasteReportView({ data, isLoading }: { data: WasteReportData; isLoading: boolean }) {
  // 1. Loading State
  if (isLoading)
    return (
      <div className="p-20 text-center font-black text-slate-200 animate-pulse">
        ĐANG TÍNH TOÁN LÃNG PHÍ...
      </div>
    );

  // 2. PHÒNG THỦ: Nếu data chưa có kpi, dùng giá trị an toàn
  const kpi = data?.kpi || { totalWastedQuantity: 0, period: "N/A" };
  const details = data?.details || [];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* KPI Card nổi bật */}
      <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100 flex justify-between items-center group">
        <div>
          <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-1">
            Tổng sản phẩm lãng phí
          </p>
          <h3 className="text-5xl font-black text-red-600 italic tracking-tighter">
            {kpi.totalWastedQuantity}
          </h3>
          <div className="flex items-center gap-2 mt-3 text-red-400">
            <CalendarIcon className="h-3 w-3" />
            <span className="text-[9px] font-bold uppercase italic">
              Kỳ báo cáo: {kpi.period}
            </span>
          </div>
        </div>
        <div className="p-6 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
          <TrashIcon className="h-8 w-8 text-red-500" />
        </div>
      </div>

      {/* Chi tiết danh sách */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">
          Phân tích chi tiết
        </h4>
        {details.length === 0 ? (
          <p className="p-10 text-center text-[10px] font-bold text-slate-300 uppercase italic">
            Chưa ghi nhận lãng phí trong kỳ này
          </p>
        ) : (
          <div className="grid gap-3">
            {details.map((d: WasteDetailItem, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-50 hover:border-red-200 hover:bg-red-50/20 transition-all group"
              >
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 uppercase italic text-sm tracking-tighter group-hover:text-red-700">
                    {d.productName}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    Lý do: {d.wasteReason || "Hao hụt"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-red-500 italic tracking-tighter">
                    -{d.quantity}
                  </span>
                  <span className="ml-1 text-[10px] font-bold text-slate-300 uppercase">
                    {d.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
