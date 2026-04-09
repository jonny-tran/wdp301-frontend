"use client";

import { formatDateTime, formatStatusLabel, getStatusBadgeClass } from "@/app/supply/_components/format";
import type { Order } from "@/types/order";

interface WaitingForKitchenOrdersSectionProps {
    orders: Order[];
    isLoading: boolean;
    isError: boolean;
}

/** Đơn `waiting_for_production` — SC biết đang chờ bếp, tránh thao tác trùng. */
export default function WaitingForKitchenOrdersSection({
    orders,
    isLoading,
    isError,
}: WaitingForKitchenOrdersSectionProps) {
    if (isLoading) {
        return (
            <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4">
                <p className="text-sm text-sky-900">Đang tải đơn chờ bếp…</p>
            </div>
        );
    }
    if (isError) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4">
                <p className="text-sm text-red-700">Không tải được danh sách đơn chờ bếp.</p>
            </div>
        );
    }
    if (orders.length === 0) return null;

    return (
        <section className="rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50/40 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-xs font-black uppercase tracking-wide text-sky-900">Chờ phản hồi Bếp</h2>
                <span className="rounded-full bg-sky-600 px-2.5 py-0.5 text-[10px] font-black text-white">{orders.length}</span>
            </div>
            <p className="mt-1 text-xs text-sky-800/90">
                Các đơn đã gửi &quot;Yêu cầu sản xuất thêm&quot;. Không duyệt / không hủy nhầm cho tới khi bếp phản hồi.
            </p>
            <ul className="mt-3 space-y-2">
                {orders.map((o) => (
                    <li
                        key={o.id}
                        className="rounded-xl border border-sky-100 bg-white/90 px-3 py-2 text-sm shadow-sm"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold text-text-main">{o.store?.name ?? o.storeId}</span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusBadgeClass(o.status)}`}
                            >
                                {formatStatusLabel(o.status)}
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs text-text-muted">Giao: {formatDateTime(o.deliveryDate)}</p>
                        {o.note?.trim() && (
                            <p className="mt-1 rounded-lg bg-amber-50 px-2 py-1 text-[11px] text-amber-900">
                                <span className="font-semibold">Ghi chú:</span> {o.note}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}
