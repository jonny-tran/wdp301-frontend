import Link from "next/link";

interface DashboardKpiCardProps {
    label: string;
    value: number;
    href: string;
}

export default function DashboardKpiCard({ label, value, href }: DashboardKpiCardProps) {
    return (
        <Link href={href} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-primary/40">
            <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted">{label}</p>
            <p className="mt-2 text-3xl font-black text-text-main">{value}</p>
            <p className="mt-2 text-xs font-semibold text-primary">View details</p>
        </Link>
    );
}
