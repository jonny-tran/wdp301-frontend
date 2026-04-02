"use client";

import { CalendarDaysIcon, CheckCircleIcon, TruckIcon } from "@heroicons/react/24/outline";
import InboundStatusBadge from "./InboundStatusBadge";
import { ReceiptStatus } from "@/utils/enum";
import { Receipt } from "@/types/inbound";

interface InboundHistoryColumnProps {
    receipts: Receipt[];
    isLoading: boolean;
    isError: boolean;
    onSelect: (receiptId: string, receiptCode: string) => void;
}

export default function InboundHistoryColumn({
    receipts,
    isLoading,
    isError,
    onSelect,
}: InboundHistoryColumnProps) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-zinc-100 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                        <CheckCircleIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-zinc-900">Lịch sử nhập hàng</h3>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 tabular-nums">
                                {receipts.length} gần đây
                            </span>
                        </div>
                        <p className="mt-0.5 text-sm text-zinc-500">
                            Phiếu đã chốt — xem lại mã lô & nhãn khi cần.
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
                            <span className="text-sm text-zinc-500">Đang tải lịch sử...</span>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="rounded-xl bg-red-50 p-6 text-center">
                        <p className="text-sm font-medium text-red-600">Không tải được lịch sử nhập hàng.</p>
                    </div>
                ) : receipts.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-zinc-200 py-12 text-center">
                        <CheckCircleIcon className="mx-auto h-8 w-8 text-zinc-300" />
                        <p className="mt-2 text-sm text-zinc-400">Chưa có phiếu hoàn tất gần đây.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {receipts.map((receipt, index) => {
                            const id = String(receipt.receiptId ?? receipt.id ?? index);
                            const code = receipt.receiptCode ?? `REC-${index + 1}`;
                            const supplierName = receipt.supplierName ?? receipt.supplier?.name ?? "—";
                            const completedAt = receipt.completedAt;

                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => onSelect(id, code)}
                                    className="flex w-full items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 text-left transition-all hover:border-emerald-200 hover:bg-white hover:shadow-sm"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-[11px] font-bold text-zinc-600">
                                                #{id.slice(0, 8).toUpperCase()}
                                            </span>
                                            <InboundStatusBadge status={ReceiptStatus.COMPLETED} />
                                        </div>
                                        <div className="mt-1.5 flex items-center gap-1.5 text-zinc-500">
                                            <TruckIcon className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate text-sm font-medium text-zinc-700">{supplierName}</span>
                                        </div>
                                        {completedAt && (
                                            <div className="mt-1 flex items-center gap-1.5 text-zinc-400">
                                                <CalendarDaysIcon className="h-3 w-3 shrink-0" />
                                                <span className="text-xs">Hoàn tất: {new Date(completedAt).toLocaleString("vi-VN")}</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
