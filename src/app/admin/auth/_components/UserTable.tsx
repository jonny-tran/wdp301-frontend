"use client";

import {
  PencilSquareIcon,
  UserCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { UserRow, RoleOption } from "./user.types";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";

interface UserTableProps {
  items: UserRow[];
  isLoading: boolean;
  roleOptions: RoleOption[];
  onEdit: (user: UserRow) => void;
}

export default function UserTable({
  items,
  isLoading,
  roleOptions,
  onEdit,
}: UserTableProps) {
  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="h-12 w-12 border-[5px] border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 italic">
          Đang truy xuất dữ liệu nhân sự...
        </p>
      </div>
    );
  }

  // 2. EMPTY STATE
  if (!items || items.length === 0) {
    return (
      <div className="py-40 text-center flex flex-col items-center gap-4 animate-in fade-in duration-700">
        <div className="p-6 bg-slate-50 rounded-[2rem]">
          <UserCircleIcon className="h-14 w-14 text-slate-200" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black uppercase italic tracking-tighter text-slate-900">
            Hệ thống trống
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Không có nhân viên nào khớp với bộ lọc
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50/50">
            <th className="px-10 py-8 italic">Danh tính định danh</th>
            <th className="px-6 py-8 italic">Vai trò hệ thống</th>
            <th className="px-6 py-8 text-center italic">Trạng thái</th>
            <th className="px-10 py-8 text-right italic">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((user) => {
            // LOOKUP ROLE LABEL: Chuyển key thành nhãn tiếng Việt
            const currentRole = roleOptions.find(
              (opt) => opt.value === user.role,
            );
            const roleLabel = currentRole ? currentRole.label : user.role;

            return (
              <tr
                key={user.id}
                className="group hover:bg-indigo-50/20 transition-all duration-300"
              >
                {/* 1. IDENTITY COLUMN */}
                <td className="px-10 py-7">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all duration-300">
                      <UserCircleIcon className="h-7 w-7" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 leading-tight tracking-tight uppercase italic group-hover:text-indigo-600 transition-colors">
                        {user.username}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. ROLE BADGE: Đã bổ sung màu cho Franchise Store Staff */}
                <td className="px-6 py-7">
                  <span
                    className={clsx(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm inline-flex items-center gap-2 italic transition-all",
                      user.role === "admin"
                        ? "bg-slate-900 text-white border-slate-900 shadow-slate-200"
                        : user.role === "manager"
                          ? "bg-purple-50 text-purple-600 border-purple-100 shadow-purple-50"
                          : user.role === "supply_coordinator"
                            ? "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-50"
                            : user.role === "central_kitchen_staff"
                              ? "bg-orange-50 text-orange-600 border-orange-100 shadow-orange-50"
                              : user.role === "franchise_store_staff"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50"
                                : "bg-slate-50 text-slate-500 border-slate-200",
                    )}
                  >
                    <ShieldCheckIcon className="h-3.5 w-3.5 stroke-[2.5px]" />
                    {roleLabel}
                  </span>
                </td>

                {/* 3. STATUS COLUMN */}
                <td className="px-6 py-7 text-center">
                  <div className="inline-flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 group-hover:bg-white transition-colors">
                    <div
                      className={clsx(
                        "h-2 w-2 rounded-full animate-pulse",
                        user.isActive
                          ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                          : "bg-slate-300",
                      )}
                    />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                      {user.isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </div>
                </td>

                {/* 4. ACTIONS COLUMN: Sửa lỗi icon bị trắng */}
                <td className="px-10 py-7 text-right">
                  <Button
                    onClick={() => onEdit(user)}
                    className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-2xl hover:border-indigo-100 transition-all active:scale-90 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                  >
                    <PencilSquareIcon className="h-5 w-5 stroke-[2.5px]" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
