"use client";

import { FileText } from "lucide-react";
import { BasePagination } from "@/components/layout/BasePagination";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Mã lô</TableHead>
                        <TableHead className="text-right">Số lượng</TableHead>
                        <TableHead>Ghi chú / tham chiếu</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((row) => (
                        <TableRow key={row.transactionId}>
                            <TableCell className="whitespace-nowrap text-xs text-slate-600">
                                {formatWhen(row.date)}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                    {row.type || "—"}
                                </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate font-medium">{row.productName || "—"}</TableCell>
                            <TableCell className="font-mono text-xs">{row.batchCode || "—"}</TableCell>
                            <TableCell
                                className={`text-right tabular-nums font-semibold ${row.quantity < 0 ? "text-red-600" : "text-emerald-700"}`}
                            >
                                {row.quantity > 0 ? `+${row.quantity}` : row.quantity}
                            </TableCell>
                            <TableCell className="max-w-[280px] truncate text-xs text-slate-600">{row.note || "—"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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
