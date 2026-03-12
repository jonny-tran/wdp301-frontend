"use client";

import { Button } from "@/components/ui/button";
import { Shipment } from "@/types/shipment";
import {
  ClockIcon,
  DocumentDuplicateIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { toast } from "sonner";

/** Map ShipmentStatus → Vietnamese label */
const STATUS_MAP: Record<string, { label: string; className: string }> = {
  preparing: {
    label: "Đang chuẩn bị",
    className: "bg-orange-50 text-orange-700 border-orange-100",
  },
  in_transit: {
    label: "Đang vận chuyển",
    className: "bg-blue-50 text-blue-700 border-blue-100",
  },
  delivered: {
    label: "Đã giao",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-green-50 text-green-700 border-green-100",
  },
};

export default function ShipmentTable({
  items = [],
  isLoading,
}: {
  items: Shipment[];
  isLoading: boolean;
}) {
  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="h-8 w-8 border-[3px] border-slate-100 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Đang tải vận đơn...
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
          Không tìm thấy vận đơn
        </p>
        <p className="text-xs text-slate-400">
          Thử thay đổi bộ lọc để tìm kết quả khác
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[850px] text-left text-sm border-separate border-spacing-0 table-fixed">
        <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-6 py-3.5 border-b border-slate-100 w-[25%]">
              Vận đơn / Đơn hàng
            </th>
            <th className="px-4 py-3.5 border-b border-slate-100 w-[25%]">
              Cửa hàng
            </th>
            <th className="px-4 py-3.5 border-b border-slate-100 text-center w-[15%]">
              Ngày tạo
            </th>
            <th className="px-4 py-3.5 border-b border-slate-100 text-center w-[15%]">
              Ngày xuất
            </th>
            <th className="px-4 py-3.5 border-b border-slate-100 text-center w-[12%]">
              Trạng thái
            </th>
            <th className="px-4 py-3.5 border-b border-slate-100 text-right w-[8%]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((ship) => {
            const [brand, branch] = (ship.storeName || "")
              .split("-")
              .map((s) => s.trim());

            const statusInfo = STATUS_MAP[ship.status] || {
              label: ship.status,
              className: "bg-slate-50 text-slate-500 border-slate-200",
            };

            return (
              <tr
                key={ship.id}
                className="group hover:bg-slate-50 transition-colors duration-200"
              >
                {/* 1. ID */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 group/ship w-fit">
                      <span
                        className="font-bold text-slate-900 text-sm font-mono truncate max-w-[150px]"
                        title={ship.id}
                      >
                        #{ship.id.slice(0, 8).toUpperCase()}
                      </span>
                      <Button
                        onClick={(e) =>
                          handleCopy(e, ship.id, "Mã vận đơn")
                        }
                        className="opacity-0 group-hover/ship:opacity-100 p-1 bg-slate-50 rounded-lg hover:bg-white active:scale-90 transition-all"
                      >
                        <DocumentDuplicateIcon className="h-3 w-3 text-slate-400" />
                      </Button>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      ORD: {ship.orderId.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </td>

                {/* 2. Store */}
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span
                      className="font-bold text-slate-900 text-xs truncate"
                      title={ship.storeName}
                    >
                      {brand}
                    </span>
                    {branch && (
                      <span className="text-[11px] text-slate-400 truncate">
                        {branch}
                      </span>
                    )}
                  </div>
                </td>

                {/* 3. Created date */}
                <td className="px-4 py-4 text-center text-xs text-slate-600 tabular-nums">
                  <div className="flex flex-col items-center gap-0.5">
                    <ClockIcon className="h-3 w-3 text-slate-300" />
                    <span>
                      {format(new Date(ship.createdAt), "dd/MM/yyyy")}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {format(new Date(ship.createdAt), "HH:mm")}
                    </span>
                  </div>
                </td>

                {/* 4. Ship date */}
                <td className="px-4 py-4 text-center text-xs text-slate-600 tabular-nums">
                  {ship.shipDate ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <span>
                        {format(new Date(ship.shipDate), "dd/MM/yyyy")}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {format(new Date(ship.shipDate), "HH:mm")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-300 font-medium">
                      Chưa xuất
                    </span>
                  )}
                </td>

                {/* 5. Status */}
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                </td>

                {/* 6. No actions — Admin read-only */}
                <td className="px-4 py-4" />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
