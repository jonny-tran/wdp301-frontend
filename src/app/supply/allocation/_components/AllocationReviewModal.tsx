"use client";

import { formatStatusLabel } from "@/app/supply/_components/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ApprovalSuggestion, OrderReviewItem } from "@/types/order";
import { useEffect, useState } from "react";

export type AllocationReviewRow = {
    productId: number;
    productName: string;
    quantityRequested: number;
    review?: OrderReviewItem;
    atpAvailable?: number;
    safetyMinimumExpiryDate?: string | null;
    suggestedApprove?: number;
};

interface AllocationReviewModalProps {
    orderId: string;
    orderNo?: number;
    isLoading: boolean;
    isError: boolean;
    isSuggestionLoading: boolean;
    isSuggestionError: boolean;
    suggestion: ApprovalSuggestion | null;
    storeName?: string;
    status?: string;
    rows: AllocationReviewRow[];
    approvedByProductId: Record<number, number>;
    onChangeApproved: (productId: number, value: number) => void;
    onApplySuggestion: (productId: number) => void;
    onApprove: () => void;
    onClose: () => void;
    isApproving: boolean;
    /** Gợi ý ghi chú gửi bếp (thiếu ATP theo dòng) */
    defaultProductionNote?: string;
    showKitchenProductionRequest: boolean;
    onRequestKitchenProduce: (note?: string) => void;
    isRequestingProduction: boolean;
    selectedProductionRequestProductIds: number[];
    onToggleProductionRequest: (productId: number, checked: boolean) => void;
}

function fmtHsd(s: string | null | undefined): string {
    if (!s || !s.trim()) return "—";
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    return s;
}

export default function AllocationReviewModal({
    orderId,
    orderNo,
    isLoading,
    isError,
    isSuggestionLoading,
    isSuggestionError,
    suggestion,
    storeName,
    status,
    rows,
    approvedByProductId,
    onChangeApproved,
    onApplySuggestion,
    onApprove,
    onClose,
    isApproving,
    defaultProductionNote = "",
    showKitchenProductionRequest,
    onRequestKitchenProduce,
    isRequestingProduction,
    selectedProductionRequestProductIds,
    onToggleProductionRequest,
}: AllocationReviewModalProps) {
    const [kitchenNote, setKitchenNote] = useState(defaultProductionNote);

    useEffect(() => {
        setKitchenNote(defaultProductionNote);
    }, [defaultProductionNote, orderId]);

    const globalSafety = suggestion?.safetyMinimumExpiryDate ?? null;
    const summary = suggestion?.summarySuggestion;
    const summaryStatusU = (suggestion?.summaryStatus ?? "").toUpperCase();
    const partialFromSummary = summaryStatusU === "PARTIAL_STOCK" || summaryStatusU === "PARTIAL_FULFILLMENT";

    const rowMetrics = rows.map((row) => {
        const approved = approvedByProductId[row.productId] ?? row.quantityRequested;
        const atp = row.atpAvailable ?? row.review?.currentStock ?? 0;
        const short = atp < row.quantityRequested;
        return { ...row, approved, atp, short };
    });

    const shortCount = rowMetrics.filter((r) => r.short).length;
    const partialFromLines = rowMetrics.some((r) => {
        const line = suggestion?.lines?.find((l) => l.productId === r.productId);
        return line?.mode === "PARTIAL_FULFILLMENT";
    });
    const canShowKitchenBtn = showKitchenProductionRequest && (shortCount > 0 || partialFromSummary || partialFromLines);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-xl">
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 p-6">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">Xét duyệt — Smart Approval (ATP)</h3>
                        <p className="text-sm text-text-muted">
                            Tồn khả dụng (ATP) và mốc HSD tối thiểu trước khi duyệt. Điều chỉnh cột &quot;Duyệt&quot; hoặc dùng
                            &quot;Áp dụng gợi ý&quot;.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main transition hover:border-primary/40"
                    >
                        Đóng
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center gap-2 py-6">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <p className="text-sm text-text-muted">Đang tải chi tiết đơn…</p>
                        </div>
                    ) : isError ? (
                        <p className="text-sm text-red-500">Tải chi tiết đơn thất bại.</p>
                    ) : rows.length === 0 ? (
                        <p className="text-sm text-text-muted">Không có dòng hàng.</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-gray-100 p-4 space-y-2">
                                <div className="flex flex-wrap items-start justify-between gap-3 text-sm">
                                    <div>
                                        <p className="font-semibold text-text-main">Đơn hàng số: {orderNo ? `#${orderNo}` : "—"}</p>
                                        <p className="text-xs text-text-muted">Cửa hàng: {storeName ?? "—"}</p>
                                        <p className="text-xs text-text-muted">Trạng thái: {formatStatusLabel(String(status ?? ""))}</p>
                                    </div>
                                    <div className="text-right text-xs text-text-muted">
                                        {isSuggestionLoading && <p>Đang tải gợi ý ATP…</p>}
                                        {isSuggestionError && <p className="text-red-600">Không tải được approval-suggestion.</p>}
                                        {globalSafety && (
                                            <p className="mt-1 font-semibold text-text-main">
                                                Mốc HSD tối thiểu (chung): <span className="text-primary">{fmtHsd(globalSafety)}</span>
                                            </p>
                                        )}
                                        {suggestion?.travelHoursUsed != null && (
                                            <p className="mt-0.5">Giờ VC ước tính: {suggestion.travelHoursUsed} + buffer {suggestion.bufferHours ?? "—"}</p>
                                        )}
                                    </div>
                                </div>
                                {(summary || suggestion?.summaryStatus) && (
                                    <p className="rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-700">
                                        {suggestion?.summaryStatus && (
                                            <span className="mr-2 rounded bg-indigo-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-800">
                                                {suggestion.summaryStatus}
                                            </span>
                                        )}
                                        {summary && (
                                            <>
                                                <span className="font-semibold">Gợi ý hệ thống: </span>
                                                {summary}
                                            </>
                                        )}
                                    </p>
                                )}
                            </div>

                            {canShowKitchenBtn && (
                                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 space-y-2">
                                    <p className="text-xs font-bold uppercase tracking-wide text-indigo-900">
                                        Yêu cầu Bếp sản xuất thêm
                                    </p>
                                    <p className="text-xs text-indigo-800/90">
                                        Gửi đơn sang trạng thái <span className="font-semibold">Chờ bếp</span>. Bếp xác nhận hoặc từ chối
                                        — sau đó đơn quay lại <span className="font-semibold">pending</span> để bạn duyệt.
                                    </p>
                                    <Textarea
                                        value={kitchenNote}
                                        onChange={(e) => setKitchenNote(e.target.value)}
                                        placeholder="Ghi chú cho bếp: ví dụ cần thêm bao nhiêu, mặt hàng nào…"
                                        className="min-h-[72px] border-indigo-200 bg-white text-sm"
                                    />
                                </div>
                            )}

                            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                                <table className="w-full min-w-[720px] text-left text-sm">
                                    <thead className="border-b border-gray-100 bg-zinc-50 text-xs font-bold uppercase tracking-wide text-text-muted">
                                        <tr>
                                            <th className="px-3 py-2">Sản phẩm</th>
                                            <th className="px-3 py-2 text-right">Yêu cầu</th>
                                            <th className="px-3 py-2 text-right">Tồn khả dụng (ATP)</th>
                                            <th className="px-3 py-2 text-right">Thiếu</th>
                                            <th className="px-3 py-2">HSD tối thiểu</th>
                                            <th className="px-3 py-2 text-right">Duyệt</th>
                                            <th className="px-3 py-2 w-[140px]">Thao tác</th>
                                            <th className="px-3 py-2 w-[220px]">Yêu cầu sản xuất bù</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rowMetrics.map((row) => {
                                            const sug = row.suggestedApprove;
                                            const lineHsd = row.safetyMinimumExpiryDate ?? globalSafety;
                                            const missingQty = Math.max(0, row.quantityRequested - row.atp);
                                            const selectedForProduction = selectedProductionRequestProductIds.includes(row.productId);
                                            return (
                                                <tr
                                                    key={row.productId}
                                                    className={row.short ? "bg-red-50/50" : "border-b border-gray-50"}
                                                >
                                                    <td className="px-3 py-2 font-medium text-text-main">
                                                        {row.productName}
                                                        {row.review && !row.short && (
                                                            <span className="ml-2 text-[10px] text-emerald-600">(review: đủ tồn thô)</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-right tabular-nums">{row.quantityRequested}</td>
                                                    <td className="px-3 py-2 text-right tabular-nums font-semibold text-text-main">{row.atp}</td>
                                                    <td className="px-3 py-2 text-right tabular-nums font-semibold text-red-700">
                                                        {missingQty > 0 ? missingQty : "—"}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-zinc-600">{fmtHsd(lineHsd)}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            className="ml-auto h-9 w-24 text-right tabular-nums"
                                                            value={Number.isFinite(row.approved) ? row.approved : 0}
                                                            onChange={(e) => {
                                                                const n = Number(e.target.value);
                                                                onChangeApproved(row.productId, Number.isFinite(n) ? Math.max(0, n) : 0);
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {row.short && sug != null && Number.isFinite(sug) && (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 text-[11px] border-red-200 text-red-700 hover:bg-red-50"
                                                                onClick={() => onApplySuggestion(row.productId)}
                                                            >
                                                                Áp dụng gợi ý ({sug})
                                                            </Button>
                                                        )}
                                                        {row.short && (
                                                            <p className="mt-1 text-[10px] font-semibold text-red-600">ATP &lt; yêu cầu</p>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {missingQty > 0 ? (
                                                            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-zinc-700">
                                                                <input
                                                                    type="checkbox"
                                                                    className="h-4 w-4 accent-amber-600"
                                                                    checked={selectedForProduction}
                                                                    onChange={(e) =>
                                                                        onToggleProductionRequest(row.productId, e.target.checked)
                                                                    }
                                                                />
                                                                <span className="font-medium">
                                                                    Yêu cầu Bếp sản xuất bù
                                                                </span>
                                                            </label>
                                                        ) : (
                                                            <span className="text-xs text-zinc-400">Không thiếu</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                                Đây là luồng partial fulfillment: đơn hiện tại vẫn duyệt theo tồn thực tế, còn yêu cầu sản xuất bù là
                                lệnh độc lập để bổ sung tồn cho các đơn sau.
                            </div>

                            {shortCount > 0 && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
                                    <p className="font-semibold">Cảnh báo</p>
                                    <p className="mt-0.5">
                                        Có {shortCount} dòng ATP thấp hơn số lượng yêu cầu. Kiểm tra gợi ý hoặc duyệt một phần; có thể cần{" "}
                                        <span className="font-bold">production_confirm</span> từ backend.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-gray-100 p-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isApproving || isRequestingProduction}>
                        Hủy
                    </Button>
                    {canShowKitchenBtn && (
                        <Button
                            type="button"
                            className="bg-indigo-600 font-semibold text-white hover:bg-indigo-700"
                            disabled={isLoading || isError || isRequestingProduction}
                            onClick={() => onRequestKitchenProduce(kitchenNote.trim() || undefined)}
                        >
                            {isRequestingProduction ? "Đang gửi…" : "Yêu cầu Bếp sản xuất"}
                        </Button>
                    )}
                    <Button type="button" onClick={onApprove} disabled={isLoading || isError || rows.length === 0 || isApproving}>
                        {isApproving ? "Đang duyệt…" : "Duyệt đơn"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
