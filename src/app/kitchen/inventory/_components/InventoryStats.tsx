"use client";

import { AlertTriangle, Boxes, CalendarClock, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryStatsProps {
    totalSkus: number;
    nearExpiryBatches: number | null;
    nearExpiryLoading?: boolean;
    nearExpiryUnavailable?: boolean;
    outOfStockSkus: number;
    className?: string;
}

export default function InventoryStats({
    totalSkus,
    nearExpiryBatches,
    nearExpiryLoading,
    nearExpiryUnavailable,
    outOfStockSkus,
    className,
}: InventoryStatsProps) {
    const cards = [
        {
            label: "Tổng SKU",
            value: totalSkus.toLocaleString("vi-VN"),
            sub: "Sản phẩm trong danh sách tồn kho bếp",
            icon: Boxes,
            iconWrap: "bg-sky-100 text-sky-600",
        },
        {
            label: "Lô sắp hết hạn",
            value:
                nearExpiryUnavailable || nearExpiryLoading
                    ? nearExpiryLoading
                        ? "…"
                        : "—"
                    : (nearExpiryBatches ?? 0).toLocaleString("vi-VN"),
            sub: nearExpiryUnavailable
                ? "Không tải được báo cáo aging (kiểm tra quyền API)"
                : "HSD dưới 7 ngày (theo báo cáo aging)",
            icon: CalendarClock,
            iconWrap: "bg-amber-100 text-amber-600",
        },
        {
            label: "Hết hàng",
            value: outOfStockSkus.toLocaleString("vi-VN"),
            sub: "SKU có tồn vật lý = 0",
            icon: PackageX,
            iconWrap: "bg-rose-100 text-rose-600",
        },
    ];

    return (
        <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
            {cards.map((c) => (
                <div
                    key={c.label}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-start gap-4">
                        {/* Icon wrapper with soft rounded background */}
                        <div
                            className={cn(
                                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                                c.iconWrap,
                            )}
                        >
                            <c.icon className="size-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-zinc-500">{c.label}</p>
                            <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-zinc-900">
                                {c.value}
                            </p>
                            <p className="mt-1 flex items-start gap-1 text-xs leading-snug text-zinc-500">
                                {c.label === "Hết hàng" && outOfStockSkus > 0 && (
                                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
                                )}
                                {c.sub}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
