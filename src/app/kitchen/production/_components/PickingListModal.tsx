"use client";

import { compareAsc, parseISO } from "date-fns";
import { ClipboardList, Loader2, Package } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useProduction } from "@/hooks/useProduction";
import { resolveReservationIngredientName } from "@/lib/production-mapper";
import type { ProductionReservation } from "@/types/production";

function parseExp(s: string | undefined): Date | null {
    if (!s) return null;
    try {
        const x = s.includes("T") ? s : `${s}T00:00:00`;
        return parseISO(x);
    } catch {
        return null;
    }
}

function sortReservationsFefo(rows: ProductionReservation[]): ProductionReservation[] {
    return [...rows].sort((a, b) => {
        const da = parseExp(a.expiryDate);
        const db = parseExp(b.expiryDate);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return compareAsc(da, db);
    });
}

type PickingListModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: string | null;
    productName?: string;
};

export default function PickingListModal({ open, onOpenChange, orderId, productName }: PickingListModalProps) {
    const { productionOrderDetail } = useProduction();
    const detailQuery = productionOrderDetail(orderId, { enabled: open && !!orderId });
    const detail = detailQuery.data;

    const sorted = useMemo(() => sortReservationsFefo(detail?.reservations ?? []), [detail?.reservations]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto border-2 border-zinc-800 bg-white text-zinc-950 sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
                        <ClipboardList className="size-6 text-amber-600" aria-hidden />
                        Bước 1 — Lấy nguyên liệu (FEFO)
                    </DialogTitle>
                    <DialogDescription className="text-base text-zinc-600">
                        {productName ?? detail?.productName ?? "Lệnh sản xuất"} — lấy đúng lô theo thứ tự HSD.
                    </DialogDescription>
                </DialogHeader>

                {detailQuery.isLoading ? (
                    <div className="flex items-center gap-2 py-10 text-zinc-600">
                        <Loader2 className="size-8 animate-spin" />
                        <span className="text-lg font-semibold">Đang tải danh sách lô đã giữ…</span>
                    </div>
                ) : sorted.length === 0 ? (
                    <p className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 py-8 text-center text-zinc-600">
                        Chưa có dòng reservation — kiểm tra lại API sau khi Start.
                    </p>
                ) : (
                    <ol className="space-y-3">
                        {sorted.map((row, i) => {
                            const ingredientName =
                                detail != null
                                    ? resolveReservationIngredientName(row, detail)
                                    : (row.productName ?? null);
                            const exp = row.expiryDate
                                ? parseExp(row.expiryDate)?.toLocaleDateString("vi-VN", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                  })
                                : "—";
                            const qty = row.reservedQuantity ?? row.quantity ?? 0;
                            return (
                                <li
                                    key={`${row.batchId ?? row.batchCode ?? i}`}
                                    className="flex gap-3 rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4"
                                >
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-lg font-black text-white">
                                        {i + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="flex items-center gap-2 font-bold text-zinc-950">
                                            <Package className="size-4 text-amber-600" aria-hidden />
                                            {ingredientName !== "—" ? ingredientName : "Nguyên liệu"}
                                        </p>
                                        <p className="mt-1 font-mono text-sm text-zinc-700">
                                            Lô: <strong>{row.batchCode ?? `#${row.batchId}`}</strong>
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-600">
                                            HSD: <span className="font-semibold text-red-700">{exp}</span>
                                            {row.expiryDate && (
                                                <span className="ml-2 text-xs text-zinc-400">
                                                    (
                                                    {parseExp(row.expiryDate)?.toLocaleDateString("vi-VN", {
                                                        weekday: "short",
                                                    })}
                                                    )
                                                </span>
                                            )}
                                        </p>
                                        <p className="mt-2 text-lg font-black tabular-nums text-zinc-900">
                                            Lấy: {qty}{" "}
                                            <span className="text-sm font-bold text-zinc-500">(đã reserve)</span>
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        className="h-12 min-w-full border-2 border-amber-500 bg-zinc-900 text-base font-bold text-white hover:bg-zinc-800 sm:min-w-[200px]"
                        onClick={() => onOpenChange(false)}
                    >
                        Đã rõ — sang bước sản xuất
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
