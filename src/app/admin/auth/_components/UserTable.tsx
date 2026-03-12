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
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="h-10 w-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-300">
          Đang tải dữ liệu nhân sự...
        </p>
      </div>
    );
  }

  // 2. EMPTY STATE
  if (!items || items.length === 0) {
    return (
      <div className="py-32 text-center flex flex-col items-center gap-4 animate-in fade-in duration-700">
        <div className="p-5 bg-slate-50 rounded-2xl">
          <UserCircleIcon className="h-12 w-12 text-slate-200" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-700">
            Không có dữ liệu
          </p>
          <p className="text-xs text-slate-400">
            Không có nhân viên nào khớp với bộ lọc hiện tại
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/80">
            <th className="px-6 py-4">Danh tính</th>
            <th className="px-6 py-4">Vai trò</th>
            <th className="px-6 py-4 text-center">Trạng thái</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((user) => {
            // LOOKUP ROLE LABEL
            const currentRole = roleOptions.find(
              (opt) => opt.value === user.role,
            );
            const roleLabel = currentRole ? currentRole.label : user.role;
            const isActive = user.status === "ACTIVE" || user.isActive === true;

            return (
              <tr
                key={user.id}
                className="group hover:bg-slate-50 transition-colors duration-200"
              >
                {/* 1. IDENTITY COLUMN */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:border-primary/20 group-hover:text-primary transition-colors">
                      <UserCircleIcon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                        {user.username}
                      </span>
                      <span
                        className="text-xs text-slate-400 truncate max-w-[200px] block"
                        title={user.email}
                      >
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 2. ROLE BADGE */}
                <td className="px-6 py-4">
                  <span
                    className={clsx(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border inline-flex items-center gap-1.5",
                      user.role === "admin"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : user.role === "manager"
                          ? "bg-purple-50 text-purple-700 border-purple-100"
                          : user.role === "supply_coordinator"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : user.role === "central_kitchen_staff"
                              ? "bg-orange-50 text-orange-700 border-orange-100"
                              : user.role === "franchise_store_staff"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-slate-50 text-slate-500 border-slate-200",
                    )}
                  >
                    <ShieldCheckIcon className="h-3.5 w-3.5" />
                    {roleLabel}
                  </span>
                </td>

                {/* 3. STATUS COLUMN */}
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                    <div
                      className={clsx(
                        "h-2 w-2 rounded-full",
                        isActive
                          ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]"
                          : "bg-slate-300",
                      )}
                    />
                    <span className="text-[11px] font-bold text-slate-600">
                      {isActive ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </div>
                </td>

                {/* 4. ACTIONS COLUMN */}
                <td className="px-6 py-4 text-right">
                  <Button
                    onClick={() => onEdit(user)}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                  >
                    <PencilSquareIcon className="h-4 w-4 stroke-[2.5px]" />
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
