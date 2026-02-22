import type { ReactNode } from "react";

interface KitchenSummaryCardProps {
    icon: ReactNode;
    title: string;
    value: string;
    hint: string;
}

export default function KitchenSummaryCard({
    icon,
    title,
    value,
    hint,
}: KitchenSummaryCardProps) {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex rounded-xl bg-gray-50 p-2 text-primary">{icon}</div>
            <p className="text-2xl font-black text-text-main">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</p>
            <p className="mt-1 text-xs text-text-muted">{hint}</p>
        </div>
    );
}
