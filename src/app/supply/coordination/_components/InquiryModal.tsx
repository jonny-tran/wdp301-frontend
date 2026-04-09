"use client";

import { useMemo, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function InquiryModal({
    deliveryDate,
    line,
    isPending,
    onClose,
    onSubmit,
}: {
    deliveryDate: string;
    line: { productId: number; productName: string; quantity: number };
    isPending: boolean;
    onClose: () => void;
    onSubmit: (payload: { deliveryDate: string; lines?: { productId: number; quantity: number }[]; note?: string }) => void;
}) {
    const defaultQty = useMemo(() => (line.quantity > 0 ? line.quantity : 1), [line.quantity]);
    const [qty, setQty] = useState<number>(defaultQty);
    const [note, setNote] = useState<string>("");

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Hỏi Bếp (Inquiry)</h3>
                        <p className="mt-0.5 text-xs text-gray-500">
                            Gửi yêu cầu kiểm tra năng lực sản xuất bù trước khi ra quyết định phân bổ.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        title="Đóng"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    <div className="rounded-xl bg-violet-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-violet-700/70">Sản phẩm</p>
                        <p className="mt-1 text-sm font-bold text-violet-950">{line.productName}</p>
                        <p className="mt-0.5 text-xs text-violet-700">#{line.productId}</p>
                        {line.quantity > 0 && (
                            <p className="mt-2 text-xs text-violet-800">
                                Thiếu (shortage): <span className="font-black tabular-nums">{line.quantity}</span>
                            </p>
                        )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                                Số lượng cần sản xuất bù
                            </label>
                            <Input
                                type="number"
                                min={1}
                                step="any"
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                                className="h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-lg font-black tabular-nums text-gray-900"
                            />
                        </div>
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                            Nếu Bếp phản hồi “kịp/không kịp”, Coordinator sẽ chốt tỷ lệ phân bổ và duyệt hàng loạt (no backorder).
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-gray-700">Ghi chú</label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ví dụ: Ca sáng mai thiếu bun, cần bù trước 06:00…"
                            className="min-h-[96px] rounded-xl border-2 border-gray-200 bg-white text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            disabled={isPending || !Number.isFinite(qty) || qty <= 0}
                            onClick={() =>
                                onSubmit({
                                    deliveryDate,
                                    lines: [{ productId: line.productId, quantity: qty }],
                                    note: note.trim() || undefined,
                                })
                            }
                            className="rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-violet-800 disabled:opacity-60 transition"
                        >
                            {isPending ? "Đang gửi…" : "Gửi Inquiry"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

