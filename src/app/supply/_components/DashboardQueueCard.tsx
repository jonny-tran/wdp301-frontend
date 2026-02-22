import Link from "next/link";
import { formatDate, formatStatusLabel, getStatusBadgeClass } from "./format";

interface DashboardQueueCardProps {
    title: string;
    rowLabel: string;
    href: string;
    isLoading: boolean;
    isError: boolean;
    emptyMessage: string;
    loadingMessage: string;
    errorMessage: string;
    items: Record<string, unknown>[];
    renderSecondaryLine: (item: Record<string, unknown>) => string;
    renderDateLine: (item: Record<string, unknown>) => string;
    dateKey: string;
}

export default function DashboardQueueCard({
    title,
    rowLabel,
    href,
    isLoading,
    isError,
    emptyMessage,
    loadingMessage,
    errorMessage,
    items,
    renderSecondaryLine,
    renderDateLine,
    dateKey,
}: DashboardQueueCardProps) {
    return (
        <article className="rounded-2xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">{title}</h3>
                <Link href={href} className="text-xs font-semibold text-primary hover:underline">Open page</Link>
            </div>

            {isLoading ? (
                <p className="text-sm text-text-muted">{loadingMessage}</p>
            ) : isError ? (
                <p className="text-sm text-red-500">{errorMessage}</p>
            ) : items.length === 0 ? (
                <p className="text-sm text-text-muted">{emptyMessage}</p>
            ) : (
                <div className="space-y-2">
                    {items.slice(0, 5).map((item, index) => (
                        <div key={`${title}-${index}`} className="rounded-xl border border-gray-100 p-3">
                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-bold text-text-main">{rowLabel} #{index + 1}</p>
                                <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getStatusBadgeClass(String(item.status ?? ""))}`}>
                                    {formatStatusLabel(String(item.status ?? ""))}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-text-muted">{renderSecondaryLine(item)}</p>
                            <p className="text-xs text-text-muted">{renderDateLine(item)}: {formatDate((item[dateKey] as string | undefined) ?? undefined)}</p>
                        </div>
                    ))}
                </div>
            )}
        </article>
    );
}
