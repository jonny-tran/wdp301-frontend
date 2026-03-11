"use client";

import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { SystemConfig } from "./ConfigClient";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";
import { format } from "date-fns";

interface Props {
  configs: SystemConfig[];
  isLoading: boolean;
  onEdit: (config: SystemConfig) => void;
}

export default function ConfigTable({ configs, isLoading, onEdit }: Props) {
  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="h-8 w-8 border-[3px] border-slate-100 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Đang tải cấu hình...
        </p>
      </div>
    );
  }

  // EMPTY STATE
  if (!configs || configs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="p-4 bg-slate-50 rounded-2xl">
          <InboxIcon className="h-10 w-10 text-slate-200" />
        </div>
        <p className="text-sm font-bold text-slate-500">
          Chưa có cấu hình nào
        </p>
        <p className="text-xs text-slate-400">
          Hệ thống chưa được thiết lập tham số vận hành
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
          <tr>
            <th className="px-6 py-3.5">Tham số hệ thống</th>
            <th className="px-6 py-3.5">Giá trị hiện tại</th>
            <th className="px-6 py-3.5">Mô tả vận hành</th>
            <th className="px-6 py-3.5 text-right">Cập nhật</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {configs.map((cfg) => (
            <tr
              key={cfg.id}
              className="group hover:bg-slate-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                    <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {cfg.key}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-sm">
                  {cfg.value}
                </span>
              </td>
              <td className="px-6 py-4">
                <p
                  className="text-xs text-slate-500 max-w-md leading-relaxed truncate"
                  title={cfg.description}
                >
                  {cfg.description}
                </p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                  <CalendarDaysIcon className="h-3 w-3" />
                  Cập nhật:{" "}
                  {cfg.updatedAt
                    ? format(new Date(cfg.updatedAt), "HH:mm - dd/MM/yyyy")
                    : "---"}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <Can I={P.SYSTEM_CONFIGURE_PARAMS} on={Resource.SYSTEM}>
                  <button
                    onClick={() => onEdit(cfg)}
                    aria-label={`Sửa cấu hình ${cfg.key}`}
                    className="p-2.5 bg-white text-slate-400 rounded-xl border border-slate-200 hover:text-primary hover:border-primary/30 hover:shadow-md active:scale-95 transition-all"
                  >
                    <PencilSquareIcon className="h-4 w-4 stroke-[2.5px]" />
                  </button>
                </Can>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
