"use client";

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

  if (isLoading)
    return (
      <div className="p-20 text-center font-black text-slate-300 italic uppercase">
        Đang đồng bộ...
      </div>
    );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-6 py-4 border-b border-slate-100">
              Định danh (Mã đơn / Cửa hàng)
            </th>
            <th className="px-6 py-4 border-b border-slate-100 text-center">
              Ngày giao
            </th>
            <th className="px-6 py-4 border-b border-slate-100 text-center">
              Trạng thái
            </th>
            <th className="px-6 py-4 border-b border-slate-100 text-right">
              Chi tiết
            </th>
          </tr>
        </thead>
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
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <button className="p-3 bg-slate-50 group-hover:bg-white/10 text-slate-400 group-hover:text-white rounded-2xl transition-all">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
