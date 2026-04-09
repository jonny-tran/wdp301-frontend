"use client";

import { ReceiptStatus } from "@/utils/enum";
import { cn } from "@/lib/utils";

type InboundStatusBadgeProps = {
    status: ReceiptStatus | string;
    className?: string;
};

export default function InboundStatusBadge({ status, className }: InboundStatusBadgeProps) {
    const u = String(status ?? "").toLowerCase();
    const isDraft = u === ReceiptStatus.DRAFT || u === "draft";
    const isCompleted = u === ReceiptStatus.COMPLETED || u === "completed";
    const isCancelled = u === ReceiptStatus.CANCELLED || u === "cancelled";

    const label = isDraft ? "Nháp" : isCompleted ? "Hoàn tất" : isCancelled ? "Đã hủy" : String(status).toUpperCase();

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md border-2 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
                isDraft && "border-amber-700 bg-amber-400 text-zinc-950 shadow-sm",
                isCompleted && "border-emerald-800 bg-emerald-600 text-white",
                isCancelled && "border-zinc-600 bg-zinc-300 text-zinc-900",
                !isDraft && !isCompleted && !isCancelled && "border-zinc-500 bg-zinc-200 text-zinc-900",
                className,
            )}
        >
            {label}
        </span>
    );
}
