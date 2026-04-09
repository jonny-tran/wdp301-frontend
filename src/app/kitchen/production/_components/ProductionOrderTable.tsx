"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, Play, SquareCheck, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isOrderCompletedStatus, isOrderActiveStatus } from "@/lib/production-mapper";
import type { ProductionOrder, ProductionOrderStatus } from "@/types/production";
import { cn } from "@/lib/utils";

function badgeForStatus(status: ProductionOrderStatus) {
    const u = String(status).toUpperCase();
    if (u === "DRAFT") return { label: "DRAFT", className: "bg-slate-200 text-slate-900 border-slate-400" };
    if (u === "PENDING") return { label: "PENDING", className: "bg-violet-600 text-white border-transparent" };
    if (u === "COMPLETED") return { label: "COMPLETED", className: "bg-emerald-600 text-white border-transparent" };
    if (u === "IN_PROGRESS")
        return { label: "IN_PROGRESS", className: "bg-amber-500 text-zinc-950 border-transparent font-bold" };
    if (u === "CANCELLED") return { label: "CANCELLED", className: "bg-zinc-400 text-zinc-950 border-transparent" };
    return { label: u || "UNKNOWN", className: "bg-zinc-200 text-zinc-900 border-zinc-400" };
}

export type ProductionOrderTableProps = {
    orders: ProductionOrder[];
    isLoading: boolean;
    mode: "active" | "history";
    startingId: string | null;
    rejectingId: string | null;
    onStart: (id: string, productName: string) => void;
    onReject: (order: ProductionOrder) => void;
    onCompleteClick: (order: ProductionOrder) => void;
    /** Bấm vào dòng (trừ nút Start/Complete) để mở chi tiết */
    onDetailClick?: (order: ProductionOrder) => void;
};

export default function ProductionOrderTable({
    orders,
    isLoading,
    mode,
    startingId,
    rejectingId,
    onStart,
    onReject,
    onCompleteClick,
    onDetailClick,
}: ProductionOrderTableProps) {
    if (isLoading) {
        return (
            <div className="flex min-h-[280px] items-center justify-center gap-2 border-2 border-dashed border-zinc-300 bg-zinc-100/80">
                <Loader2 className="size-8 animate-spin text-zinc-600" aria-hidden />
                <span className="text-lg font-medium text-zinc-700">Đang tải lệnh sản xuất…</span>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex min-h-[220px] items-center justify-center border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-600">
                {mode === "active" ? "Không có lệnh active trong ngày." : "Chưa có lịch sử hoàn tất."}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border-2 border-zinc-800 bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="border-b-2 border-zinc-800 bg-zinc-900 hover:bg-zinc-900">
                        <TableHead className="min-w-[200px] text-base font-bold text-white">Sản phẩm</TableHead>
                        <TableHead className="text-base font-bold text-white">Trạng thái</TableHead>
                        <TableHead className="text-base font-bold text-white">Thời điểm tạo</TableHead>
                        <TableHead className="w-[200px] text-right text-base font-bold text-white">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((row) => {
                        const b = badgeForStatus(row.status);
                        const u = String(row.status).toUpperCase();
                        const canStart = mode === "active" && (u === "PENDING" || u === "DRAFT");
                        const canReject = mode === "active" && u === "PENDING";
                        const canComplete = mode === "active" && u === "IN_PROGRESS";
                        return (
                            <TableRow
                                key={row.id}
                                className={cn(
                                    "border-b border-zinc-200 text-base",
                                    onDetailClick && "cursor-pointer hover:bg-zinc-50",
                                )}
                                onClick={
                                    onDetailClick
                                        ? () => {
                                              onDetailClick(row);
                                          }
                                        : undefined
                                }
                                role={onDetailClick ? "button" : undefined}
                                tabIndex={onDetailClick ? 0 : undefined}
                                onKeyDown={
                                    onDetailClick
                                        ? (e) => {
                                              if (e.key === "Enter" || e.key === " ") {
                                                  e.preventDefault();
                                                  onDetailClick(row);
                                              }
                                          }
                                        : undefined
                                }
                            >
                                <TableCell>
                                    <div className="font-bold text-zinc-950">{row.productName}</div>
                                    <div className="mt-1 text-sm font-semibold text-zinc-600">
                                        Mục tiêu: {row.targetQuantity} {row.unit}
                                        {isOrderCompletedStatus(row.status) &&
                                            row.actualQuantity != null &&
                                            row.actualQuantity > 0 && (
                                                <span className="ml-2 text-emerald-700">
                                                    · Thực tế: {row.actualQuantity} {row.unit}
                                                </span>
                                            )}
                                    </div>
                                    {row.referenceId && (
                                        <div className="mt-1 text-xs font-medium text-violet-700">
                                            Yêu cầu từ đơn hàng: {row.referenceId}
                                        </div>
                                    )}
                                    {row.note?.trim() && (
                                        <div className="mt-1 text-xs text-zinc-500">Ghi chú: {row.note}</div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge className={cn("px-3 py-1 text-xs font-bold uppercase", b.className)}>
                                        {b.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-zinc-800">
                                    {format(new Date(row.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-wrap justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                        {canStart && (
                                            <Button
                                                type="button"
                                                size="lg"
                                                className="h-12 min-w-[120px] gap-2 border-2 border-amber-500 bg-zinc-900 font-bold text-white hover:bg-zinc-800"
                                                onClick={() => onStart(row.id, row.productName)}
                                                disabled={startingId !== null}
                                            >
                                                {startingId === row.id ? (
                                                    <Loader2 className="size-5 animate-spin" />
                                                ) : (
                                                    <Play className="size-5" />
                                                )}
                                                Start Production
                                            </Button>
                                        )}
                                        {canReject && (
                                            <Button
                                                type="button"
                                                size="lg"
                                                variant="outline"
                                                className="h-12 min-w-[120px] gap-2 border-2 border-red-300 font-bold text-red-700 hover:bg-red-50"
                                                onClick={() => onReject(row)}
                                                disabled={rejectingId !== null}
                                            >
                                                {rejectingId === row.id ? (
                                                    <Loader2 className="size-5 animate-spin" />
                                                ) : (
                                                    <XCircle className="size-5" />
                                                )}
                                                Từ chối
                                            </Button>
                                        )}
                                        {canComplete && (
                                            <Button
                                                type="button"
                                                size="lg"
                                                variant="outline"
                                                className="h-12 min-w-[140px] gap-2 border-2 border-emerald-600 font-bold text-emerald-800 hover:bg-emerald-50"
                                                onClick={() => onCompleteClick(row)}
                                            >
                                                <SquareCheck className="size-5" />
                                                Complete
                                            </Button>
                                        )}
                                        {mode === "active" && u === "COMPLETED" && (
                                            <span className="text-sm font-medium text-emerald-800">Đã hoàn tất</span>
                                        )}
                                        {mode === "history" && isOrderCompletedStatus(row.status) && (
                                            <span className="text-sm text-zinc-500">—</span>
                                        )}
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
