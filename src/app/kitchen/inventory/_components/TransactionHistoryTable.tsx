"use client";

import { FileText } from "lucide-react";
import { BasePagination } from "@/components/layout/BasePagination";
import { Badge } from "@/components/ui/badge";
import type { InventoryTransactionLogItem } from "@/types/inventory";
import type { PaginationMeta } from "@/app/kitchen/_components/query";

interface TransactionHistoryTableProps {
    items: InventoryTransactionLogItem[];
    meta: PaginationMeta;
    isLoading: boolean;
    isError: boolean;
    onPageChange: (page: number) => void;
}

function formatWhen(iso: string): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function TransactionHistoryTable({
    items,
    meta,
    isLoading,
    isError,
    onPageChange,
}: TransactionHistoryTableProps) {
    if (isLoading) {
        return <p className="py-12 text-center text-sm text-slate-500">Đang tải nhật ký giao dịch…</p>;
    }

    if (isError) {
        return (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-6 text-center text-sm text-red-700">
                Không tải được <code className="rounded bg-red-100 px-1">GET /inventory/transactions</code>. Kiểm tra
                Swagger / quyền role hoặc đường dẫn API.
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
                <FileText className="size-10 opacity-40" />
                <p className="text-sm">Chưa có bản ghi giao dịch.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {items.map((row) => (
                    <div key={row.transactionId} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs text-slate-600">{formatWhen(row.date)}</p>
                            <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                {row.type || "—"}
                            </Badge>
                        </div>
                        <div className="mt-2 text-sm font-semibold text-slate-900">{row.productName || "—"}</div>
                        <div className="mt-1 text-xs text-slate-600">
                            Lô: <span className="font-mono">{row.batchCode || "—"}</span>
                        </div>
                        <div className="mt-1 text-xs">
                            Số lượng:{" "}
                            <span className={`font-bold tabular-nums ${row.quantity < 0 ? "text-red-600" : "text-emerald-700"}`}>
                                {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{row.note || "—"}</p>
                    </div>
                ))}
            </div>

            <div className="border-t border-slate-100 pt-4">
                <BasePagination
                    currentPage={meta.currentPage}
                    totalPages={meta.totalPages}
                    onPageChange={onPageChange}
                    totalItems={meta.totalItems}
                    itemsPerPage={meta.itemsPerPage}
                />
            </div>
        </div>
    );
}
