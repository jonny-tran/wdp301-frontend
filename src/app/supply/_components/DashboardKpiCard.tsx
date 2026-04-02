import Link from "next/link";
import { ReactNode } from "react";

interface DashboardKpiCardProps {
    label: string;
    value: number | string;
    href: string;
    icon?: ReactNode;
    accentColor?: "amber" | "blue" | "red" | "green" | "violet";
    subtitle?: string;
}

const ACCENT_MAP: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
    amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200/60", iconBg: "bg-amber-100 text-amber-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/60", iconBg: "bg-blue-100 text-blue-600" },
    red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200/60", iconBg: "bg-red-100 text-red-600" },
    green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200/60", iconBg: "bg-green-100 text-green-600" },
    violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200/60", iconBg: "bg-violet-100 text-violet-600" },
};

export default function DashboardKpiCard({ label, value, href, icon, accentColor = "blue", subtitle }: DashboardKpiCardProps) {
    const accent = ACCENT_MAP[accentColor] ?? ACCENT_MAP.blue;

    return (
        <Link
            href={href}
            className={`group relative overflow-hidden rounded-2xl border ${accent.border} bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
        >
            {/* Gradient accent bar */}
            <div className={`absolute left-0 top-0 h-1 w-full ${accent.bg}`} />

            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{label}</p>
                    <p className={`mt-2 text-3xl font-black tabular-nums ${accent.text}`}>{value}</p>
                    {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
                </div>
                {icon && (
                    <div className={`rounded-xl p-2.5 ${accent.iconBg} transition-transform group-hover:scale-110`}>
                        {icon}
                    </div>
                )}
            </div>

            <p className={`mt-3 text-xs font-semibold ${accent.text} group-hover:underline`}>Xem chi tiết →</p>
        </Link>
    );
}
