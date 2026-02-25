"use client";

import {
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { SupplierRow } from "./supplier.types";

interface SupplierTableProps {
  items: SupplierRow[];
  isLoading: boolean;
  onEdit: (supplier: SupplierRow) => void;
  onDelete: (id: number) => void;
}

export default function SupplierTable({
  items,
  isLoading,
  onEdit,
  onDelete,
}: SupplierTableProps) {
  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse font-black text-slate-300">
        Đang tải...
      </div>
    );

  return (
    // FIX 1: Thêm overflow-x-auto và chặn co bóp nội dung
    <div className="w-full overflow-x-auto scrollbar-hide">
      <table className="w-full min-w-[800px] text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr>
            {/* FIX 2: Giảm padding px-6 xuống px-4 để khớp Layout nhỏ */}
            <th className="px-4 py-3 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Nhà cung cấp
            </th>
            <th className="px-4 py-3 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Thông tin liên hệ
            </th>
            <th className="px-4 py-3 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
              Trạng thái
            </th>
            <th className="px-4 py-3 border-b border-slate-100 text-right text-[8px] text-slate-300 italic">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((item) => (
            <tr
              key={item.id}
              className="group hover:bg-slate-900 transition-all duration-200 ease-in-out cursor-pointer"
            >
              <td className="px-4 py-4">
                <p className="font-black text-slate-900 uppercase italic tracking-tighter group-hover:text-white leading-tight transition-colors">
                  {item.name}
                </p>
                {/* FIX 3: Đảm bảo text phụ cũng đổi màu khi hover */}
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase group-hover:text-slate-500 transition-colors">
                  {item.address}
                </p>
              </td>
              <td className="px-4 py-4 group-hover:text-white transition-colors">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold flex items-center gap-1.5">
                    <UserGroupIcon className="h-3 w-3 text-slate-400 group-hover:text-blue-400" />
                    {item.contactName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium group-hover:text-slate-400">
                    {item.phone}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <span
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all ${
                    item.isActive
                      ? "bg-green-100 text-green-700 group-hover:bg-green-600 group-hover:text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-700"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                {/* FIX 4: Thu nhỏ button để không chiếm chỗ */}
                <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="p-2 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-2 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-all"
                  >
                    <TrashIcon className="h-4 w-4" />
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
