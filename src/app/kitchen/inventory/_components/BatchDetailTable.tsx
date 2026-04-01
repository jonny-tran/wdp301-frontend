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
}

export default function BatchDetailTable({ batches, isLoading, isError, unit, onAdjust }: BatchDetailTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-8 pl-14 text-sm text-slate-500">
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
        return <p className="py-6 pl-14 text-sm text-slate-500">Chưa có lô nào cho sản phẩm này.</p>;
    }

    return (
        <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Chi tiết lô — sắp xếp FEFO (HSD tăng dần)
            </p>
            <Table className="text-xs">
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Mã lô</TableHead>
                        <TableHead>HSD</TableHead>
                        <TableHead className="text-right">Vật lý</TableHead>
                        <TableHead className="text-right">Khả dụng</TableHead>
                        <TableHead className="text-right">Đặt trước</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right w-[100px]">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sorted.map((batch) => {
                        const st = batchExpiryUiStatus(batch.expiryDate);
                        const days = batchExpiryDaysUntil(batch.expiryDate);
                        const expired = st === "expired";
                        const fmt =
                            parseExpiryDay(batch.expiryDate)?.toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            }) ?? batch.expiryDate;

                        return (
                            <TableRow key={batch.batchId} className="bg-white/80">
                                <TableCell className="font-mono font-semibold">{batch.batchCode || "—"}</TableCell>
                                <TableCell
                                    className={cn(
                                        "font-medium",
                                        expired && "text-red-600",
                                        st === "near" && !expired && "text-amber-700",
                                    )}
                                >
                                    {fmt}
                                    {days !== null && (
                                        <span className="ml-1 text-[10px] text-slate-400">
                                            ({days < 0 ? "quá hạn" : `còn ${days} ngày`})
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {batch.totalQuantity} {unit}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-emerald-700">
                                    {batch.availableQuantity} {unit}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-amber-700/90">
                                    {batch.reservedQuantity} {unit}
                                </TableCell>
                                <TableCell>
                                    {st === "expired" && (
                                        <Badge variant="destructive" className="text-[10px]">
                                            Hết hạn
                                        </Badge>
                                    )}
                                    {st === "near" && (
                                        <Badge
                                            variant="secondary"
                                            className="border-amber-200 bg-amber-50 text-[10px] text-amber-900"
                                        >
                                            Sắp hết hạn
                                        </Badge>
                                    )}
                                    {st === "good" && (
                                        <Badge variant="outline" className="text-[10px] text-emerald-800 border-emerald-200">
                                            Tốt
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => onAdjust(batch)}>
                                        Điều chỉnh
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
