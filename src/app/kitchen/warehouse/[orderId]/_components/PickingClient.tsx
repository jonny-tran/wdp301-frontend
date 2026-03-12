"use client";

import Link from "next/link";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useWarehouse } from "@/hooks/useWarehouse";
import { handleErrorApi } from "@/lib/errors";
import { PickingTaskItem } from "@/types/warehouse";
import { toast } from "sonner";
import ReportIssueCard from "./ReportIssueCard";
import ScanCheckCard from "./ScanCheckCard";
import ShipmentLabelCard from "./ShipmentLabelCard";
import SuggestedPicksPanel from "./SuggestedPicksPanel";

export interface PickFormRow {
    key: string;
    productName: string;
    batchCode: string;
    batchId: string;
    quantity: string;
    expiry?: string;
}

function buildPickRows(detailItems: PickingTaskItem[]): PickFormRow[] {
    const rows: PickFormRow[] = [];
    detailItems.forEach((item, itemIdx) => {
        const suggested = item.suggestedBatches || [];
        suggested.forEach((batch, batchIdx) => {
            rows.push({
                key: `${item.productId || itemIdx}-${batch.batchCode || batch.batchId || batchIdx}`,
                productName: item.productName || "Product",
                batchCode: batch.batchCode || "-",
                batchId: batch.batchId ? String(batch.batchId) : "",
                quantity: String(batch.qtyToPick || 0),
                expiry: batch.expiryDate || batch.expiry,
            });
        });
    });
    return rows;
}

interface PickingClientProps {
    orderId: string;
}

export default function PickingClient({ orderId }: PickingClientProps) {
    const queryClient = useQueryClient();

    const {
        getPickingTaskDetail,
        scanCheckBatch,
        shipmentLabel,
        reportIssue,
        finalizeBulkShipment,
    } = useWarehouse();

    const detailQuery = getPickingTaskDetail(orderId);
    const shipmentId = detailQuery.data?.shipmentId || "";
    const labelQuery = shipmentLabel(shipmentId || "");

    const [scanInput, setScanInput] = useState("");
    const [scanCode, setScanCode] = useState("");
    const scanQuery = scanCheckBatch(scanCode);

    const [issueBatchId, setIssueBatchId] = useState("");
    const [issueReason, setIssueReason] = useState("");

    const [pickRows, setPickRows] = useState<PickFormRow[]>([]);

    useEffect(() => {
        if (detailQuery.data?.items) {
            setPickRows(buildPickRows(detailQuery.data.items));
        }
    }, [detailQuery.data?.items]);

    // Tự động điền ID lô hàng khi quét thành công
    useEffect(() => {
        if (scanQuery.data && scanQuery.data.batchId) {
            const scannedData = scanQuery.data;
            setPickRows((prev) =>
                prev.map((row) =>
                    row.batchCode === scannedData.batchCode
                        ? { ...row, batchId: String(scannedData.batchId) }
                        : row
                )
            );
        }
    }, [scanQuery.data]);

    const completionPercent = useMemo(() => {
        if (pickRows.length === 0) return 0;
        const validCount = pickRows.filter((row) => Number(row.batchId) > 0 && Number(row.quantity) > 0).length;
        return Math.round((validCount / pickRows.length) * 100);
    }, [pickRows]);

    const handleScanSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!scanInput.trim()) return;
        setScanCode(scanInput.trim());
    };

    const handleReportIssue = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const batchId = Number(issueBatchId);
        if (!Number.isFinite(batchId) || batchId <= 0 || !issueReason.trim()) {
            return;
        }

        try {
            await reportIssue.mutateAsync({ batchId, reason: issueReason.trim() });
            setIssueBatchId("");
            setIssueReason("");
            await detailQuery.refetch();
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    const handleFinalize = async () => {
        const pickedItems = pickRows
            .map((row) => ({
                batchId: Number(row.batchId),
                quantity: Number(row.quantity),
            }))
            .filter((row) =>
                Number.isFinite(row.batchId) &&
                row.batchId > 0 &&
                Number.isFinite(row.quantity) &&
                row.quantity > 0
            );

        if (pickedItems.length === 0) {
            toast.error("Vui lòng nhập ID lô hàng (dạng số) và số lượng hợp lệ cho ít nhất một mặt hàng.");
            return;
        }

        try {
            await finalizeBulkShipment.mutateAsync({
                orders: [
                    {
                        orderId,
                        pickedItems,
                    },
                ],
            });

            await queryClient.invalidateQueries({ queryKey: ["picking-task-list"] });
            await queryClient.invalidateQueries({ queryKey: ["picking-task-detail", orderId] });
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    if (detailQuery.isLoading) {
        return (
            <div className="rounded-3xl border border-gray-100 bg-white p-6 text-sm text-text-muted shadow-sm">
                Đang tải chi tiết lấy hàng...
            </div>
        );
    }

    if (detailQuery.isError) {
        return (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
                Tải chi tiết lấy hàng thất bại.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/kitchen/warehouse" className="rounded-xl border border-gray-200 bg-white p-2 hover:border-primary/40">
                        <ArrowLeftIcon className="h-5 w-5 text-text-main" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-text-main">Chi tiết tác vụ lấy hàng</h1>
                        <p className="text-sm text-text-muted">Chuẩn bị các mặt hàng đã chọn và hoàn tất xuất kho.</p>
                    </div>
                </div>
                {/* <div className="rounded-2xl bg-primary/10 px-4 py-2 text-right">
                    <p className="text-2xl font-black text-primary">{completionPercent}%</p>
                    <p className="text-xs font-semibold uppercase text-primary/80">Sẵn sàng hoàn tất</p>
                </div> */}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                <SuggestedPicksPanel
                    rows={pickRows}
                    shipmentId={shipmentId}
                    isFinalizing={finalizeBulkShipment.isPending}
                    onChangeRow={(index, field, value) => {
                        setPickRows((prev) => prev.map((row, rowIndex) => (
                            rowIndex === index ? { ...row, [field]: value } : row
                        )));
                    }}
                    onFinalize={handleFinalize}
                />

                <div className="xl:col-span-2 space-y-6">
                    <ScanCheckCard
                        scanInput={scanInput}
                        scanCode={scanCode}
                        scanData={scanQuery.data}
                        isLoading={scanQuery.isLoading}
                        isError={scanQuery.isError}
                        onChangeInput={setScanInput}
                        onSubmit={handleScanSubmit}
                    />

                    <ReportIssueCard
                        batchId={issueBatchId}
                        reason={issueReason}
                        isPending={reportIssue.isPending}
                        onChangeBatchId={setIssueBatchId}
                        onChangeReason={setIssueReason}
                        onSubmit={handleReportIssue}
                    />

                    <ShipmentLabelCard
                        shipmentId={shipmentId}
                        isLoading={labelQuery.isLoading}
                        isError={labelQuery.isError}
                        labelData={labelQuery.data}
                    />
                </div>
            </div>
        </div>
    );
}
