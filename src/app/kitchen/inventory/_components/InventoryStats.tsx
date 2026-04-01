"use client";

import { AlertTriangle, Boxes, CalendarClock, PackageX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
            tone: "text-sky-600 bg-sky-50 border-sky-100",
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
            tone: "text-amber-700 bg-amber-50 border-amber-100",
        },
        {
            label: "Hết hàng",
            value: outOfStockSkus.toLocaleString("vi-VN"),
            sub: "SKU có tồn vật lý = 0",
            icon: PackageX,
            tone: "text-rose-700 bg-rose-50 border-rose-100",
        },
    ];

    return (
        <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
            {cards.map((c) => (
                <Card key={c.label} className="overflow-hidden border-slate-200/80 shadow-sm">
                    <CardContent className="flex gap-4 p-5">
                        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl border", c.tone)}>
                            <c.icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{c.label}</p>
                            <p className="mt-1 text-2xl font-black tabular-nums tracking-tight text-slate-900">{c.value}</p>
                            <p className="mt-1 flex items-start gap-1 text-[11px] leading-snug text-slate-500">
                                {c.label === "Hết hàng" && outOfStockSkus > 0 && (
                                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-rose-500" />
                                )}
                                {c.sub}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
