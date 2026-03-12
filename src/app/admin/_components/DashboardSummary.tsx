"use client";

import {
  UsersIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  totalUsers: number;
  totalStores: number;
  pendingClaimsCount: number;
  configCount: number;
  isLoading: boolean;
}

const CARDS = [
  {
    key: "users",
    label: "Tổng người dùng",
    icon: UsersIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    key: "stores",
    label: "Cửa hàng nhượng quyền",
    icon: BuildingStorefrontIcon,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
  },
  {
    key: "claims",
    label: "Khiếu nại chờ duyệt",
    icon: ExclamationTriangleIcon,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
  },
  {
    key: "configs",
    label: "Tham số cấu hình",
    icon: Cog6ToothIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
  },
];

export default function DashboardSummary({
  totalUsers,
  totalStores,
  pendingClaimsCount,
  configCount,
  isLoading,
}: Props) {
  const values: Record<string, number> = {
    users: totalUsers,
    stores: totalStores,
    claims: pendingClaimsCount,
    configs: configCount,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = values[card.key] ?? 0;
        const isCritical = card.key === "claims" && value > 0;

        return (
          <Card
            key={card.key}
            className={`relative rounded-2xl overflow-hidden p-0 border hover:shadow-md transition-shadow duration-200 ${
              isCritical ? "border-amber-200 shadow-amber-100/50 bg-amber-50/10" : "border-slate-100 shadow-sm bg-white"
            }`}
          >
            {/* Accent bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                card.key === "users"
                  ? "bg-blue-500"
                  : card.key === "stores"
                    ? "bg-emerald-500"
                    : card.key === "claims"
                      ? "bg-amber-500"
                      : "bg-purple-500"
              }`}
            />

            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div
                  className={`p-2.5 rounded-xl ${card.bgColor} ${card.borderColor} border`}
                >
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                {isCritical && (
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-100 animate-pulse">
                    Cần xử lý
                  </span>
                )}
              </div>

              <div>
                {isLoading ? (
                  <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-slate-900 tabular-nums">
                    {value.toLocaleString("vi-VN")}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-0.5">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
