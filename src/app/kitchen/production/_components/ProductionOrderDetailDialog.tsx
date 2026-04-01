"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ClipboardList, Loader2, Package, X } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useProduction } from "@/hooks/useProduction";
import {
    isOrderCompletedStatus,
    resolveInventoryTxQuantityLabel,
    resolveReservationIngredientName,
} from "@/lib/production-mapper";
import type { ProductionOrderDetail, ProductionOrderStatus } from "@/types/production";
import { cn } from "@/lib/utils";

function badgeForStatus(status: ProductionOrderStatus) {
    const u = String(status).toUpperCase();
    if (u === "COMPLETED") return { label: "COMPLETED", className: "bg-emerald-500 text-zinc-950 border-transparent font-black" };
    if (u === "IN_PROGRESS")
        return { label: "IN_PROGRESS", className: "bg-amber-400 text-zinc-950 border-transparent font-black" };
    if (u === "CANCELLED") return { label: "CANCELLED", className: "bg-zinc-400 text-zinc-950 border-transparent" };
    return { label: "PENDING", className: "bg-zinc-200 text-zinc-900 border-zinc-400" };
}

function pickWasteReason(order: ProductionOrderDetail): string | null {
    const txs = order.inventoryTransactions ?? [];
    for (const t of txs) {
        const type = String(t.type ?? "").toUpperCase();
        const reason = t.wasteReason?.trim() || t.note?.trim();
        if (reason) return reason;
        if (type.includes("LOSS") || type.includes("WASTE")) {
            return t.note?.trim() || type || null;
        }
    }
    return null;
}

function formatExp(s: string | undefined) {
    if (!s) return "—";
    try {
        return format(new Date(s.includes("T") ? s : `${s}T12:00:00`), "dd/MM/yyyy", { locale: vi });
    } catch {
        return s;
    }
}

function SectionTitle({ children, icon: Icon }: { children: ReactNode; icon?: typeof Package }) {
    return (
        <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
            {Icon && <Icon className="size-4 text-amber-600" aria-hidden />}
            {children}
        </h4>
    );
}

export type ProductionOrderDetailDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: string | null;
};

export default function ProductionOrderDetailDialog({ open, onOpenChange, orderId }: ProductionOrderDetailDialogProps) {
    const { productionOrderDetail } = useProduction();
    const q = productionOrderDetail(orderId, { enabled: open && !!orderId });
    const o = q.data;
    const statusUi = o ? badgeForStatus(o.status) : null;

    const variance = useMemo(() => {
        if (!o) return null;
        const planned = o.targetQuantity;
        const actual = o.actualQuantity;
        if (actual == null || !isOrderCompletedStatus(o.status)) return null;
        return actual - planned;
    }, [o]);

    const wasteReason = useMemo(() => (o ? pickWasteReason(o) : null), [o]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className={cn(
                    /* Không dùng `relative` — sẽ ghi đè `fixed` của Dialog và làm lệch/cắt khung */
                    "fixed left-1/2 top-4 z-50 flex w-[min(96vw,58rem)] max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden border-2 border-zinc-900 p-0",
                    "max-h-[calc(100dvh-2rem)] sm:top-6 sm:max-h-[calc(100dvh-3rem)]",
                    "-translate-x-1/2 translate-y-0",
                    "bg-zinc-50 text-zinc-950 shadow-[8px_8px_0_0_rgb(24_24_27)] sm:max-w-none sm:rounded-xl",
                )}
            >
                <div className="relative shrink-0 overflow-hidden border-b-2 border-zinc-900 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-6 pr-14 text-white">
                    <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-amber-500/15 blur-2xl" aria-hidden />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-3 z-50 size-10 rounded-lg border border-white/20 text-white hover:bg-white/10"
                        onClick={() => onOpenChange(false)}
                        aria-label="Đóng"
                    >
                        <X className="size-5" />
                    </Button>
                    <DialogHeader className="relative space-y-2 text-left">
                        <DialogTitle className="flex flex-wrap items-center gap-3 pr-8 text-xl font-black tracking-tight text-white sm:text-2xl">
                            <span className="flex size-11 items-center justify-center rounded-xl border-2 border-amber-400/40 bg-amber-500/20">
                                <ClipboardList className="size-6 text-amber-400" aria-hidden />
                            </span>
                            Chi tiết lệnh sản xuất
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-zinc-300">
                            FEFO, lô thành phẩm, gia phả lô và nhật ký kho — đầy đủ nội dung, không cắt chữ.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 py-5 sm:px-8 sm:py-6 [-webkit-overflow-scrolling:touch]">
                    {q.isLoading && (
                        <div className="flex items-center gap-3 py-20 text-zinc-700">
                            <Loader2 className="size-10 animate-spin text-amber-600" aria-hidden />
                            <span className="text-lg font-bold">Đang tải chi tiết…</span>
                        </div>
                    )}

                    {q.isError && (
                        <p className="rounded-xl border-2 border-red-300 bg-red-50 py-10 text-center text-base font-semibold text-red-800">
                            Không tải được chi tiết lệnh.
                        </p>
                    )}

                    {!q.isLoading && !q.isError && o && statusUi && (
                        <div className="space-y-6">
                            <div className="rounded-2xl border-2 border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700">
                                            {o.orderCode ?? `ID ${String(o.id).slice(0, 8)}…`}
                                        </p>
                                        <h3 className="mt-2 text-2xl font-black leading-tight text-zinc-950 sm:text-3xl">
                                            {o.productName}
                                        </h3>
                                        <p className="mt-3 text-base font-semibold leading-relaxed text-zinc-600">
                                            {o.recipeName && o.recipeName !== o.productName ? (
                                                <span className="text-zinc-800">{o.recipeName}</span>
                                            ) : null}
                                            {o.recipeName && o.recipeName !== o.productName ? <span className="mx-1 text-zinc-400">·</span> : null}
                                            <span>
                                                Kế hoạch{" "}
                                                <span className="tabular-nums text-zinc-900">
                                                    {o.targetQuantity} {o.unit}
                                                </span>
                                            </span>
                                            {o.actualQuantity != null && isOrderCompletedStatus(o.status) && (
                                                <span className="ml-2 text-emerald-700">
                                                    · Thực tế{" "}
                                                    <span className="font-bold tabular-nums">
                                                        {o.actualQuantity} {o.unit}
                                                    </span>
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <Badge
                                        className={cn(
                                            "shrink-0 px-4 py-2 text-xs font-black uppercase tracking-wide",
                                            statusUi.className,
                                        )}
                                    >
                                        {statusUi.label}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border-2 border-zinc-200 bg-white p-5 shadow-sm">
                                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Nhân viên</p>
                                    <p className="mt-2 text-xl font-bold text-zinc-950">{o.staffName?.trim() || "—"}</p>
                                </div>
                                <div className="rounded-2xl border-2 border-zinc-200 bg-white p-5 shadow-sm">
                                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Tạo lệnh</p>
                                    <p className="mt-2 text-xl font-bold tabular-nums text-zinc-950">
                                        {format(new Date(o.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                                    </p>
                                </div>
                            </div>

                            {variance != null && variance < 0 && (
                                <div className="rounded-2xl border-2 border-red-400 bg-red-50 p-5">
                                    <p className="text-sm font-black uppercase tracking-wide text-red-900">Hao hụt so với kế hoạch</p>
                                    <p className="mt-2 text-3xl font-black tabular-nums text-red-600">{variance}</p>
                                    {wasteReason && (
                                        <p className="mt-3 text-sm leading-relaxed text-red-900">
                                            <span className="font-bold">Lý do: </span>
                                            {wasteReason}
                                        </p>
                                    )}
                                </div>
                            )}

                            {variance != null && variance > 0 && (
                                <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 text-base font-semibold text-amber-950">
                                    Dư thực tế: <span className="font-black tabular-nums">+{variance}</span> {o.unit}
                                </div>
                            )}

                            {o.reservations.length > 0 && (
                                <section className="space-y-3">
                                    <SectionTitle icon={Package}>Lô nguyên liệu tạm giữ (FEFO)</SectionTitle>
                                    <div className="overflow-x-auto rounded-2xl border-2 border-zinc-900 bg-white shadow-sm">
                                        <Table className="min-w-[640px]">
                                            <TableHeader>
                                                <TableRow className="border-b-2 border-zinc-900 bg-zinc-900 hover:bg-zinc-900">
                                                    <TableHead className="min-w-[180px] py-3 text-xs font-bold text-white">
                                                        Nguyên liệu
                                                    </TableHead>
                                                    <TableHead className="min-w-[220px] py-3 text-xs font-bold text-white">
                                                        Mã lô
                                                    </TableHead>
                                                    <TableHead className="w-[100px] py-3 text-xs font-bold text-white">
                                                        SL giữ
                                                    </TableHead>
                                                    <TableHead className="w-[120px] py-3 text-xs font-bold text-white">HSD</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {o.reservations.map((r, i) => {
                                                    const name = resolveReservationIngredientName(r, o);
                                                    return (
                                                        <TableRow key={`${r.batchCode}-${i}`} className="border-zinc-100">
                                                            <TableCell className="py-3 align-top text-sm font-bold leading-snug text-zinc-950">
                                                                {name}
                                                            </TableCell>
                                                            <TableCell className="py-3 align-top font-mono text-sm font-medium leading-relaxed text-zinc-800 break-all">
                                                                {r.batchCode ?? (r.batchId != null ? `#${r.batchId}` : "—")}
                                                            </TableCell>
                                                            <TableCell className="py-3 align-top text-sm font-black tabular-nums text-zinc-900">
                                                                {r.reservedQuantity ?? r.quantity ?? "—"}
                                                            </TableCell>
                                                            <TableCell className="py-3 align-top text-sm font-semibold text-zinc-700">
                                                                {formatExp(r.expiryDate)}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </section>
                            )}

                            {isOrderCompletedStatus(o.status) && (o.outputBatchCode || o.outputExpiryDate) && (
                                <section className="space-y-3">
                                    <SectionTitle>Lô thành phẩm</SectionTitle>
                                    <div className="rounded-2xl border-2 border-emerald-600 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
                                        <p className="text-base text-zinc-800">
                                            Mã lô:{" "}
                                            <strong className="font-mono text-lg text-zinc-950">{o.outputBatchCode || "—"}</strong>
                                        </p>
                                        <p className="mt-3 text-base text-zinc-700">
                                            HSD: <strong className="tabular-nums">{formatExp(o.outputExpiryDate)}</strong>
                                        </p>
                                    </div>
                                </section>
                            )}

                            {o.lineage.length > 0 && (
                                <section className="space-y-3">
                                    <SectionTitle>Gia phả lô</SectionTitle>
                                    <div className="overflow-x-auto rounded-2xl border-2 border-zinc-200 bg-white shadow-sm">
                                        <Table className="min-w-[520px]">
                                            <TableHeader>
                                                <TableRow className="bg-zinc-100">
                                                    <TableHead className="text-xs font-bold">Lô nguồn</TableHead>
                                                    <TableHead className="text-xs font-bold">Lô đích</TableHead>
                                                    <TableHead className="w-[100px] text-xs font-bold">Tiêu hao</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {o.lineage.map((row, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="max-w-[200px] font-mono text-sm break-all">
                                                            {row.parentBatchCode ?? row.parentBatchId ?? "—"}
                                                        </TableCell>
                                                        <TableCell className="max-w-[200px] font-mono text-sm break-all">
                                                            {row.childBatchCode ?? row.childBatchId ?? "—"}
                                                        </TableCell>
                                                        <TableCell className="text-sm font-bold tabular-nums">
                                                            {row.consumedQuantity ?? "—"}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </section>
                            )}

                            {o.inventoryTransactions.length > 0 && (
                                <section className="space-y-3">
                                    <SectionTitle>Nhật ký kho</SectionTitle>
                                    <div className="overflow-x-auto rounded-2xl border-2 border-zinc-200 bg-white shadow-sm">
                                        <Table className="min-w-[720px] table-fixed">
                                            <TableHeader>
                                                <TableRow className="bg-zinc-100">
                                                    <TableHead className="w-[22%] text-xs font-bold">Loại</TableHead>
                                                    <TableHead className="w-[12%] text-xs font-bold">SL</TableHead>
                                                    <TableHead className="w-[46%] text-xs font-bold">Ghi chú</TableHead>
                                                    <TableHead className="w-[20%] text-xs font-bold">Thời điểm</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {o.inventoryTransactions.map((t, i) => {
                                                    const noteLine = [t.wasteReason?.trim(), t.note?.trim()]
                                                        .filter(Boolean)
                                                        .join(" — ");
                                                    return (
                                                        <TableRow key={t.id ?? i}>
                                                            <TableCell className="align-top font-mono text-xs leading-relaxed break-words text-zinc-800">
                                                                {t.type ?? "—"}
                                                            </TableCell>
                                                            <TableCell className="align-top text-sm font-black tabular-nums text-zinc-900">
                                                                {resolveInventoryTxQuantityLabel(t)}
                                                            </TableCell>
                                                            <TableCell className="align-top text-sm leading-relaxed text-zinc-800 break-words whitespace-normal">
                                                                {noteLine || "—"}
                                                            </TableCell>
                                                            <TableCell className="align-top whitespace-normal text-xs leading-relaxed text-zinc-500">
                                                                {t.createdAt
                                                                    ? format(new Date(t.createdAt), "dd/MM/yyyy HH:mm", {
                                                                          locale: vi,
                                                                      })
                                                                    : "—"}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex shrink-0 justify-end gap-2 border-t-2 border-zinc-200 bg-white px-5 py-4 sm:px-8">
                    <Button
                        type="button"
                        className="h-12 min-w-[140px] border-2 border-zinc-900 bg-zinc-900 font-bold text-white hover:bg-zinc-800"
                        onClick={() => onOpenChange(false)}
                    >
                        Đóng
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
