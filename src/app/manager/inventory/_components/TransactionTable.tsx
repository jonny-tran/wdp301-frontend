"use client";

import { format } from "date-fns";
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function TransactionTable({
  items = [],
  isLoading,
}: {
  items: any[];
  isLoading: boolean;
}) {
  if (isLoading)
    return (
      <div className="p-32 text-center font-black text-slate-300 animate-pulse uppercase text-[10px] tracking-[0.3em]">
        Đang tải lịch sử biến động...
      </div>
    );

  if (items.length === 0)
    return (
      <div className="p-32 text-center flex flex-col items-center gap-4 text-slate-200 uppercase italic font-black text-[10px] tracking-[0.3em]">
        <ClockIcon className="h-10 w-10 opacity-20" />
        Chưa có biến động nào được ghi lại
      </div>
    );

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <table className="w-full min-w-[850px] text-left text-sm border-separate border-spacing-0 table-fixed">
        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-4 py-4 border-b border-slate-100 w-[18%]">
              Thời gian
            </th>
            <th className="px-4 py-4 border-b border-slate-100 w-[30%]">
              Sản phẩm / Kho
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-center w-[12%]">
              Loại
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-center w-[15%]">
              Số lượng
            </th>
            <th className="px-4 py-4 border-b border-slate-100 w-[25%]">
              Lý do & Ghi chú
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((t) => (
            <tr
              key={t.id}
              className="group hover:bg-slate-950 transition-all duration-300"
            >
              <td className="px-4 py-5 tabular-nums">
                <div className="flex flex-col leading-none gap-1">
                  <span className="text-[11px] font-black text-slate-900 group-hover:text-white transition-colors uppercase">
                    {format(new Date(t.createdAt), "dd/MM/yyyy")}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-500 italic uppercase">
                    {format(new Date(t.createdAt), "HH:mm:ss")}
                  </span>
                </div>
              </td>
              <td className="px-4 py-5">
                <div className="flex flex-col gap-1">
                  <span className="font-black text-slate-950 group-hover:text-white transition-colors uppercase italic text-[11px] tracking-tighter truncate">
                    {t.productName}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest leading-none">
                    {t.warehouseName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-5 text-center">
                <div className="flex justify-center">
                  {t.type === "IN" ? (
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
                      <ArrowDownLeftIcon className="h-4 w-4" />
                    </div>
                  ) : t.type === "OUT" ? (
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <ArrowsRightLeftIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </td>
              <td
                className={`px-4 py-5 text-center font-black italic text-xl tracking-tighter tabular-nums group-hover:text-white transition-colors
                ${t.type === "IN" ? "text-green-600" : t.type === "OUT" ? "text-red-600" : "text-blue-600"}`}
              >
                {t.type === "OUT" ? "-" : "+"}
                {t.quantity}
              </td>
              <td className="px-4 py-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-800 group-hover:text-white uppercase leading-tight tracking-tight">
                    {t.reason}
                  </span>
                  {t.note && (
                    <p className="text-[9px] text-slate-400 group-hover:text-slate-500 italic truncate max-w-[180px]">
                      "{t.note}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
