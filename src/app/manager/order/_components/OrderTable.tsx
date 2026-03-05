"use client";

<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { OrderRow } from "./order.types";
import { OrderStatus } from "@/utils/enum";
import {
  EyeIcon,
  ClockIcon,
  TruckIcon,
  CheckBadgeIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

interface Props {
  data: OrderRow[];
  rowStart: number;
}
=======
import { EyeIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { toast } from "sonner"; //

export default function OrderTable({
  items,
  isLoading,
}: {
  items: Order[];
  isLoading: boolean;
}) {
  /**
   * Hàm sao chép thông minh: Lấy ID dài nguyên bản từ JSON
   * @param e Event click
   * @param text Chuỗi đầy đủ cần copy
   * @param label Tên hiển thị trên Toast
   */
  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.stopPropagation(); // Không kích hoạt click dòng
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label} đầy đủ`); //
  };
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

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
<<<<<<< HEAD
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
=======
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((order) => {
            const shortId = order.id.slice(0, 8).toUpperCase();
            const shortStoreId = order.storeId.slice(0, 8).toUpperCase();

            return (
              <tr
                key={order.id}
                className="group hover:bg-slate-950 transition-all duration-300"
              >
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2">
                    {/* 1. Sao chép Order ID dài */}
                    <div className="flex items-center gap-2 group/id w-fit">
                      <span className="font-black text-slate-900 group-hover:text-white transition-colors italic tracking-tighter text-sm">
                        #{shortId}
                      </span>
                      <button
                        onClick={(e) => handleCopy(e, order.id, "Mã đơn")}
                        className="p-1.5 bg-slate-50 rounded-lg opacity-0 group-hover/id:opacity-100 transition-all hover:bg-white active:scale-90"
                        title="Copy Order UUID"
                      >
                        <DocumentDuplicateIcon className="h-3 w-3 text-slate-400" />
                      </button>
                    </div>

                    {/* 2. Sao chép Store ID dài */}
                    <div className="flex items-center gap-2 group/store w-fit">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Store: {shortStoreId}
                      </span>
                      <button
                        onClick={(e) =>
                          handleCopy(e, order.storeId, "Mã cửa hàng")
                        }
                        className="p-1 bg-slate-100/10 rounded-md opacity-0 group-hover/store:opacity-100 transition-all hover:bg-slate-100"
                        title="Copy Store UUID"
                      >
                        <DocumentDuplicateIcon className="h-2.5 w-2.5 text-slate-500" />
                      </button>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-center group-hover:text-white transition-colors font-bold text-[11px]">
                  {order.deliveryDate
                    ? format(new Date(order.deliveryDate), "dd/MM/yyyy")
                    : "---"}
                </td>

                <td className="px-6 py-5 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all
                    ${order.status === "completed"
                        ? "bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white"
                        : "bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white"
                      }`}
                  >
                    {order.status}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    ID: {order.storeId}
                  </span>
                </div>
              </td>
              <td className="px-6 py-6 text-right font-black italic text-indigo-600 text-lg">
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
                <Button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-black hover:text-white transition-all group/btn">
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
