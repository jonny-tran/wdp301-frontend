"use client";

import { orderRequest } from "@/apiRequest/order";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOrder } from "@/hooks/useOrder";
import { useWarehouse } from "@/hooks/useWarehouse";
import { formatWeightKg } from "@/lib/format-weight";
import { getProductWeightKgFromOrderProduct, getStoreRouteId } from "@/lib/order-display";
import type { OrderDetail } from "@/types/order";
import { QUERY_KEY } from "@/utils/constant";
import { OrderStatus } from "@/utils/enum";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

function pickShipmentId(o: { shipmentId?: string | null }): string | null {
    const s = o.shipmentId;
    if (s == null || String(s).trim() === "") return null;
    return String(s);
}

export default function ManifestConsolidatePanel() {
    const { orderList } = useOrder();
    const { vehicleList, consolidateManifest } = useWarehouse();

    const approvedQ = orderList({
        page: 1,
        limit: 80,
        sortOrder: "DESC",
        status: OrderStatus.APPROVED,
    });
    const vehiclesQ = vehicleList({ enabled: true });

    const [selected, setSelected] = useState<Set<string>>(() => new Set());
    const [vehicleId, setVehicleId] = useState<string>("");

    const candidates = useMemo(() => {
        const items = approvedQ.data?.items ?? [];
        return items.filter((o) => !pickShipmentId(o));
    }, [approvedQ.data]);

    const selectedArr = useMemo(() => [...selected], [selected]);

    const detailResults = useQueries({
        queries: selectedArr.map((id) => ({
            queryKey: QUERY_KEY.orders.detail(id),
            queryFn: async (): Promise<OrderDetail> => {
                const res = await orderRequest.getOrderDetail(id);
                return res.data as OrderDetail;
            },
            enabled: !!id,
            staleTime: 60_000,
        })),
    });

    const { totalKg, routeId, routeConflict, detailsLoading } = useMemo(() => {
        let kg = 0;
        let rid: string | null = null;
        let conflict = false;
        let loading = false;
        detailResults.forEach((q) => {
            if (q.isLoading) loading = true;
            const d = q.data;
            if (!d) return;
            const r = getStoreRouteId(d.store);
            if (rid == null && r) rid = r;
            else if (r && rid && r !== rid) conflict = true;
            for (const it of d.items ?? []) {
                const qty = Number(it.quantityApproved ?? it.quantityRequested ?? 0);
                const w = getProductWeightKgFromOrderProduct(it.product);
                kg += qty * w;
            }
        });
        return { totalKg: kg, routeId: rid, routeConflict: conflict, detailsLoading: loading };
    }, [detailResults]);

    const vehicle = vehiclesQ.data?.find((v) => v.id === vehicleId);
    const cap = vehicle?.payloadCapacity ?? 0;
    const pctFilled = cap > 0 ? (totalKg / cap) * 100 : 0;
    const barWidth = cap > 0 ? Math.min(100, pctFilled) : 0;
    const overload = cap > 0 && totalKg > cap;
    const noRoute = selectedArr.length > 0 && routeId == null;

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const submit = async () => {
        if (selectedArr.length === 0) return;
        if (!vehicleId) {
            toast.error("Chọn xe trước khi gom.");
            return;
        }
        if (routeConflict || noRoute || overload) {
            toast.error("Kiểm tra tuyến đường và tải trọng trước khi gửi.");
            return;
        }
        const vid = /^\d+$/.test(vehicleId) ? Number(vehicleId) : vehicleId;
        try {
            await consolidateManifest.mutateAsync({
                orderIds: selectedArr,
                vehicleId: vid as never,
            });
            setSelected(new Set());
            setVehicleId("");
        } catch {
            /* lỗi đã xử lý trong onError của mutation */
        }
    };

    return (
        <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-black text-text-main">Gom chuyến (Manifest)</h2>
                    <p className="text-sm text-text-muted">
                        Chọn nhiều đơn <span className="font-semibold">đã duyệt</span>, cùng <span className="font-semibold">route</span>, chưa
                        gán shipment. So sánh tổng khối lượng với <span className="font-semibold">payload</span> xe.
                    </p>
                </div>
            </div>

            {vehiclesQ.isError && (
                <p className="mt-3 text-xs text-amber-800">
                    Không tải được danh sách xe ({`GET ${"/warehouse/vehicles"}`}). Kiểm tra Swagger / quyền — vẫn có thể thử gom nếu biết{" "}
                    <code className="rounded bg-zinc-100 px-1">vehicleId</code>.
                </p>
            )}

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Đơn đủ điều kiện (ước lượng)</p>
                    {approvedQ.isLoading ? (
                        <p className="text-sm text-text-muted">Đang tải đơn…</p>
                    ) : candidates.length === 0 ? (
                        <p className="text-sm text-text-muted">Không có đơn approved chưa shipment.</p>
                    ) : (
                        <ul className="max-h-56 space-y-2 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2">
                            {candidates.map((o) => {
                                const checked = selected.has(o.id);
                                return (
                                    <li
                                        key={o.id}
                                        className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 hover:border-primary/20"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => toggle(o.id)}
                                            className="size-4 rounded border-gray-300"
                                            aria-label={`Chọn đơn ${o.id}`}
                                        />
                                        <div className="min-w-0 flex-1 text-sm">
                                            <p className="truncate font-semibold text-text-main">{o.store?.name ?? o.storeId}</p>
                                            <p className="text-xs text-text-muted">Đơn: {o.id.slice(0, 8)}…</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Xe</p>
                    <Select value={vehicleId} onValueChange={setVehicleId} disabled={vehiclesQ.isLoading}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={vehiclesQ.isLoading ? "Đang tải…" : "Chọn xe"} />
                        </SelectTrigger>
                        <SelectContent>
                            {(vehiclesQ.data ?? []).map((v) => (
                                <SelectItem key={v.id} value={v.id}>
                                    {v.plateNumber ?? v.name ?? v.id} — tải {formatWeightKg(v.payloadCapacity)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div>
                        <div className="flex justify-between text-xs text-text-muted">
                            <span>Tổng tải ước tính</span>
                            <span className="font-bold text-text-main">
                                {formatWeightKg(totalKg)}
                                {cap > 0 && (
                                    <>
                                        {" "}
                                        / {formatWeightKg(cap)}
                                        {detailsLoading && " (đang tính…)"}
                                    </>
                                )}
                            </span>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                                className={`h-full rounded-full transition-all ${overload ? "bg-red-500" : "bg-primary"}`}
                                style={{ width: `${barWidth}%` }}
                            />
                        </div>
                        {cap > 0 && (
                            <p className="mt-1 text-[10px] text-text-muted">
                                {pctFilled >= 100
                                    ? overload
                                        ? "Vượt tải — backend sẽ từ chối."
                                        : "Đạt ngưỡng tải."
                                    : `≈ ${Math.round(pctFilled)}% payload`}
                            </p>
                        )}
                    </div>

                    {routeConflict && (
                        <p className="text-xs font-semibold text-red-600">Cảnh báo: các đơn đã chọn không cùng tuyến (route).</p>
                    )}
                    {noRoute && !routeConflict && (
                        <p className="text-xs font-semibold text-amber-700">Cửa hàng chưa gán route — không thể gom theo nghiệp vụ.</p>
                    )}

                    <Button
                        type="button"
                        className="w-full"
                        disabled={
                            consolidateManifest.isPending ||
                            selectedArr.length === 0 ||
                            !vehicleId ||
                            overload ||
                            routeConflict ||
                            noRoute
                        }
                        onClick={() => void submit()}
                    >
                        {consolidateManifest.isPending ? "Đang gom…" : "Gom manifest"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
