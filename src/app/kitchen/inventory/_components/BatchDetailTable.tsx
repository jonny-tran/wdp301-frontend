"use client";

import { compareAsc, differenceInCalendarDays, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { KitchenBatchRow } from "@/types/inventory";

function parseExpiryDay(expiryDate: string): Date | null {
    try {
        const s = expiryDate.includes("T") ? expiryDate : `${expiryDate}T00:00:00`;
        return parseISO(s);
    } catch {
        return null;
    }
}

export function batchExpiryDaysUntil(expiryDate: string): number | null {
    const d = parseExpiryDay(expiryDate);
    if (!d) return null;
    return differenceInCalendarDays(d, new Date());
}

export type BatchExpiryUiStatus = "good" | "near" | "expired";

export function batchExpiryUiStatus(expiryDate: string): BatchExpiryUiStatus {
    const days = batchExpiryDaysUntil(expiryDate);
    if (days === null) return "good";
    if (days < 0) return "expired";
    if (days < 7) return "near";
    return "good";
}

/** Thanh 0–100%: còn nhiều ngày → xanh, sắp hết hạn → đỏ (chuẩn 30 ngày). */
export function batchFreshnessPercent(expiryDate: string): number {
    const days = batchExpiryDaysUntil(expiryDate);
    if (days === null) return 70;
    if (days < 0) return 0;
    return Math.min(100, Math.round((days / 30) * 100));
}

function FreshnessBar({ expiryDate }: { expiryDate: string }) {
    const pct = batchFreshnessPercent(expiryDate);
    const barColor =
        pct >= 70 ? "bg-emerald-500" : pct >= 35 ? "bg-amber-500" : pct > 0 ? "bg-orange-600" : "bg-red-600";
    return (
        <div className="mt-1 w-full max-w-[140px]">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                    className={cn("h-full rounded-full transition-all", barColor)}
                    style={{ width: `${pct}%` }}
                    title={`Độ "tươi" ước lượng: ${pct}%`}
                />
            </div>
            <p className="mt-0.5 text-[9px] text-zinc-400">Còn HSD (tương đối)</p>
        </div>
    );
}

function sortBatchesFefo(batches: KitchenBatchRow[]): KitchenBatchRow[] {
    return [...batches].sort((a, b) => {
        const da = parseExpiryDay(a.expiryDate);
        const db = parseExpiryDay(b.expiryDate);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return compareAsc(da, db);
    });
}

interface BatchDetailTableProps {
    batches: KitchenBatchRow[];
    isLoading: boolean;
    isError: boolean;
    unit: string;
    onAdjust: (batch: KitchenBatchRow) => void;
    onWaste?: (batch: KitchenBatchRow) => void;
}

export default function BatchDetailTable({ batches, isLoading, isError, unit, onAdjust, onWaste }: BatchDetailTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-8 pl-14 text-sm text-zinc-500">
                <Loader2 className="size-4 animate-spin" />
                Đang tải chi tiết lô (FEFO)…
            </div>
        );
    }

    if (isError) {
        return <p className="py-6 pl-14 text-sm text-red-600">Không tải được chi tiết lô.</p>;
    }

    const sorted = sortBatchesFefo(batches);

    if (sorted.length === 0) {
        return <p className="py-6 pl-14 text-sm text-zinc-500">Chưa có lô nào cho sản phẩm này.</p>;
    }

    return (
        <div className="border-t border-zinc-100 bg-zinc-50/60 px-4 py-3 sm:px-8">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                Chi tiết lô — sắp xếp FEFO (HSD tăng dần)
            </p>
            <Table className="text-xs">
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-zinc-700">Mã lô</TableHead>
                        <TableHead className="min-w-[120px] font-semibold text-zinc-700">Nguồn (lineage)</TableHead>
                        <TableHead className="font-semibold text-zinc-700">HSD</TableHead>
                        <TableHead className="min-w-[100px] font-semibold text-zinc-700">Độ tươi</TableHead>
                        <TableHead className="text-right font-semibold text-zinc-700">Vật lý</TableHead>
                        <TableHead className="text-right font-semibold text-zinc-700">Khả dụng</TableHead>
                        <TableHead className="text-right font-semibold text-zinc-700">Đặt trước</TableHead>
                        <TableHead className="font-semibold text-zinc-700">Trạng thái</TableHead>
                        <TableHead className="min-w-[160px] text-right font-semibold text-zinc-700">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sorted.map((batch) => {
                        const st = batchExpiryUiStatus(batch.expiryDate);
                        const days = batchExpiryDaysUntil(batch.expiryDate);
                        const expired = st === "expired";
                        const nearExpiry = st === "near";
                        const fmt =
                            parseExpiryDay(batch.expiryDate)?.toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            }) ?? batch.expiryDate;

                        return (
                            <TableRow
                                key={batch.batchId}
                                className={cn(
                                    "transition-colors",
                                    expired && "bg-red-50 hover:bg-red-100/80",
                                    nearExpiry && "bg-red-50 hover:bg-red-100/80",
                                    !expired && !nearExpiry && "bg-white/80 hover:bg-zinc-100/80",
                                )}
                            >
                                {/* Batch Code — bold */}
                                <TableCell className="font-mono font-semibold text-zinc-900">
                                    {batch.batchCode || "—"}
                                </TableCell>

                                <TableCell className="font-mono text-xs text-zinc-600 break-all">
                                    {batch.parentBatchCode ?? (batch.parentBatchId != null ? `#${batch.parentBatchId}` : "—")}
                                </TableCell>

                                {/* Expiry Date — FEFO alarm styling */}
                                <TableCell
                                    className={cn(
                                        "font-medium",
                                        expired && "text-red-700",
                                        nearExpiry && !expired && "text-red-600",
                                        !expired && !nearExpiry && "text-zinc-500",
                                    )}
                                >
                                    {fmt}
                                    {days !== null && (
                                        <span
                                            className={cn(
                                                "ml-1 text-[10px]",
                                                expired || nearExpiry ? "text-red-500" : "text-zinc-400",
                                            )}
                                        >
                                            ({days < 0 ? "quá hạn" : `còn ${days} ngày`})
                                        </span>
                                    )}
                                </TableCell>

                                {/* Freshness Bar */}
                                <TableCell className="align-top">
                                    <FreshnessBar expiryDate={batch.expiryDate} />
                                </TableCell>

                                {/* Quantities — text-right tabular-nums */}
                                <TableCell className="text-right tabular-nums text-zinc-700">
                                    {batch.totalQuantity} {unit}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-emerald-700">
                                    {batch.availableQuantity} {unit}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-zinc-500">
                                    {batch.reservedQuantity} {unit}
                                </TableCell>

                                {/* Status Badge */}
                                <TableCell>
                                    {st === "expired" && (
                                        <Badge variant="destructive" className="text-[10px]">
                                            Hết hạn
                                        </Badge>
                                    )}
                                    {st === "near" && (
                                        <Badge
                                            variant="secondary"
                                            className="border-red-200 bg-red-50 text-[10px] text-red-700"
                                        >
                                            Sắp hết hạn
                                        </Badge>
                                    )}
                                    {st === "good" && (
                                        <Badge variant="outline" className="border-emerald-200 text-[10px] text-emerald-800">
                                            Tốt
                                        </Badge>
                                    )}
                                </TableCell>

                                {/* Action */}
                                <TableCell className="text-right">
                                    <div className="flex flex-wrap justify-end gap-1">
                                        {onWaste && (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="h-7 border-red-200 bg-red-50 text-[10px] text-red-700 hover:bg-red-100"
                                                onClick={() => onWaste(batch)}
                                            >
                                                Báo hủy
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[10px]"
                                            onClick={() => onAdjust(batch)}
                                        >
                                            Điều chỉnh
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
