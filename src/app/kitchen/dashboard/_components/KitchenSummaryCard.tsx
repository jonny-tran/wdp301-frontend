import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KitchenSummaryCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    hint: string;
    /** Nổi bật cho số liệu vận hành (bếp) */
    emphasis?: boolean;
    className?: string;
}

export default function KitchenSummaryCard({
    icon,
    title,
    value,
    hint,
    emphasis,
    className,
}: KitchenSummaryCardProps) {
    return (
        <div
            className={cn(
                "rounded-3xl border border-gray-100 bg-white p-5 shadow-sm",
                emphasis && "ring-2 ring-amber-400/40",
                className,
            )}
        >
            <div className="mb-3 inline-flex rounded-xl bg-gray-50 p-2 text-primary">{icon}</div>
            <p className={cn("font-black text-text-main", emphasis ? "text-3xl tracking-tight" : "text-2xl")}>{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</p>
            <p className="mt-1 text-xs text-text-muted">{hint}</p>
        </div>
    );
}
