"use client";

import {
  PencilSquareIcon,
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { SystemConfig } from "./ConfigClient";
import { format } from "date-fns";

interface Props {
  configs: SystemConfig[];
  onEdit: (config: SystemConfig) => void;
}

export default function ConfigTable({ configs, onEdit }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50">
          <tr>
            <th className="px-10 py-5">Tham số hệ thống</th>
            <th className="px-6 py-5">Giá trị hiện tại</th>
            <th className="px-6 py-5">Mô tả vận hành</th>
            <th className="px-10 py-5 text-right">Cập nhật</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {configs.map((cfg) => (
            <tr
              key={cfg.id}
              className="group hover:bg-indigo-50/30 transition-colors"
            >
              <td className="px-10 py-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-black text-slate-900 tracking-tight">
                    {cfg.key}
                  </span>
                </div>
              </td>
              <td className="px-6 py-6">
                <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-black shadow-lg">
                  {cfg.value}
                </span>
              </td>
              <td className="px-6 py-6">
                <p className="text-xs font-medium text-slate-500 max-w-md leading-relaxed">
                  {cfg.description}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-400 uppercase">
                  <CalendarDaysIcon className="h-3 w-3" />
                  Cập nhật:{" "}
                  {format(new Date(cfg.updatedAt), "HH:mm - dd/MM/yyyy")}
                </div>
              </td>
              <td className="px-10 py-6 text-right">
                <button
                  onClick={() => onEdit(cfg)}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all active:scale-90"
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
