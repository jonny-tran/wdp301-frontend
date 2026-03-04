"use client";

import {
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { Store } from "@/types/store";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

interface StoreTableProps {
  items: Store[];
  isLoading: boolean;
  onEdit: (store: Store) => void;
  onDelete: (id: string) => void;
}

export default function StoreTable({
  items = [],
  isLoading,
  onEdit,
  onDelete,
}: StoreTableProps) {
  // 1. Loading State
  if (isLoading)
    return (
      <div className="p-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mb-4"></div>
        <p className="font-black text-black/20 italic uppercase text-[10px] tracking-widest">
          Đang tải danh sách Store...
        </p>
      </div>
    );

  // 2. Empty State - Nếu items rỗng dù đã fetch xong
  if (!items || items.length === 0)
    return (
      <div className="p-32 text-center flex flex-col items-center gap-4 text-black/10 uppercase italic font-black text-[10px] tracking-[0.4em]">
        <InboxIcon className="h-12 w-12 opacity-10" />
        Chưa có cửa hàng nào được đăng ký
      </div>
    );

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
          <tr>
            <th className="px-8 py-5 border-b border-slate-100 w-[35%]">
              Thông tin Cửa hàng
            </th>
            <th className="px-8 py-5 border-b border-slate-100 w-[25%]">
              Quản lý / Liên hệ
            </th>
            <th className="px-8 py-5 border-b border-slate-100 text-center w-[15%]">
              Trạng thái
            </th>
            <th className="px-8 py-5 border-b border-slate-100 text-right w-[25%]">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((store) => (
            <tr
              key={store.id}
              className="group hover:bg-black transition-all duration-300 ease-in-out"
            >
              {/* Tên & Địa chỉ */}
              <td className="px-8 py-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-black text-black group-hover:text-white uppercase italic tracking-tighter transition-colors">
                    {store.name}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-60 transition-opacity">
                    <MapPinIcon className="h-3 w-3 text-black group-hover:text-white" />
                    <span className="text-[10px] font-bold text-black group-hover:text-white truncate max-w-[250px]">
                      {store.address}
                    </span>
                  </div>
                </div>
              </td>

              {/* Quản lý & Phone */}
              <td className="px-8 py-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-3 w-3 text-black group-hover:text-white opacity-40" />
                    <span className="text-[11px] font-black text-black group-hover:text-white uppercase italic">
                      {store.managerName || "Chưa có quản lý"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-3 w-3 text-black group-hover:text-white opacity-40" />
                    <span className="text-[10px] font-bold text-black/40 group-hover:text-white/40">
                      {store.phone}
                    </span>
                  </div>
                </div>
              </td>

              {/* Status Badge */}
              <td className="px-8 py-6 text-center">
                <div className="flex justify-center">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all
                    ${store.isActive
                        ? "bg-green-50 text-green-700 group-hover:bg-green-600 group-hover:text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
                      }`}
                  >
                    {store.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </td>

              {/* Action Buttons */}
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2">
                  <Can I={P.STORE_UPDATE} on={Resource.STORE}>
                    <button
                      onClick={() => onEdit(store)}
                      className="p-2.5 bg-slate-50 group-hover:bg-white/10 text-black group-hover:text-white rounded-xl transition-all active:scale-95"
                    >
                      <PencilSquareIcon className="h-4 w-4 stroke-[2.5px]" />
                    </button>
                    <button
                      onClick={() => onDelete(store.id)}
                      className="p-2.5 bg-red-50 group-hover:bg-red-600/20 text-red-600 rounded-xl transition-all active:scale-95"
                    >
                      <TrashIcon className="h-4 w-4 stroke-[2.5px]" />
                    </button>
                  </Can>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
