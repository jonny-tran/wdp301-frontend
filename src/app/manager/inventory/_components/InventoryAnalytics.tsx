"use client";

import {
  InboxIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function InventoryAnalytics({ data }: { data: any }) {
  const stats = [
    {
      label: "Tổng sản phẩm",
      value: data.totalProducts,
      icon: InboxIcon,
      color: "text-blue-600",
    },
    {
      label: "Sắp hết hàng",
      value: data.lowStockCount,
      icon: ExclamationTriangleIcon,
      color: "text-orange-500",
    },
    {
      label: "Sắp hết hạn",
      value: data.expiringBatches,
      icon: ClockIcon,
      color: "text-red-500",
    },
    {
      label: "Thiệt hại dự kiến",
      value: `${data.estimatedLossVnd.toLocaleString()}đ`,
      icon: BanknotesIcon,
      color: "text-slate-900",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4"
        >
          <div className={`p-3 rounded-2xl bg-slate-50 ${s.color}`}>
            <s.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {s.label}
            </p>
            <p className="text-lg font-black italic tracking-tighter text-slate-900 leading-none">
              {s.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
