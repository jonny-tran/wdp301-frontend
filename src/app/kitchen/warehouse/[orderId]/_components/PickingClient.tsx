"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useWarehouse } from "@/hooks/useWarehouse";
import { handleErrorApi } from "@/lib/errors";
import { buildPickRows } from "./picking.mapper";
import { PickFormRow } from "./picking.types";
import ReportIssueCard from "./ReportIssueCard";
import ScanCheckCard from "./ScanCheckCard";
import ShipmentLabelCard from "./ShipmentLabelCard";
import SuggestedPicksPanel from "./SuggestedPicksPanel";

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
    const detail = (detailQuery.data ?? {}) as Record<string, unknown>;
    const detailItems = useMemo(
        () => (Array.isArray(detail.items) ? detail.items : []),
        [detail.items],
    );
    const shipmentId = typeof detail.shipmentId === "string" ? detail.shipmentId : "";

    const labelQuery = shipmentLabel(shipmentId || "");

    const [scanInput, setScanInput] = useState("");
    const [scanCode, setScanCode] = useState("");
    const scanQuery = scanCheckBatch(scanCode);

    const [issueBatchId, setIssueBatchId] = useState("");
    const [issueReason, setIssueReason] = useState("");

    const [pickRows, setPickRows] = useState<PickFormRow[]>([]);

    useEffect(() => {
        setPickRows(buildPickRows(detailItems));
    }, [detailItems]);

    const completionPercent = useMemo(() => {
        if (pickRows.length === 0) return 0;
        const validCount = pickRows.filter((row) => Number(row.batchId) > 0 && Number(row.quantity) > 0).length;
        return Math.round((validCount / pickRows.length) * 100);
    }, [pickRows]);

    const handleScanSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!scanInput.trim()) return;
        setScanCode(scanInput.trim());
    };

    const handleReportIssue = async (event: FormEvent) => {
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
            .filter((row) => Number.isFinite(row.batchId) && row.batchId > 0 && Number.isFinite(row.quantity) && row.quantity > 0);

        if (pickedItems.length === 0) {
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
                Loading picking detail...
            </div>
        );
    }

    if (detailQuery.isError) {
        return (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
                Failed to load picking detail.
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
                        <h1 className="text-2xl font-black text-text-main">Picking Task Detail</h1>
                        <p className="text-sm text-text-muted">Prepare picked items and finalize shipment export.</p>
                    </div>
                </div>
                <div className="rounded-2xl bg-primary/10 px-4 py-2 text-right">
                    <p className="text-2xl font-black text-primary">{completionPercent}%</p>
                    <p className="text-xs font-semibold uppercase text-primary/80">Ready to finalize</p>
                </div>
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
