"use client";

import { formatDateTime, formatStatusLabel } from "@/app/supply/_components/format";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useOrder } from "@/hooks/useOrder";
import { handleErrorApi } from "@/lib/errors";
import type { Order } from "@/types/order";
import { OrderStatus } from "@/utils/enum";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";

const LIST_QUERY = {
    page: 1,
    limit: 50,
    sortOrder: "DESC" as const,
    status: OrderStatus.WAITING_FOR_PRODUCTION,
};

export default function SupplyKitchenRequestsPanel() {
    const { orderList, kitchenProductionResponse } = useOrder();
    const q = orderList(LIST_QUERY);
    const items = q.data?.items ?? [];

    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<Order | null>(null);
    const [rejectNote, setRejectNote] = useState("");

    const pendingCount = items.length;

    const kpiPlaceholder = useMemo(
        () => [
            {
                label: "Đang chờ phản hồi",
                value: String(pendingCount),
                hint: "Đơn waiting_for_production",
            },
            {
                label: "Tỉ lệ chấp nhận (KPI)",
                value: "—",
                hint: "Cần endpoint analytics (accept/reject theo kỳ). Tạm theo dõi qua ghi chú đơn sau phản hồi.",
            },
            {
                label: "Từ chối (snapshot)",
                value: "—",
                hint: "Export log đơn hoặc báo cáo server để hội đồng đánh giá Bếp.",
            },
        ],
        [pendingCount],
    );

    const openReject = (o: Order) => {
        setRejectTarget(o);
        setRejectNote("");
        setRejectOpen(true);
    };

    const submitReject = async () => {
        if (!rejectTarget) return;
        try {
            await kitchenProductionResponse.mutateAsync({
                id: rejectTarget.id,
                action: "reject",
                note: rejectNote,
            });
            setRejectOpen(false);
            setRejectTarget(null);
            setRejectNote("");
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
                {kpiPlaceholder.map((k) => (
                    <div
                        key={k.label}
                        className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm"
                    >
                        <p className="text-[10px] font-black uppercase tracking-wide text-violet-700">{k.label}</p>
                        <p className="mt-2 text-2xl font-black tabular-nums text-zinc-900">{k.value}</p>
                        <p className="mt-1 text-xs text-zinc-500">{k.hint}</p>
                    </div>
                ))}
            </div>

            <p className="text-sm text-zinc-600">
                Yêu cầu từ Điều phối — xác nhận hoặc từ chối kèm lý do. Sau phản hồi, đơn trả về trạng thái{" "}
                <span className="font-semibold">pending</span> để SC xử lý tiếp.
            </p>

            {q.isLoading ? (
                <p className="text-sm text-zinc-500">Đang tải…</p>
            ) : q.isError ? (
                <p className="text-sm text-red-600">Không tải được danh sách.</p>
            ) : items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-500">
                    Không có yêu cầu nào đang chờ.
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-zinc-100 bg-amber-50/80 text-[10px] font-black uppercase tracking-wider text-zinc-600">
                            <tr>
                                <th className="px-4 py-3">Cửa hàng</th>
                                <th className="px-4 py-3">Ngày giao</th>
                                <th className="px-4 py-3">Trạng thái</th>
                                <th className="px-4 py-3">Ghi chú SC</th>
                                <th className="px-4 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((o) => (
                                <tr key={o.id} className="border-b border-zinc-50 hover:bg-amber-50/30">
                                    <td className="px-4 py-3 font-semibold text-zinc-900">{o.store?.name ?? o.storeId}</td>
                                    <td className="px-4 py-3 text-zinc-600">{formatDateTime(o.deliveryDate)}</td>
                                    <td className="px-4 py-3">
                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                                            {formatStatusLabel(o.status)}
                                        </span>
                                    </td>
                                    <td className="max-w-[220px] px-4 py-3 text-xs text-zinc-600">
                                        {o.note?.trim() || "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="h-8 gap-1 bg-emerald-600 font-bold text-white hover:bg-emerald-700"
                                                disabled={kitchenProductionResponse.isPending}
                                                onClick={() =>
                                                    void kitchenProductionResponse.mutateAsync({
                                                        id: o.id,
                                                        action: "accept",
                                                    })
                                                }
                                            >
                                                <Check className="size-4" />
                                                Xác nhận sản xuất
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                className="h-8 gap-1 font-bold"
                                                disabled={kitchenProductionResponse.isPending}
                                                onClick={() => openReject(o)}
                                            >
                                                <X className="size-4" />
                                                Từ chối
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Từ chối yêu cầu sản xuất</DialogTitle>
                        <DialogDescription>
                            Đơn: {rejectTarget?.store?.name ?? rejectTarget?.storeId}. Nhập lý do để Điều phối xử lý (cắt đơn / hủy).
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="Ví dụ: Hết nguyên liệu thô — máy hỏng…"
                        className="min-h-[100px]"
                    />
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setRejectOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={kitchenProductionResponse.isPending || rejectNote.trim().length < 2}
                            onClick={() => void submitReject()}
                        >
                            Gửi từ chối
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
