"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Can from "@/components/shared/Can";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { P } from "@/lib/authz";
import { cn } from "@/lib/utils";
import type { PickingTaskListItem } from "@/types/warehouse";
import { Resource } from "@/utils/constant";
import CancelPickingTaskDialog from "./CancelPickingTaskDialog";

interface WarehouseTasksTableProps {
    tasks: PickingTaskListItem[];
    rowStart: number;
    isLoading: boolean;
    isError: boolean;
    isResetting: boolean;
    onReset: (orderId: string) => void;
}

function canCancelWarehouseTask(task: PickingTaskListItem): boolean {
    const s = task.status?.trim().toUpperCase();
    if (!s) return true;
    return s === "APPROVED" || s === "PICKING";
}

function formatCreatedAt(iso: string | undefined) {
    if (!iso) return "—";
    try {
        return format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
        return String(iso).slice(0, 16);
    }
}

export default function WarehouseTasksTable({
    tasks,
    rowStart,
    isLoading,
    isError,
    isResetting,
    onReset,
}: WarehouseTasksTableProps) {
    const router = useRouter();
    const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

    const goDetail = (orderId: string) => {
        if (!orderId) return;
        router.push(`/kitchen/warehouse/${orderId}`);
    };

    return (
        <div className="px-2 pb-2 sm:px-4">
            <CancelPickingTaskDialog
                open={cancelOrderId != null}
                onOpenChange={(open) => {
                    if (!open) setCancelOrderId(null);
                }}
                orderId={cancelOrderId ?? ""}
                title="Hủy tác vụ soạn hàng"
            />
            <Table>
                <TableHeader>
                    <TableRow className="border-b-2 border-zinc-200 bg-zinc-50 hover:bg-zinc-50">
                        <TableHead className="w-14 font-bold text-zinc-700">STT</TableHead>
                        <TableHead className="font-bold text-zinc-700">Mã đơn</TableHead>
                        <TableHead className="font-bold text-zinc-700">Cửa hàng đích</TableHead>
                        <TableHead className="text-right font-bold text-zinc-700">Tổng mặt hàng</TableHead>
                        <TableHead className="font-bold text-zinc-700">Ngày tạo</TableHead>
                        <TableHead className="w-[200px] text-right font-bold text-zinc-700">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-12 text-center text-sm font-medium text-zinc-500">
                                Đang tải danh sách tác vụ kho…
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-12 text-center text-sm font-semibold text-red-600">
                                Không tải được danh sách. Thử làm mới trang.
                            </TableCell>
                        </TableRow>
                    ) : tasks.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="py-14 text-center">
                                <p className="text-base font-semibold text-zinc-800">Hiện không có đơn chờ soạn hàng</p>
                                <p className="mt-2 text-sm text-zinc-500">
                                    API chỉ trả các đơn đã duyệt, chờ soạn hàng. Không hiển thị vị trí kệ — chỉ danh sách công việc.
                                </p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        tasks.map((task, index) => {
                            const oid = task.orderId || task.id || "";
                            return (
                                <TableRow
                                    key={oid || String(index)}
                                    className={cn(
                                        "cursor-pointer border-zinc-100 transition-colors hover:bg-amber-50/60",
                                    )}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => goDetail(oid)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            goDetail(oid);
                                        }
                                    }}
                                >
                                    <TableCell className="font-bold text-zinc-900">#{rowStart + index + 1}</TableCell>
                                    <TableCell className="font-mono text-sm font-bold text-zinc-900">{oid || "—"}</TableCell>
                                    <TableCell className="font-medium text-zinc-800">{task.storeName ?? "—"}</TableCell>
                                    <TableCell className="text-right text-sm font-black tabular-nums text-zinc-900">
                                        {task.totalItems ?? "—"}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-sm text-zinc-600">
                                        {formatCreatedAt(task.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <Can I={P.WAREHOUSE_CANCEL_PICKING_TASK} on={Resource.WAREHOUSE}>
                                                {canCancelWarehouseTask(task) ? (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => setCancelOrderId(oid)}
                                                    >
                                                        Hủy Task
                                                    </Button>
                                                ) : null}
                                            </Can>
                                            <Can I={P.WAREHOUSE_RESET_PICKING} on={Resource.WAREHOUSE}>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="font-bold"
                                                    disabled={isResetting}
                                                    onClick={() => onReset(oid)}
                                                >
                                                    Reset
                                                </Button>
                                            </Can>
                                            <Button type="button" size="sm" className="font-bold" onClick={() => goDetail(oid)}>
                                                Mở soạn hàng
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
