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
    /** Optional: show a progress bar (picked/total) */
    progress?: { current: number; total: number } | null;
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
    progress,
}: DashboardQueueCardProps) {
    const progressPercent = progress && progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : null;

    return (
        <article className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">{title}</h3>
                <Link href={href} className="text-xs font-semibold text-primary hover:underline">Mở trang →</Link>
            </div>

            {/* Progress Bar */}
            {progressPercent !== null && (
                <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
                        <span>Tiến độ soạn hàng</span>
                        <span className="font-bold text-text-main">{progress!.current}/{progress!.total} ({progressPercent}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                progressPercent >= 100 ? "bg-green-500" : progressPercent >= 60 ? "bg-blue-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center gap-2 py-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-text-muted">{loadingMessage}</p>
                </div>
            ) : isError ? (
                <p className="text-sm text-red-500 py-2">{errorMessage}</p>
            ) : items.length === 0 ? (
                <div className="rounded-xl bg-gray-50 py-6 text-center">
                    <p className="text-sm text-text-muted">{emptyMessage}</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.slice(0, 5).map((item, index) => (
                        <div key={`${title}-${index}`} className="rounded-xl border border-gray-100 p-3 transition hover:border-primary/20 hover:bg-gray-50/50">
                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-bold text-text-main">{rowLabel} #{index + 1}</p>
                                <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusBadgeClass(String(item.status ?? ""))}`}>
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
