"use client";

import {
  PencilSquareIcon,
  TrashIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { BaseUnit } from "@/types/base-unit";

interface BaseUnitTableProps {
  items: BaseUnit[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (unit: BaseUnit) => void;
  onDelete: (id: number) => void;
}

export default function BaseUnitTable({
  items,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: BaseUnitTableProps) {
  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-slate-400">
        ĐANG TẢI DỮ LIỆU...
      </div>
    );
  if (isError)
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        LỖI TẢI HỆ THỐNG.
      </div>
    );

  return (
    <div className="overflow-x-auto px-1 pb-4">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-10 py-5 border-b border-slate-100">
              Đơn vị tính
            </th>
            <th className="px-10 py-5 border-b border-slate-100">
              Mô tả chi tiết
            </th>
            <th className="px-10 py-5 border-b border-slate-100 text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((item) => (
            <tr
              key={item.id}
              className="group border-l-4 border-l-transparent hover:border-l-blue-600 hover:bg-slate-900 transition-all duration-300 ease-in-out"
            >
              <td className="px-10 py-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-800 transition-colors shadow-sm">
                    <InboxIcon className="h-6 w-6 text-slate-400 group-hover:text-white" />
                  </div>
                  <span className="font-black text-slate-900 uppercase italic group-hover:text-white transition-colors tracking-tighter text-lg">
                    {item.name}
                  </span>
                </div>
              </td>
              <td className="px-10 py-6 font-bold text-slate-500 group-hover:text-slate-400 transition-colors italic">
                {item.description || "N/A"}
              </td>
              <td className="px-10 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-3 bg-white/10 text-white hover:bg-blue-600 rounded-xl transition-all shadow-sm"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-3 bg-white/10 text-white hover:bg-red-600 rounded-xl transition-all shadow-sm"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
