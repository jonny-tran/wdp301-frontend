"use client";

import { CalendarDaysIcon, DocumentTextIcon, InboxArrowDownIcon } from "@heroicons/react/24/outline";
import InboundStatusBadge from "./InboundStatusBadge";
import { ReceiptStatus } from "@/utils/enum";

interface InboundHistoryColumnProps {
    receipts: Record<string, unknown>[];
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
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-700">
                        <InboxArrowDownIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-text-main">Lịch sử nhập</h3>
                    <InboundStatusBadge status={ReceiptStatus.COMPLETED} />
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-text-muted">
                        {receipts.length} gần đây
                    </span>
                </div>
                <p className="mt-1 text-sm text-text-muted">Phiếu đã chốt — xem lại mã lô & nhãn khi cần.</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <p className="animate-pulse text-sm font-medium text-text-muted">Đang tải lịch sử…</p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl bg-red-50 p-6 text-center">
                    <p className="text-sm font-bold text-red-600">Không tải được lịch sử nhập.</p>
                </div>
            ) : receipts.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-100 py-10 text-center">
                    <p className="text-sm font-medium text-text-muted italic">Chưa có phiếu hoàn tất gần đây.</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {receipts.map((receipt, index) => {
                        const id = String(receipt.receiptId ?? receipt.id ?? index);
                        const code = String(receipt.receiptCode ?? `REC-${index + 1}`);
                        const completedAt = receipt.completedAt as string | undefined;
                        return (
                            <li key={id}>
                                <button
                                    type="button"
                                    onClick={() => onSelect(id, code)}
                                    className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-left transition-all hover:border-emerald-300/60 hover:bg-white hover:shadow-md active:scale-[0.99]"
                                >
                                    <div className="rounded-xl bg-white p-2 text-gray-400 shadow-sm">
                                        <DocumentTextIcon className="h-6 w-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-text-main">
                                                #{id.slice(0, 8).toUpperCase()}
                                            </span>
                                            <InboundStatusBadge status={ReceiptStatus.COMPLETED} />
                                        </div>
                                        <p className="mt-1 truncate text-sm font-bold text-text-main">
                                            {String(receipt.supplierName ?? (receipt.supplier as { name?: string })?.name ?? "—")}
                                        </p>
                                        {completedAt && (
                                            <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-text-muted">
                                                <CalendarDaysIcon className="h-3.5 w-3.5" />
                                                {new Date(completedAt).toLocaleString("vi-VN")}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
