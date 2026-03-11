"use client";

import { UserPlusIcon, ClockIcon } from "@heroicons/react/24/outline";
import { User } from "@/types/user";

/** Role label mapping */
const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị viên",
  manager: "Quản lý",
  supply_coordinator: "Điều phối",
  central_kitchen_staff: "Nhân viên bếp",
  franchise_store_staff: "Nhân viên cửa hàng",
};

interface Props {
  recentUsers: User[];
  isLoading: boolean;
}

export default function RecentActivity({ recentUsers, isLoading }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900">
          Tài khoản mới nhất
        </h2>
        <a
          href="/admin/auth"
          className="text-xs font-bold text-primary hover:underline"
        >
          Quản lý →
        </a>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl animate-pulse"
            >
              <div className="h-8 w-8 bg-slate-100 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 bg-slate-100 rounded" />
                <div className="h-2.5 w-32 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : recentUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-300">
          <UserPlusIcon className="h-8 w-8 mb-2" />
          <p className="text-xs font-medium">Chưa có tài khoản nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors"
            >
              {/* Avatar */}
              <div className="h-9 w-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {user.username?.charAt(0)?.toUpperCase() || "?"}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {user.username}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                    {user.email}
                  </span>
                  <span className="text-[10px] text-slate-300">•</span>
                  <span className="text-[10px] font-medium text-primary/70">
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0">
                <ClockIcon className="h-3 w-3" />
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                  : "---"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
