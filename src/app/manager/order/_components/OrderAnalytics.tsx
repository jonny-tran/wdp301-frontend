"use client";

import {
  ClockIcon,
  CheckBadgeIcon,
  TruckIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { OrderAnalyticsStats } from "./order.types";

export default function OrderAnalytics({
  data,
}: {
  data: OrderAnalyticsStats;
}) {
  const cards = [
    {
      label: "Tỉ lệ hoàn tất",
      value: `${data.fillRate}%`,
      sub: "Fill Rate",
      icon: CheckBadgeIcon,
      color: "text-green-600",
    },
    {
      label: "Duyệt đơn (Avg)",
      value: `${data.avgReview}h`,
      sub: "Review Time",
      icon: DocumentMagnifyingGlassIcon,
      color: "text-blue-600",
    },
    {
      label: "Nhặt hàng (Avg)",
      value: `${data.avgPicking}h`,
      sub: "Picking Time",
      icon: ClockIcon,
      color: "text-orange-600",
    },
    {
      label: "Giao hàng (Avg)",
      value: `${data.avgDelivery}h`,
      sub: "Delivery Time",
      icon: TruckIcon,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]"
        >
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0">
            <card.icon className={`h-6 w-6 ${card.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              {card.sub}
            </p>
            <p className="text-xl font-black text-slate-950 italic tracking-tighter leading-none mt-1">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
