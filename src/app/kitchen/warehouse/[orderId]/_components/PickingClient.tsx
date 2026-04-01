"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Can from "@/components/shared/Can";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWarehouse } from "@/hooks/useWarehouse";
import { handleErrorApi } from "@/lib/errors";
import { P } from "@/lib/authz";
import type { PickingTaskItem } from "@/types/warehouse";
import { KEY, Resource } from "@/utils/constant";
import CancelPickingTaskDialog from "../../_components/CancelPickingTaskDialog";
import PickingDetailTable, { buildPickingLines, type PickingLineState } from "./PickingDetailTable";
import FinalizePanel from "./FinalizePanel";
import ShipmentLabelCard from "./ShipmentLabelCard";

interface PickingClientProps {
    orderId: string;
}

type ShipmentSummaryRow = {
    productName: string;
    batchCode: string;
    quantity: number;
};

function hasOrderPartialFulfillment(lines: PickingLineState[], items: PickingTaskItem[]): boolean {
    const byProduct = new Map<number, number>();
    for (const line of lines) {
        if (line.lineStatus !== "verified") continue;
        const q = Number(line.pickedQty);
        if (!Number.isFinite(q) || q < 0) continue;
        byProduct.set(line.productId, (byProduct.get(line.productId) ?? 0) + q);
    }
    return items.some((it) => {
        const req = Number(it.requiredQty) || 0;
        if (req <= 0) return false;
        const got = byProduct.get(it.productId) ?? 0;
        return got + 1e-9 < req;
    });
}

export default function PickingClient({ orderId }: PickingClientProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { getPickingTaskDetail, shipmentLabel, reportIssue, finalizeBulkShipment, verifyScanCheck, cancelPickingTask } =
        useWarehouse();

    const detailQuery = getPickingTaskDetail(orderId);
    const shipmentId = detailQuery.data?.shipmentId || "";
    const labelQuery = shipmentLabel(shipmentId || "");

    const [lines, setLines] = useState<PickingLineState[]>([]);
    const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null);
    const [reportingIndex, setReportingIndex] = useState<number | null>(null);
    const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [shipmentSummary, setShipmentSummary] = useState<{
        storeName?: string;
        shipmentId: string;
        rows: ShipmentSummaryRow[];
    } | null>(null);

    useEffect(() => {
        if (detailQuery.data?.items) {
            setLines(buildPickingLines(detailQuery.data.items));
        }
    }, [detailQuery.data?.items]);

    const completionPercent = useMemo(() => {
        if (lines.length === 0) return 0;
        const done = lines.filter((l) => l.lineStatus === "verified" || l.lineStatus === "issue").length;
        return Math.round((done / lines.length) * 100);
    }, [lines]);

    const canFinalize = useMemo(() => {
        if (lines.length === 0) return false;
        return lines.every((l) => l.lineStatus === "verified" || l.lineStatus === "issue");
    }, [lines]);

    const totalVerifiedUnits = useMemo(() => {
        return lines
            .filter((l) => l.lineStatus === "verified")
            .reduce((sum, l) => sum + (Number.isFinite(Number(l.pickedQty)) ? Number(l.pickedQty) : 0), 0);
    }, [lines]);

    const finalizeShowsPartialWarning = useMemo(() => {
        const items = detailQuery.data?.items;
        if (!items?.length) return false;
        return hasOrderPartialFulfillment(lines, items);
    }, [lines, detailQuery.data?.items]);

    const handleChangePickedQty = (index: number, value: string) => {
        setLines((prev) => prev.map((row, i) => (i === index ? { ...row, pickedQty: value } : row)));
    };

    const handleConfirmLine = async (index: number) => {
        const line = lines[index];
        if (!line || line.lineStatus !== "pending") return;

        const qty = Number(line.pickedQty);
        if (!Number.isFinite(qty) || qty <= 0) {
            toast.error("Nhập số lượng soạn lớn hơn 0.");
            return;
        }

        const code = line.batchCode?.trim();
        if (!code || code === "—") {
            toast.error("Thiếu mã lô hợp lệ. Không thể kiểm tra lô với API kho.");
            return;
        }

        setConfirmingIndex(index);
        try {
            const result = await verifyScanCheck.mutateAsync(code);
            const resolvedId = result.batchId != null && result.batchId > 0 ? result.batchId : line.batchId;
            setLines((prev) =>
                prev.map((row, i) =>
                    i === index
                        ? {
                              ...row,
                              lineStatus: "verified" as const,
                              batchId: resolvedId,
                              batchCode: result.batchCode?.trim() || row.batchCode,
                          }
                        : row,
                ),
            );
            toast.success("Đã xác nhận lô", { description: result.batchCode || line.batchCode });
            void queryClient.invalidateQueries({ queryKey: KEY.warehouse });
        } catch (e) {
            handleErrorApi({ error: e });
        } finally {
            setConfirmingIndex(null);
        }
    };

    const handleReportIssue = async (index: number, reason: string) => {
        const line = lines[index];
        if (!line || !reason.trim()) return;
        const batchId = line.batchId != null && line.batchId > 0 ? line.batchId : null;
        if (batchId == null) {
            toast.error("Chưa có batchId — không gửi được báo cáo. Thử xác nhận lô trước hoặc liên hệ quản trị.");
            return;
        }

        setReportingIndex(index);
        try {
            await reportIssue.mutateAsync({ batchId, reason: reason.trim() });
            setLines((prev) => prev.map((row, i) => (i === index ? { ...row, lineStatus: "issue" as const } : row)));
            await detailQuery.refetch();
        } catch (e) {
            handleErrorApi({ error: e });
        } finally {
            setReportingIndex(null);
        }
    };

    const runFinalizeShipment = async () => {
        const pickedItems = lines
            .filter((l) => l.lineStatus === "verified")
            .map((l) => ({
                batchId: Number(l.batchId),
                quantity: Number(l.pickedQty),
            }))
            .filter((row) => Number.isFinite(row.batchId) && row.batchId > 0 && Number.isFinite(row.quantity) && row.quantity > 0);

        if (pickedItems.length === 0) {
            toast.error("Cần ít nhất một dòng đã xác nhận (xanh) với batchId và số lượng hợp lệ.");
            return;
        }

        try {
            await finalizeBulkShipment.mutateAsync({
                orders: [{ orderId, pickedItems }],
            });

            const rows: ShipmentSummaryRow[] = lines
                .filter((l) => l.lineStatus === "verified")
                .map((l) => ({
                    productName: l.productName,
                    batchCode: l.batchCode,
                    quantity: Number(l.pickedQty),
                }))
                .filter((r) => Number.isFinite(r.quantity) && r.quantity > 0);

            setShipmentSummary({
                storeName: detailQuery.data?.storeName,
                shipmentId: shipmentId || "—",
                rows,
            });
            setFinalizeDialogOpen(false);
            setSuccessDialogOpen(true);
            toast.success("Đã hoàn tất xuất kho");
            void queryClient.invalidateQueries({ queryKey: KEY.warehouse });
        } catch (e) {
            handleErrorApi({ error: e });
        }
    };

    if (detailQuery.isLoading) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 text-sm text-text-muted shadow-sm">
                Đang tải chi tiết soạn hàng…
            </div>
        );
    }

    if (detailQuery.isError) {
        return (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
                Tải chi tiết soạn hàng thất bại.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <CancelPickingTaskDialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
                orderId={orderId}
                title="Từ chối thực hiện tác vụ soạn"
                onSuccess={() => router.push("/kitchen/warehouse")}
            />

            <AlertDialog open={finalizeDialogOpen} onOpenChange={setFinalizeDialogOpen}>
                <AlertDialogContent className="border-2 border-zinc-200 sm:max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-left text-lg font-black text-zinc-950">Xác nhận hoàn tất xuất kho</AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-3 text-left text-sm text-zinc-700">
                                {finalizeShowsPartialWarning ? (
                                    <p className="rounded-xl border-2 border-amber-400 bg-amber-50 p-3 font-semibold text-amber-950">
                                        Cảnh báo: Bạn đang giao thiếu hàng. Theo quy tắc hệ thống, phần còn thiếu sẽ bị HỦY tự động.
                                        Store sẽ phải đặt lại vào ngày hôm sau. Bạn có chắc chắn muốn tiếp tục?
                                    </p>
                                ) : (
                                    <p>
                                        Bạn sắp chốt xuất kho theo các lô đã xác nhận. Hành động này cập nhật shipment và tồn kho theo
                                        nghiệp vụ hiện tại.
                                    </p>
                                )}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="font-bold">Quay lại</AlertDialogCancel>
                        <Button
                            type="button"
                            className="border-2 border-emerald-800 bg-emerald-600 font-black text-white hover:bg-emerald-700"
                            disabled={finalizeBulkShipment.isPending}
                            onClick={() => void runFinalizeShipment()}
                        >
                            {finalizeBulkShipment.isPending ? "Đang xử lý…" : "Tiếp tục xuất kho"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto border-2 border-emerald-200 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-emerald-900">Tóm tắt lô đã xuất</DialogTitle>
                    </DialogHeader>
                    {shipmentSummary ? (
                        <div className="space-y-3 text-sm">
                            <p className="font-medium text-zinc-700">
                                Shipment: <span className="font-mono font-bold text-zinc-900">{shipmentSummary.shipmentId}</span>
                                {shipmentSummary.storeName ? (
                                    <>
                                        {" "}
                                        · <span className="font-semibold">{shipmentSummary.storeName}</span>
                                    </>
                                ) : null}
                            </p>
                            <div className="rounded-xl border border-zinc-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-zinc-50">
                                            <TableHead className="font-bold">Sản phẩm</TableHead>
                                            <TableHead className="font-bold">Mã lô</TableHead>
                                            <TableHead className="text-right font-bold">SL</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {shipmentSummary.rows.map((r, i) => (
                                            <TableRow key={`${r.batchCode}-${i}`}>
                                                <TableCell className="max-w-[140px] text-zinc-800">{r.productName}</TableCell>
                                                <TableCell className="font-mono text-sm font-bold">{r.batchCode}</TableCell>
                                                <TableCell className="text-right font-black tabular-nums">{r.quantity}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ) : null}
                    <DialogFooter>
                        <Button
                            type="button"
                            className="w-full font-black sm:w-auto"
                            onClick={() => {
                                setSuccessDialogOpen(false);
                                router.push("/kitchen/warehouse");
                            }}
                        >
                            Về danh sách tác vụ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link href="/kitchen/warehouse" className="rounded-xl border border-gray-200 bg-white p-2 hover:border-primary/40">
                        <ArrowLeftIcon className="h-5 w-5 text-text-main" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-text-main">Soạn hàng thủ công (FEFO)</h1>
                        <p className="text-sm text-text-muted">
                            Mã lô là thông tin chính để lấy hàng. SL soạn mặc định theo gợi ý — chỉnh xuống khi thiếu tồn, rồi bấm một
                            nút xác nhận.
                        </p>
                    </div>
                </div>
                <div className="rounded-2xl bg-primary/10 px-4 py-2 text-right">
                    <p className="text-2xl font-black text-primary">{completionPercent}%</p>
                    <p className="text-xs font-semibold uppercase text-primary/80">Tiến độ dòng</p>
                </div>
            </div>

            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-12 lg:gap-10">
                <div className="min-w-0 space-y-6 lg:col-span-7 xl:col-span-8">
                    <section className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-sm ring-1 ring-zinc-100">
                        <div className="border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white px-4 py-3 sm:px-6">
                            <h2 className="text-sm font-black uppercase tracking-wide text-zinc-700">Danh sách lô gợi ý (FEFO)</h2>
                            <p className="mt-0.5 text-xs text-zinc-500">Mỗi lô một thẻ — không cần kéo ngang. Xác nhận = kiểm tra mã lô qua kho (GET).</p>
                        </div>
                        <div className="p-4 sm:p-6">
                            <Can
                                I={P.WAREHOUSE_PICK_ITEM}
                                on={Resource.WAREHOUSE}
                                fallback={<p className="text-sm text-zinc-500">Bạn không có quyền xác nhận lô.</p>}
                            >
                                <PickingDetailTable
                                    lines={lines}
                                    onChangePickedQty={handleChangePickedQty}
                                    onConfirmLine={handleConfirmLine}
                                    onReportIssue={handleReportIssue}
                                    confirmingIndex={confirmingIndex}
                                    reportingIndex={reportingIndex}
                                />
                            </Can>
                        </div>
                    </section>

                    <FinalizePanel
                        disabled={!canFinalize}
                        isPending={finalizeBulkShipment.isPending}
                        onFinalize={() => setFinalizeDialogOpen(true)}
                        storeName={detailQuery.data?.storeName}
                        shipmentId={shipmentId}
                        totalVerifiedUnits={totalVerifiedUnits}
                        onReject={() => setRejectDialogOpen(true)}
                        rejectDisabled={detailQuery.isFetching}
                        isRejectPending={cancelPickingTask.isPending}
                    />
                </div>

                <aside className="min-w-0 lg:col-span-5 xl:col-span-4">
                    <div className="lg:sticky lg:top-20">
                        <ShipmentLabelCard
                            shipmentId={shipmentId}
                            isLoading={labelQuery.isLoading}
                            isError={labelQuery.isError}
                            labelData={labelQuery.data}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
}
