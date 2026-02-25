"use client";

import { format } from "date-fns";
import {
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

export default function ClaimsTable({
  items = [],
  isLoading,
  onViewDetail,
}: any) {
  // ... (giữ nguyên phần Loading và Empty state)

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
          <tr>
            <th className="px-6 py-5 border-b border-slate-100 w-[22%]">
              Ngày nhận
            </th>
            <th className="px-6 py-5 border-b border-slate-100 w-[38%]">
              Shipment ID
            </th>
            <th className="px-6 py-5 border-b border-slate-100 text-center w-[20%]">
              Trạng thái
            </th>
            <th className="px-6 py-5 border-b border-slate-100 text-right w-[20%]">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((claim: any) => (
            <tr
              key={claim.id}
              className="group hover:bg-black transition-all duration-300"
            >
              {/* CỘT NGÀY NHẬN ĐÃ TĂNG CỠ CHỮ */}
              <td className="px-6 py-6 whitespace-nowrap">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-black text-black group-hover:text-white uppercase italic tracking-tighter transition-colors">
                    {claim.createdAt
                      ? format(new Date(claim.createdAt), "dd/MM/yyyy")
                      : "---"}
                  </span>
                  <span className="text-[11px] font-bold text-black/40 group-hover:text-white/40 uppercase tracking-widest leading-none transition-colors">
                    {claim.createdAt
                      ? format(new Date(claim.createdAt), "HH:mm:ss")
                      : ""}
                  </span>
                </div>
              </td>

              <td className="px-6 py-6">
                <span className="font-black text-black group-hover:text-white uppercase tracking-tighter text-[11px] line-clamp-1">
                  {claim.shipmentId}
                </span>
              </td>

              <td className="px-6 py-6 text-center">
                <div className="flex justify-center">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all
                    ${
                      claim.status === "approved"
                        ? "bg-green-50 text-green-700 group-hover:bg-green-600 group-hover:text-white"
                        : claim.status === "pending"
                          ? "bg-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white"
                          : "bg-red-50 text-red-700 group-hover:bg-red-600 group-hover:text-white"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
              </td>

              <td className="px-6 py-6 text-right">
                <button
                  onClick={() => onViewDetail(claim.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95"
                >
                  <EyeIcon className="h-3.5 w-3.5 stroke-[3px]" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
