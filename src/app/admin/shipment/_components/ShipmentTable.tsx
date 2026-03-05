"use client";

import {
  EyeIcon,
  DocumentDuplicateIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Shipment } from "@/types/shipment";
import { format } from "date-fns";
import { toast } from "sonner";

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
    toast.success(`Đã sao chép ${label} đầy đủ`);
  };

  if (isLoading)
    return (
      <div className="p-20 text-center font-black text-slate-300 italic uppercase text-[10px] tracking-widest">
        Đang đồng bộ vận đơn...
      </div>
    );

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      {/* Table Fixed & Compact: Ngăn tràn màn hình */}
      <table className="w-full min-w-[850px] text-left text-sm border-separate border-spacing-0 table-fixed">
        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-4 py-4 border-b border-slate-100 w-[25%]">
              Vận đơn / Đơn hàng
            </th>
            <th className="px-4 py-4 border-b border-slate-100 w-[25%]">
              Cửa hàng
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-center w-[15%]">
              Ngày tạo
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-center w-[15%]">
              Ngày xuất
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-center w-[12%]">
              Trạng thái
            </th>
            <th className="px-4 py-4 border-b border-slate-100 text-right w-[8%]"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((ship) => {
            // Tách tên cửa hàng theo phong cách Order
            const [brand, branch] = ship.storeName
              .split("-")
              .map((s) => s.trim());

            return (
              <tr
                key={ship.id}
                className="group hover:bg-slate-950 transition-all duration-300 ease-in-out cursor-default"
              >
                {/* 1. Định danh ID: Rút gọn nhưng copy đủ 36 ký tự */}
                <td className="px-4 py-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 group/ship w-fit">
                      <span className="font-black text-slate-900 group-hover:text-white transition-colors italic text-sm tracking-tighter">
                        #{ship.id.slice(0, 8).toUpperCase()}
                      </span>
                      <button
                        onClick={(e) => handleCopy(e, ship.id, "Mã vận đơn")}
                        className="opacity-0 group-hover/ship:opacity-100 p-1.5 bg-slate-50 rounded-lg hover:bg-white active:scale-90 transition-all shadow-sm"
                      >
                        <DocumentDuplicateIcon className="h-3 w-3 text-slate-400" />
                      </button>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-500">
                      ORD: {ship.orderId.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </td>

                {/* 2. Cửa hàng: Ngắt dòng thông minh */}
                <td className="px-4 py-5">
                  <div className="flex flex-col leading-tight gap-1">
                    <span className="font-black text-slate-900 group-hover:text-white transition-colors text-[11px] uppercase tracking-tight truncate">
                      {brand}
                    </span>
                    {branch && (
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 uppercase italic truncate">
                        {branch}
                      </span>
                    )}
                  </div>
                </td>

                {/* 3. Ngày tạo: Hiển thị 2 dòng để tiết kiệm chiều ngang */}
                <td className="px-4 py-5 text-center group-hover:text-white transition-colors font-bold text-[11px] tabular-nums">
                  <div className="flex flex-col items-center gap-0.5">
                    <ClockIcon className="h-3 w-3 text-slate-200 group-hover:text-slate-500" />
                    <span>
                      {format(new Date(ship.createdAt), "dd/MM/yyyy")}
                    </span>
                    <span className="text-[8px] opacity-40 font-medium tracking-widest">
                      {format(new Date(ship.createdAt), "HH:mm")}
                    </span>
                  </div>
                </td>

                {/* 4. Ngày xuất kho */}
                <td className="px-4 py-5 text-center group-hover:text-white transition-colors font-bold text-[11px] tabular-nums">
                  {ship.shipDate ? (
                    <div className="flex flex-col items-center">
                      <span>
                        {format(new Date(ship.shipDate), "dd/MM/yyyy")}
                      </span>
                      <span className="text-[8px] opacity-40 font-medium tracking-widest">
                        {format(new Date(ship.shipDate), "HH:mm")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-300 text-[9px] uppercase font-black italic tracking-[0.2em]">
                      Đang chờ
                    </span>
                  )}
                </td>

                {/* 5. Trạng thái: Capsule màu sắc rực rỡ */}
                <td className="px-4 py-5 text-center">
                  <span
                    className={`inline-block w-full py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all duration-300
                    ${ship.status === "completed"
                        ? "bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white"
                        : ship.status === "preparing"
                          ? "bg-orange-100 text-orange-700 group-hover:bg-orange-600 group-hover:text-white"
                          : "bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white"
                      }`}
                  >
                    {ship.status === "completed"
                      ? "Hoàn thành"
                      : ship.status === "preparing"
                        ? "Đang chuẩn bị"
                        : ship.status === "picking"
                          ? "Đang lấy hàng"
                          : ship.status === "delivering"
                            ? "Đang giao"
                            : ship.status === "cancelled"
                              ? "Đã hủy"
                              : ship.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
