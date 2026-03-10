"use client";

import { ClockIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

export interface AgingBatchItem {
  batchCode: string;
  productName: string;
  quantity: number;
  expiryDate: string;
  percentageLeft: number;
  level?: "WARNING" | "CRITICAL";
}

export interface AgingData {
  warning: AgingBatchItem[];
  critical: AgingBatchItem[];
}

export default function AgingTable({
  data,
  isLoading,
}: {
  data: AgingData;
  isLoading: boolean;
}) {
  // 1. Loading State
  if (isLoading)
    return (
      <div className="p-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-950 mb-4"></div>
        <p className="font-black text-slate-300 italic uppercase text-[10px] tracking-widest">
          Đang quét hạn sử dụng lô hàng...
        </p>
      </div>
    );

  // 2. Gộp dữ liệu an toàn (Defensive Merge)
  const warningList = data?.warning || [];
  const criticalList = data?.critical || [];

  const allBatches: AgingBatchItem[] = [
    ...criticalList.map((b: AgingBatchItem) => ({
      ...b,
      level: "CRITICAL" as const,
    })),
    ...warningList.map((b: AgingBatchItem) => ({
      ...b,
      level: "WARNING" as const,
    })),
  ];

  // 3. Empty State
  if (allBatches.length === 0)
    return (
      <div className="p-32 text-center flex flex-col items-center gap-4 text-slate-200 uppercase italic font-black text-[10px] tracking-[0.3em]">
        <ClockIcon className="h-10 w-10 opacity-20" />
        Tất cả lô hàng đều trong hạn an toàn
      </div>
    );

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <table className="w-full min-w-[850px] text-left text-sm border-separate border-spacing-0 table-fixed">
        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-4 py-4 border-b border-slate-100 w-[35%]">
              Lô hàng / Sản phẩm
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-center w-[15%]">
              Số lượng
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-center w-[15%]">
              Hết hạn
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-center w-[20%]">
              Vòng đời
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-center w-[15%]">
              Mức độ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {allBatches.map((batch, idx) => (
            <tr
              key={`${batch.batchCode}-${idx}`}
              className="group hover:bg-slate-950 transition-all duration-300"
            >
              <td className="px-4 py-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest leading-none">
                    {batch.batchCode}
                  </span>
                  <span className="font-black text-slate-900 group-hover:text-white transition-colors uppercase italic text-sm tracking-tighter">
                    {batch.productName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-5 text-center group-hover:text-white font-black italic text-lg tracking-tighter tabular-nums transition-colors">
                {batch.quantity}
              </td>
              <td className="px-4 py-5 text-center group-hover:text-white transition-colors font-bold text-[11px] tabular-nums">
                {batch.expiryDate
                  ? format(new Date(batch.expiryDate), "dd/MM/yyyy")
                  : "---"}
              </td>
              <td className="px-4 py-5">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-100 group-hover:bg-white/10 rounded-full h-1.5 overflow-hidden max-w-[120px]">
                    <div
                      className={`h-full transition-all duration-1000 ${batch.level === "CRITICAL" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-orange-400"}`}
                      style={{ width: `${batch.percentageLeft}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-black group-hover:text-white/50 italic tracking-widest tabular-nums">
                    {batch.percentageLeft}% CÒN LẠI
                  </span>
                </div>
              </td>
              <td className="px-4 py-5 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span
                    className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all
                    ${
                      batch.level === "CRITICAL"
                        ? "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                        : "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                    }`}
                  >
                    {batch.level}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
