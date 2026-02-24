"use client";

import { PencilSquareIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { BatchRow } from "./batch.types";
import { clsx } from "clsx";

interface BatchTableProps {
  items: BatchRow[];
  isLoading: boolean;
  onEdit: (batch: BatchRow) => void;
}

export default function BatchTable({
  items,
  isLoading,
  onEdit,
}: BatchTableProps) {
  if (isLoading)
    return (
      <div className="p-20 text-center text-xs font-black uppercase animate-pulse">
        Đang kiểm kê lô hàng...
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <th className="px-10 py-6">Mã Lô Hàng</th>
            <th className="px-6 py-6">Số Lượng</th>
            <th className="px-6 py-6 text-center">Hạn Sử Dụng</th>
            <th className="px-6 py-6 text-center">Trạng Thái</th>
            <th className="px-10 py-6 text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((batch) => (
            <tr
              key={batch.id}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              <td className="px-10 py-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                    {batch.imageUrl ? (
                      <img
                        src={batch.imageUrl}
                        alt="Batch"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <PhotoIcon className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <span className="text-sm font-black text-slate-900 tracking-tight">
                    {batch.batchCode}
                  </span>
                </div>
              </td>
              <td className="px-6 py-6">
                <span className="text-sm font-bold text-slate-600">
                  {batch.currentQuantity.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-6 text-center">
                <span className="text-xs font-bold text-slate-400">
                  {new Date(batch.expiryDate).toLocaleDateString("vi-VN")}
                </span>
              </td>
              <td className="px-6 py-6 text-center">
                <span
                  className={clsx(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    batch.status === "available"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : "bg-orange-50 text-orange-600 border-orange-100",
                  )}
                >
                  {batch.status}
                </span>
              </td>
              <td className="px-10 py-6 text-right">
                <button
                  onClick={() => onEdit(batch)}
                  className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-lg transition-all active:scale-90"
                >
                  <PencilSquareIcon className="h-4 w-4 stroke-[2.5px]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
