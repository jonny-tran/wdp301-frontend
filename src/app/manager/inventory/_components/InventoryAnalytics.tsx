"use client";

import {
  InboxIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export type InventoryStats = {
  totalProducts: number;
  lowStockCount: number;
  expiringBatches: number;
  estimatedLossVnd: number;
};

export default function InventoryAnalytics({ data }: { data: InventoryStats }) {
  const stats = [
    {
      label: "Tổng sản phẩm",
      value: data.totalProducts,
      icon: InboxIcon,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Sắp hết hàng",
      value: data.lowStockCount,
      icon: ExclamationTriangleIcon,
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "Sắp hết hạn",
      value: data.expiringBatches,
      icon: ClockIcon,
      color: "text-red-600 bg-red-50",
    },
    {
      label: "Thiệt hại dự kiến",
      value: `${data.estimatedLossVnd.toLocaleString('vi-VN')}đ`,
      icon: BanknotesIcon,
      color: "text-slate-700 bg-slate-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
        >
          <div className={`p-3 rounded-lg ${s.color}`}>
            <s.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
              {s.label}
            </p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {s.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
