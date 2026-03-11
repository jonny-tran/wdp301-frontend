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
  if (isLoading) {
    return (
      <div className="p-20 text-center font-medium text-slate-400 animate-pulse">
        Đang tính toán lãng phí...
      </div>
    );
  }

  const kpi = data?.kpi || { totalWastedQuantity: 0, period: "N/A" };
  const details = data?.details || [];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* KPI Card nổi bật */}
      <div className="bg-red-50 p-6 md:p-8 rounded-2xl border border-red-100 flex justify-between items-center group">
        <div>
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
            Tổng sản phẩm lãng phí
          </p>
          <h3 className="text-4xl md:text-5xl font-bold text-red-600">
            {kpi.totalWastedQuantity.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1.5 mt-3 text-red-400">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-xs font-medium uppercase">
              Kỳ báo cáo: {kpi.period}
            </span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-full shadow-sm">
          <TrashIcon className="h-8 w-8 text-red-500" />
        </div>
      </div>

      {/* Chi tiết danh sách */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">
          Phân tích chi tiết
        </h4>
        {details.length === 0 ? (
          <p className="py-10 text-center text-sm font-medium text-slate-400">
            Chưa ghi nhận lãng phí trong kỳ này
          </p>
        ) : (
          <div className="grid gap-3">
            {details.map((d: WasteDetailItem, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 transition-colors hover:border-red-200 hover:bg-red-50/30"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                    {d.productName}
                  </span>
                  <span className="text-xs font-medium text-slate-500 mt-0.5">
                    Lý do: {d.wasteReason || "Hao hụt"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-red-500">
                    -{d.quantity.toLocaleString()}
                  </span>
                  <span className="ml-1 text-xs font-medium text-slate-400">
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
