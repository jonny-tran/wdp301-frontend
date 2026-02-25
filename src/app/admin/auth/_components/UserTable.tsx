"use client";

import {
  PencilSquareIcon,
  UserCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { UserRow, RoleOption } from "./user.types";
import { clsx } from "clsx";

interface UserTableProps {
  items: UserRow[];
  isLoading: boolean;
  roleOptions: RoleOption[]; // Nhận danh sách nhãn tiếng Việt từ Client
  onEdit: (user: UserRow) => void;
}

export default function UserTable({
  items,
  isLoading,
  roleOptions,
  onEdit,
}: UserTableProps) {
  // 1. Trạng thái đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="h-10 w-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Đang truy xuất dữ liệu nhân sự...
        </p>
      </div>
    );
  }

  // 2. Trạng thái danh sách trống
  if (!items || items.length === 0) {
    return (
      <div className="py-40 text-center flex flex-col items-center gap-4 opacity-50">
        <div className="p-5 bg-slate-50 rounded-full">
          <UserCircleIcon className="h-12 w-12 text-slate-300" />
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
            <th className="px-10 py-6">Danh tính định danh</th>
            <th className="px-6 py-6">Vai trò hệ thống</th>
            <th className="px-6 py-6 text-center">Trạng thái</th>
            <th className="px-10 py-6 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((user) => {
            // LOGIC LOOKUP ROLE LABEL
            const currentRole = roleOptions.find(
              (opt) => opt.value === user.role,
            );
            const roleLabel = currentRole ? currentRole.label : user.role;

            return (
              <tr
                key={user.id}
                className="group hover:bg-indigo-50/20 transition-all duration-200"
              >
                {/* 1. Thông tin cá nhân */}
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                      <UserCircleIcon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 leading-tight tracking-tight uppercase italic">
                        {user.username}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. Vai trò (Badge màu sắc riêng biệt) */}
                <td className="px-6 py-6">
                  <span
                    className={clsx(
                      "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm inline-flex items-center gap-1.5",
                      user.role === "manager"
                        ? "bg-purple-50 text-purple-600 border-purple-100"
                        : user.role === "supply_coordinator"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : user.role === "central_kitchen_staff"
                            ? "bg-orange-50 text-orange-600 border-orange-100"
                            : "bg-slate-50 text-slate-500 border-slate-200",
                    )}
                  >
                    <ShieldCheckIcon className="h-3 w-3" />
                    {roleLabel}
                  </span>
                </td>

                {/* 3. Trạng thái Online/Locked */}
                <td className="px-6 py-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 group-hover:bg-white transition-colors">
                    <div
                      className={clsx(
                        "h-1.5 w-1.5 rounded-full",
                        user.isActive
                          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                          : "bg-slate-300",
                      )}
                    />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                      {user.isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </div>
                </td>

                {/* 4. Nút thao tác (Hiện khi hover dòng) */}
                <td className="px-10 py-6 text-right">
                  <button
                    onClick={() => onEdit(user)}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:shadow-xl hover:border-indigo-100 transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                  >
                    <PencilSquareIcon className="h-4 w-4 stroke-[2.5px]" />
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
