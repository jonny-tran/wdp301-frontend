"use client";

import { format } from "date-fns";
import { EyeIcon, InboxIcon } from "@heroicons/react/24/outline";
import { Claim } from "@/types/claim";
import { Button } from "@/components/ui/button";

/** Map ClaimStatus → Vietnamese label & color */
const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Chờ duyệt",
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  approved: {
    label: "Chấp nhận",
    className: "bg-green-50 text-green-700 border-green-100",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-50 text-red-700 border-red-100",
  },
};

export default function ClaimsTable({
  items = [],
  isLoading,
  onViewDetail,
}: {
  items: Claim[];
  isLoading: boolean;
  onViewDetail: (id: string) => void;
}) {
  // LOADING
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="h-8 w-8 border-[3px] border-slate-100 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  // EMPTY
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 animate-in fade-in">
        <div className="p-4 bg-slate-50 rounded-2xl">
          <InboxIcon className="h-10 w-10 text-slate-200" />
        </div>
        <p className="text-sm font-bold text-slate-500">
          Không tìm thấy khiếu nại
        </p>
        <p className="text-xs text-slate-400">
          Chưa có khiếu nại nào trong hệ thống
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-6 py-3.5 border-b border-slate-100 w-[22%]">
              Ngày tạo
            </th>
            <th className="px-6 py-3.5 border-b border-slate-100 w-[38%]">
              Shipment ID
            </th>
            <th className="px-6 py-3.5 border-b border-slate-100 text-center w-[20%]">
              Trạng thái
            </th>
            <th className="px-6 py-3.5 border-b border-slate-100 text-right w-[20%]">
              Chi tiết
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((claim, index) => {
            const statusInfo = STATUS_MAP[claim.status] || {
              label: claim.status,
              className: "bg-slate-50 text-slate-500 border-slate-200",
            };

            return (
              <tr
                key={claim.claimId ?? `claim-${index}`}
                className="group hover:bg-slate-50 transition-colors duration-200"
              >
                {/* DATE */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-slate-900">
                      {claim.createdAt
                        ? format(new Date(claim.createdAt), "dd/MM/yyyy")
                        : "---"}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {claim.createdAt
                        ? format(new Date(claim.createdAt), "HH:mm:ss")
                        : ""}
                    </span>
                  </div>
                </td>

                {/* SHIPMENT ID */}
                <td className="px-6 py-4">
                  <span
                    className="font-bold text-slate-700 text-xs font-mono truncate max-w-[250px] block"
                    title={claim.shipmentId}
                  >
                    {claim.shipmentId}
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 text-right">
                  <Button
                    onClick={() => onViewDetail(claim.claimId)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
                  >
                    <EyeIcon className="h-3.5 w-3.5" />
                    Xem
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
