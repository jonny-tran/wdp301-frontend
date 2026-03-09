"use client";

import {
  PencilSquareIcon,
  InboxStackIcon,
  CalendarIcon,
  PhotoIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { Batch } from "@/types/product";
import { format } from "date-fns";
import { clsx } from "clsx";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BatchTableProps {
  items: Batch[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (batch: Batch) => void;
}

export default function BatchTable({
  items,
  isLoading,
  isError,
  onEdit,
}: BatchTableProps) {
  if (isLoading)
    return (
      <div className="p-20 text-center font-black animate-pulse text-slate-400">
        ĐANG TẢI LÔ HÀNG...
      </div>
    );
  if (isError)
    return (
      <div className="p-20 text-center text-red-500 font-bold italic underline">
        LỖI TRUY XUẤT DỮ LIỆU BATCH.
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-slate-50/80 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <tr>
            <th className="px-10 py-5 border-b border-slate-100">
              Mã Lô & Hình ảnh
            </th>
            <th className="px-6 py-5 border-b border-slate-100 text-center">
              Số lượng hiện tại
            </th>
            <th className="px-6 py-5 border-b border-slate-100">
              Ngày hết hạn
            </th>
            <th className="px-6 py-5 border-b border-slate-100">Trạng thái</th>
            <th className="px-10 py-5 border-b border-slate-100 text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((item) => (
            <tr
              key={item.id}
              className="group hover:bg-slate-900 transition-all duration-300"
            >
              <td className="px-10 py-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100 group-hover:border-slate-700 transition-all shadow-sm">
                    {item.imageUrl && item.imageUrl.trim() !== "" ? (
                      <img
                        src={item.imageUrl || "batch-image"}
                        alt={item.batchCode || "batch-image"}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      /* 2. Hiển thị Icon hoặc ảnh Placeholder nếu src trống */
                      <div className="flex flex-col items-center justify-center bg-slate-100 w-full h-full">
                        <ArchiveBoxIcon className="h-6 w-6 text-slate-300" />
                        <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-slate-900 group-hover:text-white uppercase tracking-tighter italic text-lg leading-none">
                      {item.batchCode}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Product ID: #{item.productId}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-6 text-center">
                <span className="text-xl font-black text-slate-900 group-hover:text-indigo-400 transition-colors">
                  {Number(item.currentQuantity).toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-600 group-hover:text-slate-300">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {item.expiryDate
                      ? format(new Date(item.expiryDate), "dd/MM/yyyy")
                      : "Vô thời hạn"}
                  </div>
                  <span className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">
                    Hạn dùng (EXP)
                  </span>
                </div>
              </td>
              <td className="px-6 py-6">
                <span
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-tighter shadow-sm",
                    item.status === "available"
                      ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white"
                      : "bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
                  )}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-10 py-6 text-right">
                <Button
                  onClick={() => onEdit(item)}
                  className="p-3 bg-slate-50 group-hover:bg-white/10 text-slate-400 group-hover:text-white rounded-2xl transition-all active:scale-90"
                >
                  <PencilSquareIcon className="h-5 w-5 stroke-[2.5px]" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
