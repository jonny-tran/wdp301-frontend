"use client";

import { FormEvent, useState } from "react";
import { BanknotesIcon, TruckIcon, XMarkIcon } from "@heroicons/react/24/outline";

type ResolutionAction = "refund" | "reship";

interface ResolveClaimModalProps {
    claimNo?: number;
    status: "approved" | "rejected";
    note: string;
    isPending: boolean;
    onChangeStatus: (status: "approved" | "rejected") => void;
    onChangeNote: (note: string) => void;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function ResolveClaimModal({
    claimNo,
    status,
    note,
    isPending,
    onChangeStatus,
    onChangeNote,
    onClose,
    onSubmit,
}: ResolveClaimModalProps) {
    const title = claimNo ? `Giải quyết Khiếu nại #${claimNo}` : "Giải quyết Khiếu nại";
    const [resolutionAction, setResolutionAction] = useState<ResolutionAction>("refund");

    const handleActionSelect = (action: ResolutionAction) => {
        setResolutionAction(action);
        if (action === "refund") {
            onChangeStatus("approved");
        } else {
            // Re-ship = approved the claim and create re-shipment
            onChangeStatus("approved");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">{title}</h3>
                        <p className="mt-0.5 text-sm text-text-muted">Chọn phương án giải quyết cho khiếu nại này.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        title="Đóng"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <form className="p-6 space-y-5" onSubmit={onSubmit}>
                    {/* Resolution Options - Card Style */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-text-main">Phương án xử lý</label>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Option 1: Refund/Cancel */}
                            <button
                                type="button"
                                onClick={() => handleActionSelect("refund")}
                                className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all ${
                                    resolutionAction === "refund"
                                        ? "border-red-400 bg-red-50 shadow-sm"
                                        : "border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/50"
                                }`}
                            >
                                <div className={`rounded-xl p-3 ${resolutionAction === "refund" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500 group-hover:bg-red-100 group-hover:text-red-500"} transition`}>
                                    <BanknotesIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${resolutionAction === "refund" ? "text-red-700" : "text-text-main"}`}>Hoàn tiền / Hủy</p>
                                    <p className="mt-0.5 text-[11px] text-text-muted">Hoàn tiền cho cửa hàng hoặc hủy đơn khiếu nại</p>
                                </div>
                                {resolutionAction === "refund" && (
                                    <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-red-500" />
                                )}
                            </button>

                            {/* Option 2: Re-ship */}
                            <button
                                type="button"
                                onClick={() => handleActionSelect("reship")}
                                className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all ${
                                    resolutionAction === "reship"
                                        ? "border-blue-400 bg-blue-50 shadow-sm"
                                        : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50"
                                }`}
                            >
                                <div className={`rounded-xl p-3 ${resolutionAction === "reship" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-500"} transition`}>
                                    <TruckIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${resolutionAction === "reship" ? "text-blue-700" : "text-text-main"}`}>Giao bù</p>
                                    <p className="mt-0.5 text-[11px] text-text-muted">Tạo đơn hàng bù và giao lại cho cửa hàng</p>
                                </div>
                                {resolutionAction === "reship" && (
                                    <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-blue-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Reject option */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-text-main">Quyết định</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onChangeStatus("approved")}
                                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                                    status === "approved"
                                        ? "bg-green-600 text-white shadow-sm"
                                        : "border border-gray-200 text-text-muted hover:border-green-300"
                                }`}
                            >
                                ✓ Chấp nhận
                            </button>
                            <button
                                type="button"
                                onClick={() => onChangeStatus("rejected")}
                                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                                    status === "rejected"
                                        ? "bg-red-600 text-white shadow-sm"
                                        : "border border-gray-200 text-text-muted hover:border-red-300"
                                }`}
                            >
                                ✗ Từ chối
                            </button>
                        </div>
                    </div>

                    {/* Re-ship hint */}
                    {resolutionAction === "reship" && status === "approved" && (
                        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                            <p className="font-semibold">ℹ Giao bù</p>
                            <p className="mt-0.5 text-xs">Sau khi xác nhận, hệ thống sẽ tạo đơn hàng bù tự động. Bạn cần vào <span className="font-semibold">Đơn hàng</span> để theo dõi và phân bổ chuyến xe.</p>
                        </div>
                    )}

                    {/* Resolution Note */}
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-text-main">Ghi chú giải quyết</label>
                        <textarea
                            value={note}
                            onChange={(event) => onChangeNote(event.target.value)}
                            rows={3}
                            placeholder="Mô tả phương án xử lý (tùy chọn)..."
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-text-main hover:border-gray-300 hover:bg-gray-50 transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-dark disabled:opacity-60 transition"
                        >
                            {isPending ? "Đang xử lý..." : "Xác nhận giải quyết"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
