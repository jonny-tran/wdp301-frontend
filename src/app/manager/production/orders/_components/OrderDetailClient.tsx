"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useProduction } from "@/hooks/useProduction";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import type { ProductionOrderDetail, ProductionOrderStatus } from "@/types/production";
import { isOrderCompletedStatus } from "@/lib/production-mapper";

function statusBadgeClass(s: ProductionOrderStatus): string {
    const u = String(s).toUpperCase();
    switch (u) {
        case "PENDING":
            return "bg-slate-100 text-slate-700 border-slate-200";
        case "IN_PROGRESS":
            return "bg-blue-50 text-blue-800 border-blue-200";
        case "COMPLETED":
            return "bg-emerald-50 text-emerald-800 border-emerald-200";
        case "CANCELLED":
            return "bg-red-50 text-red-800 border-red-200";
        default:
            return "bg-slate-50 text-slate-600 border-slate-200";
    }
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

export default function OrderDetailClient({ orderId }: { orderId: string }) {
    const { productionOrderDetail } = useProduction();
    const q = productionOrderDetail(orderId);
    const o = q.data;

    const variance = useMemo(() => {
        if (!o) return null;
        const planned = o.targetQuantity;
        const actual = o.actualQuantity;
        if (actual == null || !isOrderCompletedStatus(o.status)) return null;
        return actual - planned;
    }, [o]);

    const wasteReason = useMemo(() => (o ? pickWasteReason(o) : null), [o]);

    if (q.isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    if (q.isError || !o) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-12 text-center text-slate-600">
                <p>Không tải được chi tiết lệnh.</p>
                <Button variant="outline" className="mt-4" asChild>
                    <Link href="/manager/production/orders">Quay lại danh sách</Link>
                </Button>
            </div>
        );
    }

    const inProgress = String(o.status).toUpperCase() === "IN_PROGRESS";
    const showReservations = inProgress && o.reservations.length > 0;
    const showOutput = isOrderCompletedStatus(o.status);

    return (
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="shrink-0" asChild>
                    <Link href="/manager/production/orders" aria-label="Quay lại">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 truncate">
                        Lệnh {o.orderCode || o.id.slice(0, 14)}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {o.recipeName || o.productName} · Kế hoạch {o.targetQuantity} {o.unit}
                    </p>
                </div>
                <Badge className={`border shrink-0 ${statusBadgeClass(o.status)}`}>
                    {String(o.status).toUpperCase()}
                </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[11px] font-bold uppercase text-slate-500">Nhân viên phụ trách</p>
                    <p className="text-lg font-semibold text-slate-900 mt-1">
                        {o.staffName?.trim() ? o.staffName : "—"}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-[11px] font-bold uppercase text-slate-500">Số lượng thực tế</p>
                    <p className="text-lg font-semibold text-slate-900 mt-1">
                        {o.actualQuantity != null ? `${o.actualQuantity} ${o.unit}` : "—"}
                    </p>
                </div>
            </div>

            {variance != null && variance < 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50/80 p-4">
                    <p className="text-sm font-semibold text-red-900">Hao hụt so với kế hoạch</p>
                    <p className="text-2xl font-black text-red-600 tabular-nums mt-1">{variance}</p>
                    {wasteReason ? (
                        <p className="text-sm text-red-800 mt-2">
                            <span className="font-medium">Lý do: </span>
                            {wasteReason}
                        </p>
                    ) : (
                        <p className="text-xs text-red-700/80 mt-2">
                            (Chưa có lý do trong nhật ký giao dịch — kiểm tra API{" "}
                            <code className="text-[11px]">inventoryTransactions</code>)
                        </p>
                    )}
                </div>
            )}

            {variance != null && variance > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
                    Dư thực tế so với kế hoạch: <strong className="tabular-nums">+{variance}</strong> {o.unit}
                </div>
            )}

            {showReservations && (
                <section className="space-y-2">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                        Lô nguyên liệu tạm giữ (FEFO)
                    </h2>
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead className="text-xs">Mã lô</TableHead>
                                    <TableHead className="text-xs">SL giữ</TableHead>
                                    <TableHead className="text-xs">HSD</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {o.reservations.map((r, i) => (
                                    <TableRow key={`${r.batchCode}-${i}`}>
                                        <TableCell className="font-mono text-sm">
                                            {r.batchCode ?? r.batchId ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-sm tabular-nums">
                                            {r.reservedQuantity ?? r.quantity ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600">
                                            {r.expiryDate ? new Date(r.expiryDate).toLocaleDateString("vi-VN") : "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            )}

            {showOutput && (
                <section className="space-y-2">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                        Lô thành phẩm tạo ra
                    </h2>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                        <p className="text-sm text-slate-700">
                            Mã lô:{" "}
                            <strong className="font-mono text-slate-900">
                                {o.outputBatchCode || "—"}
                            </strong>
                        </p>
                        <p className="text-sm text-slate-600 mt-2">
                            Hạn sử dụng:{" "}
                            <strong>
                                {o.outputExpiryDate
                                    ? new Date(o.outputExpiryDate).toLocaleString("vi-VN")
                                    : "—"}
                            </strong>
                        </p>
                    </div>
                </section>
            )}

            {o.lineage.length > 0 && (
                <section className="space-y-2">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Gia phả lô (lineage)</h2>
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead className="text-xs">Lô nguồn</TableHead>
                                    <TableHead className="text-xs">Lô đích</TableHead>
                                    <TableHead className="text-xs w-[100px]">Tiêu hao</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {o.lineage.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-mono text-sm">
                                            {row.parentBatchCode ?? row.parentBatchId ?? "—"}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {row.childBatchCode ?? row.childBatchId ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-sm tabular-nums">
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
                <section className="space-y-2">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                        Nhật ký giao dịch kho
                    </h2>
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm max-h-64 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/80">
                                    <TableHead className="text-xs">Loại</TableHead>
                                    <TableHead className="text-xs">SL</TableHead>
                                    <TableHead className="text-xs">Ghi chú / lý do</TableHead>
                                    <TableHead className="text-xs">Thời điểm</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {o.inventoryTransactions.map((t, i) => (
                                    <TableRow key={t.id ?? i}>
                                        <TableCell className="text-xs font-mono">{t.type ?? "—"}</TableCell>
                                        <TableCell className="text-sm tabular-nums">{t.quantity ?? "—"}</TableCell>
                                        <TableCell className="text-sm text-slate-700">
                                            {t.wasteReason || t.note || "—"}
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                                            {t.createdAt
                                                ? new Date(t.createdAt).toLocaleString("vi-VN")
                                                : "—"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            )}
        </div>
    );
}
