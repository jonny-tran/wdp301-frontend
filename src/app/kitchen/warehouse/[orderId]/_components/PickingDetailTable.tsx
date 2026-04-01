"use client";

import { CheckCircle2, Package, Search } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { PickingTaskItem } from "@/types/warehouse";

export type PickingLineStatus = "pending" | "verified" | "issue";

export type PickingLineState = {
    key: string;
    productId: number;
    productName: string;
    batchCode: string;
    batchId: number | null;
    suggestedQty: number;
    pickedQty: string;
    lineStatus: PickingLineStatus;
    expiry?: string;
};

export function buildPickingLines(detailItems: PickingTaskItem[]): PickingLineState[] {
    const rows: PickingLineState[] = [];
    detailItems.forEach((item, itemIdx) => {
        const suggested = item.suggestedBatches || [];
        suggested.forEach((batch, batchIdx) => {
            const suggestedQty = Number(batch.qtyToPick) || 0;
            const batchId = batch.batchId != null && Number.isFinite(Number(batch.batchId)) ? Number(batch.batchId) : null;
            const batchCode = batch.batchCode?.trim() || "—";
            rows.push({
                key: `${item.productId ?? itemIdx}-${batchCode}-${batchIdx}`,
                productId: Number(item.productId) || 0,
                productName: item.productName || "—",
                batchCode,
                batchId,
                suggestedQty,
                pickedQty: String(suggestedQty),
                lineStatus: "pending",
                expiry: batch.expiryDate || batch.expiry,
            });
        });
    });
    return rows;
}

type PickingDetailTableProps = {
    lines: PickingLineState[];
    onChangePickedQty: (index: number, value: string) => void;
    onConfirmLine: (index: number) => void;
    onReportIssue: (index: number, reason: string) => Promise<void>;
    confirmingIndex: number | null;
    reportingIndex: number | null;
};

export default function PickingDetailTable({
    lines,
    onChangePickedQty,
    onConfirmLine,
    onReportIssue,
    confirmingIndex,
    reportingIndex,
}: PickingDetailTableProps) {
    const [quickSearch, setQuickSearch] = useState("");
    const [issueDraftKey, setIssueDraftKey] = useState<string | null>(null);
    const [issueReason, setIssueReason] = useState("");
    const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const setCardRef = useCallback((key: string, el: HTMLDivElement | null) => {
        cardRefs.current[key] = el;
    }, []);

    const scrollToMatch = useMemo(() => {
        return () => {
            const needle = quickSearch.trim().toLowerCase();
            if (!needle) return;
            const match = lines.find((line) => {
                const c = line.batchCode.toLowerCase();
                return c === needle || c.endsWith(needle) || c.includes(needle);
            });
            if (match) {
                cardRefs.current[match.key]?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        };
    }, [lines, quickSearch]);

    if (lines.length === 0) {
        return (
            <div className="space-y-3 rounded-2xl border-2 border-dashed border-zinc-300 bg-gradient-to-b from-zinc-50 to-white px-6 py-10 text-center">
                <p className="text-base font-black text-zinc-800">Không có lô gợi ý (FEFO)</p>
                <p className="text-sm font-medium leading-relaxed text-zinc-600">
                    Hệ thống chưa gợi ý lô nào cho đơn này. Kiểm tra tồn kho hoặc từ chối tác vụ nếu đơn lỗi dữ liệu — dùng nút{" "}
                    <span className="font-bold text-zinc-800">Từ chối thực hiện</span> bên dưới.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1 space-y-2">
                    <Label htmlFor="batch-quick-search" className="text-xs font-bold uppercase tracking-wide text-zinc-600">
                        Tìm nhanh lô (gõ phần cuối mã)
                    </Label>
                    <div className="flex gap-2">
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                id="batch-quick-search"
                                value={quickSearch}
                                onChange={(e) => setQuickSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") scrollToMatch();
                                }}
                                placeholder="VD: 3CAC3C24…"
                                className="h-11 border-zinc-300 pl-10 text-base"
                            />
                        </div>
                        <Button type="button" variant="secondary" className="h-11 shrink-0 px-4 font-bold" onClick={scrollToMatch}>
                            Cuộn tới
                        </Button>
                    </div>
                </div>
            </div>

            <ul className="m-0 list-none space-y-4 p-0">
                {lines.map((line, index) => {
                    const pickedNum = Number(line.pickedQty);
                    const shortfall =
                        line.lineStatus === "pending" &&
                        Number.isFinite(pickedNum) &&
                        pickedNum + 1e-9 < line.suggestedQty;
                    const isConfirming = confirmingIndex === index;
                    const isReporting = reportingIndex === index;

                    return (
                        <li key={line.key} className="min-w-0">
                            <Card
                                ref={(el) => setCardRef(line.key, el)}
                                className={cn(
                                    "overflow-hidden border-2 py-0 shadow-none transition-colors",
                                    line.lineStatus === "verified" && "border-emerald-400/80 bg-emerald-50/40",
                                    line.lineStatus === "issue" && "border-orange-300 bg-orange-50/30",
                                    line.lineStatus === "pending" && !shortfall && "border-zinc-200 bg-white",
                                    shortfall && "border-amber-400 bg-amber-50/50",
                                )}
                            >
                                <CardContent className="space-y-4 p-4 sm:p-5">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Package className="size-4 shrink-0 text-zinc-500" aria-hidden />
                                                <span className="font-mono text-xl font-black tracking-tight text-zinc-950 sm:text-2xl">
                                                    {line.batchCode}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-zinc-600">{line.productName}</p>
                                        </div>
                                        <div className="shrink-0">
                                            {line.lineStatus === "verified" && (
                                                <Badge className="border-emerald-700 bg-emerald-600 font-bold text-white hover:bg-emerald-600">
                                                    <CheckCircle2 className="mr-1 size-3.5" aria-hidden />
                                                    Đã xác nhận
                                                </Badge>
                                            )}
                                            {line.lineStatus === "issue" && (
                                                <Badge variant="secondary" className="border-orange-400 bg-orange-100 font-bold text-orange-900">
                                                    Đã báo sự cố
                                                </Badge>
                                            )}
                                            {line.lineStatus === "pending" && (
                                                <Badge variant="outline" className="font-semibold text-zinc-600">
                                                    Chờ xác nhận
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                                        <div className="rounded-xl bg-zinc-50 px-3 py-2">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">HSD</p>
                                            <p className="text-sm font-bold tabular-nums text-zinc-900">
                                                {line.expiry ? String(line.expiry).slice(0, 10) : "—"}
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-zinc-50 px-3 py-2">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">SL gợi ý</p>
                                            <p className="text-lg font-black tabular-nums text-zinc-900">{line.suggestedQty}</p>
                                        </div>
                                        <div className="col-span-2 rounded-xl border border-zinc-200 bg-white px-3 py-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                                SL soạn (mặc định = gợi ý)
                                            </Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                step="any"
                                                disabled={line.lineStatus !== "pending"}
                                                value={line.pickedQty}
                                                onChange={(e) => onChangePickedQty(index, e.target.value)}
                                                className={cn(
                                                    "mt-1 h-10 border-2 font-bold tabular-nums",
                                                    shortfall ? "border-amber-600 bg-amber-50" : "border-zinc-200",
                                                )}
                                                aria-label={`Số lượng soạn ${line.batchCode}`}
                                            />
                                        </div>
                                    </div>

                                    {line.lineStatus === "pending" && (
                                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                            <Button
                                                type="button"
                                                className="h-11 flex-1 min-w-[200px] font-black sm:max-w-md"
                                                disabled={isConfirming || isReporting}
                                                onClick={() => onConfirmLine(index)}
                                            >
                                                {isConfirming ? "Đang kiểm tra lô…" : "Xác nhận lấy lô này"}
                                            </Button>
                                            {issueDraftKey === line.key ? (
                                                <div className="w-full space-y-2 rounded-xl border-2 border-orange-200 bg-orange-50/60 p-3 sm:min-w-[280px] sm:flex-1">
                                                    <Textarea
                                                        value={issueReason}
                                                        onChange={(e) => setIssueReason(e.target.value)}
                                                        placeholder="Mô tả ngắn (vỡ lô, hết date, thiếu tồn…)"
                                                        className="min-h-[72px] border-2 text-sm"
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="secondary"
                                                            className="font-bold"
                                                            onClick={() => {
                                                                setIssueDraftKey(null);
                                                                setIssueReason("");
                                                            }}
                                                        >
                                                            Huỷ
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            className="bg-orange-600 font-bold hover:bg-orange-700"
                                                            disabled={!issueReason.trim() || isReporting}
                                                            onClick={async () => {
                                                                await onReportIssue(index, issueReason.trim());
                                                                setIssueDraftKey(null);
                                                                setIssueReason("");
                                                            }}
                                                        >
                                                            {isReporting ? "Đang gửi…" : "Gửi báo cáo"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-11 flex-1 min-w-[160px] border-orange-300 font-bold text-orange-900 hover:bg-orange-50"
                                                    disabled={isConfirming || isReporting}
                                                    onClick={() => {
                                                        setIssueDraftKey(line.key);
                                                        setIssueReason("");
                                                    }}
                                                >
                                                    Báo sự cố / thiếu hàng
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
