"use client";

import { Button } from "@/components/ui/button";
import { OrderRow } from "./order.types";
import { OrderStatus } from "@/utils/enum";
import {
  EyeIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface Props {
  data: OrderRow[];
  rowStart: number;
}

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-amber-100 text-amber-600";
    case OrderStatus.APPROVED:
      return "bg-emerald-100 text-emerald-600";
    case OrderStatus.REJECTED:
      return "bg-red-100 text-red-600";
    case OrderStatus.CANCELLED:
      return "bg-slate-100 text-slate-500";
    default:
      return "bg-slate-100 text-slate-500";
  }
};

export default function OrderTable({ data, rowStart }: Props) {
  return (
    <div className="w-full overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr className="border-b border-slate-100">
            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              No.
            </th>
            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Mã Đơn / Cửa Hàng
            </th>
            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
              Tổng Tiền
            </th>
            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Dự Kiến Giao
            </th>
            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Trạng Thái
            </th>
            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
              Thao Tác
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((order, index) => (
            <tr
              key={order.id}
              className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0"
            >
              <td className="px-10 py-6 font-black italic text-slate-900">
                #{rowStart + index + 1}
              </td>
              <td className="px-6 py-6">
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 uppercase tracking-tighter italic">
                    {order.id.split("-")[0]}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    ID: {order.storeId}
                  </span>
                </div>
              </td>
              <td className="px-6 py-6 text-right font-black italic text-primary text-lg">
                {order.formattedAmount}
              </td>
              <td className="px-6 py-6">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase">
                  <TruckIcon className="w-4 h-4 stroke-[2.5px] text-slate-400" />
                  {order.deliveryDateFormatted}
                </div>
              </td>
              <td className="px-6 py-6">
                <span
                  className={clsx(
                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                    getStatusStyle(order.status),
                  )}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-10 py-6 text-right">
                <Button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-primary-dark hover:text-white transition-all group/btn">
                  <EyeIcon className="w-5 h-5 stroke-[2.5px]" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
