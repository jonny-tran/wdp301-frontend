"use client";

import { orderRequest } from "@/apiRequest/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOrder } from "@/hooks/useOrder";
import { useWarehouse } from "@/hooks/useWarehouse";
import { handleErrorApi } from "@/lib/errors";
import { formatWeightKg } from "@/lib/format-weight";
import { getProductWeightKgFromOrderProduct, getStoreRouteId } from "@/lib/order-display";
import type { OrderDetail } from "@/types/order";
import type { ManifestPickingListItem } from "@/types/warehouse";
import { QUERY_KEY } from "@/utils/constant";
import { OrderStatus } from "@/utils/enum";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

function pickShipmentId(o: { shipmentId?: string | null }): string | null {
    const s = o.shipmentId;
    if (s == null || String(s).trim() === "") return null;
    return String(s);
}

export default function ManifestConsolidatePanel() {
    const { orderList } = useOrder();
    const { vehicleList, consolidateManifest, manifestPickingList, verifyManifestItem, departManifest } = useWarehouse();

    const approvedQ = orderList({
        page: 1,
        limit: 80,
        sortOrder: "DESC",
        status: OrderStatus.APPROVED,
    });
    const vehiclesQ = vehicleList({ enabled: true });

    const [selected, setSelected] = useState<Set<string>>(() => new Set());
    const [vehicleId, setVehicleId] = useState<string>("");
    const [driverName, setDriverName] = useState("");
    const [driverPhone, setDriverPhone] = useState("");
    const [manifestId, setManifestId] = useState("");
    const [manifestOverloadWarning, setManifestOverloadWarning] = useState(false);
    const [scanByItemId, setScanByItemId] = useState<Record<string, string>>({});
    const [verifiedItemIds, setVerifiedItemIds] = useState<Set<string>>(() => new Set());

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

    const { totalKg, totalM3, routeId, routeConflict, detailsLoading } = useMemo(() => {
        let kg = 0;
        let m3 = 0;
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
                const v = Number(it.product?.volumeM3 ?? it.product?.volume_m3 ?? 0);
                kg += qty * w;
                m3 += qty * (Number.isFinite(v) && v > 0 ? v : 0);
            }
        });
        return { totalKg: kg, totalM3: m3, routeId: rid, routeConflict: conflict, detailsLoading: loading };
    }, [detailResults]);

    const vehicle = vehiclesQ.data?.find((v) => v.id === vehicleId);
    const cap = vehicle?.payloadCapacity ?? 0;
    const capM3 = vehicle?.payloadVolumeM3 ?? 0;
    const pctFilled = cap > 0 ? (totalKg / cap) * 100 : 0;
    const pctVolume = capM3 > 0 ? (totalM3 / capM3) * 100 : 0;
    const barWidth = cap > 0 ? Math.min(100, pctFilled) : 0;
    const overloadWeight = cap > 0 && totalKg > cap;
    const overloadVolume = capM3 > 0 && totalM3 > capM3;
    const overload = overloadWeight || overloadVolume;
    const noRoute = selectedArr.length > 0 && routeId == null;
    const canLoadManifest = manifestId.trim().length > 0;
    const manifestListQ = manifestPickingList(manifestId.trim(), { enabled: canLoadManifest });

    const groupedPicking = useMemo(() => {
        const rows = manifestListQ.data?.items ?? [];
        const map = new Map<string, ManifestPickingListItem>();
        rows.forEach((r) => {
            const key = `${String(r.productId ?? "")}::${r.productName}::${r.batchCode}`;
            if (!map.has(key)) {
                map.set(key, { ...r });
                return;
            }
            const prev = map.get(key)!;
            prev.requiredQty += Number(r.requiredQty ?? 0);
            prev.pickedQty = Number(prev.pickedQty ?? 0) + Number(r.pickedQty ?? 0);
            if (!prev.manifestItemId && r.manifestItemId) prev.manifestItemId = r.manifestItemId;
        });
        return [...map.values()];
    }, [manifestListQ.data?.items]);

    const canDepart = useMemo(() => {
        const rows = manifestListQ.data?.items ?? [];
        if (rows.length === 0) return false;
        return rows.every((r) => verifiedItemIds.has(String(r.manifestItemId)) || (r.actualBatchId != null && Number(r.actualBatchId) > 0));
    }, [manifestListQ.data?.items, verifiedItemIds]);

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
            const result = await consolidateManifest.mutateAsync({
                orderIds: selectedArr,
                vehicleId: vid as never,
                driverName: driverName.trim() || undefined,
                driverPhone: driverPhone.trim() || undefined,
            });
            setSelected(new Set());
            setVehicleId("");
            setDriverName("");
            setDriverPhone("");
            setManifestOverloadWarning(Boolean(result.overloadWarning));
            if (result.manifestId) {
                setManifestId(result.manifestId);
                setVerifiedItemIds(new Set());
                setScanByItemId({});
            }
        } catch {
            /* lỗi đã xử lý trong onError của mutation */
        }
    };

    const onVerifyItem = async (item: ManifestPickingListItem) => {
        const id = String(item.manifestItemId ?? "");
        const code = (scanByItemId[id] ?? item.qrCode ?? item.batchCode ?? "").trim();
        if (!manifestId.trim() || !id || !code) return;
        try {
            await verifyManifestItem.mutateAsync({
                manifestId: manifestId.trim(),
                body: { manifestItemId: id, batchCode: code },
            });
            setVerifiedItemIds((prev) => new Set(prev).add(id));
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    const onDepart = async () => {
        if (!manifestId.trim()) return;
        try {
            await departManifest.mutateAsync(manifestId.trim());
            void manifestListQ.refetch();
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    return (
        <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 to-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-black text-text-main">Gom chuyến (Manifest)</h2>
                    <p className="text-sm text-text-muted">
                        Chọn nhiều đơn <span className="font-semibold">đã duyệt</span>, cùng <span className="font-semibold">route</span>, chưa
                        gán shipment. So sánh tổng khối lượng + thể tích với tải trọng xe.
                    </p>
                </div>
            </div>

            {vehiclesQ.isError && (
                <p className="mt-3 text-xs text-amber-800">
                    Không tải được danh sách xe ({`GET ${"/vehicles?status=available"}`}). Kiểm tra Swagger / quyền — vẫn có thể thử gom nếu biết{" "}
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
                    <div className="space-y-2">
                        <Input
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                            placeholder="Tên tài xế (tuỳ chọn)"
                        />
                        <Input
                            value={driverPhone}
                            onChange={(e) => setDriverPhone(e.target.value)}
                            placeholder="SĐT tài xế (tuỳ chọn)"
                        />
                    </div>

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
                                        ? "Xe quá tải!"
                                        : "Đạt ngưỡng tải."
                                    : `≈ ${Math.round(pctFilled)}% payload`}
                            </p>
                        )}
                        <div className="mt-1 flex justify-between text-[10px] text-text-muted">
                            <span>Tổng thể tích: {totalM3.toLocaleString("vi-VN", { maximumFractionDigits: 3 })} m3</span>
                            {capM3 > 0 && (
                                <span>
                                    / {capM3.toLocaleString("vi-VN", { maximumFractionDigits: 3 })} m3 ({Math.round(pctVolume)}%)
                                </span>
                            )}
                        </div>
                    </div>

                    {routeConflict && (
                        <p className="text-xs font-semibold text-red-600">Cảnh báo: các đơn đã chọn không cùng tuyến (route).</p>
                    )}
                    {overload && (
                        <p className="text-xs font-semibold text-red-600">Xe quá tải!</p>
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

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-black uppercase tracking-wide text-text-main">Picking list gộp & Depart Manifest</h3>
                <p className="mt-1 text-xs text-text-muted">
                    Nhập Manifest ID để xem danh sách nhặt hàng gộp theo Product + Batch, quét đủ QR rồi xuất kho.
                </p>
                <div className="mt-3 flex gap-2">
                    <Input
                        value={manifestId}
                        onChange={(e) => setManifestId(e.target.value)}
                        placeholder="Nhập manifest id..."
                    />
                    <Button type="button" variant="outline" onClick={() => void manifestListQ.refetch()} disabled={!canLoadManifest}>
                        Tải
                    </Button>
                </div>

                <div className="mt-4 overflow-x-auto rounded-xl border border-gray-100">
                    {manifestOverloadWarning && (
                        <div className="m-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                            <AlertTriangle className="size-4" />
                            Cảnh báo tải trọng: Manifest vượt ngưỡng tải xe (overload_warning = true).
                        </div>
                    )}
                    <table className="w-full min-w-[860px] text-left text-sm">
                        <thead className="border-b border-gray-100 bg-zinc-50 text-[11px] font-extrabold uppercase tracking-wide text-zinc-600">
                            <tr>
                                <th className="px-3 py-2">Sản phẩm</th>
                                <th className="px-3 py-2">Batch</th>
                                <th className="px-3 py-2 text-right">SL cần nhặt</th>
                                <th className="px-3 py-2">QR Scan</th>
                                <th className="px-3 py-2 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {manifestListQ.isLoading && (
                                <tr>
                                    <td className="px-3 py-8 text-center text-zinc-500" colSpan={5}>
                                        Đang tải picking list...
                                    </td>
                                </tr>
                            )}
                            {!manifestListQ.isLoading && groupedPicking.length === 0 && (
                                <tr>
                                    <td className="px-3 py-8 text-center text-zinc-500" colSpan={5}>
                                        Chưa có dữ liệu picking list.
                                    </td>
                                </tr>
                            )}
                            {groupedPicking.map((r) => {
                                const itemId = String(r.manifestItemId ?? "");
                                const isVerified = verifiedItemIds.has(itemId) || (r.actualBatchId != null && Number(r.actualBatchId) > 0);
                                return (
                                    <tr key={`${r.productName}-${r.batchCode}-${itemId}`} className="border-b border-gray-50">
                                        <td className="px-3 py-2 font-semibold text-zinc-900">{r.productName}</td>
                                        <td className="px-3 py-2 font-mono text-xs">{r.batchCode}</td>
                                        <td className="px-3 py-2 text-right tabular-nums font-bold">
                                            {r.requiredQty} {r.unit ?? ""}
                                        </td>
                                        <td className="px-3 py-2">
                                            <Input
                                                value={scanByItemId[itemId] ?? ""}
                                                onChange={(e) =>
                                                    setScanByItemId((prev) => ({ ...prev, [itemId]: e.target.value }))
                                                }
                                                placeholder={r.qrCode || "Nhập mã QR batch"}
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant={isVerified ? "secondary" : "default"}
                                                disabled={isVerified || verifyManifestItem.isPending || !manifestId.trim() || !itemId}
                                                onClick={() => void onVerifyItem(r)}
                                            >
                                                {isVerified ? "Đã quét" : "Quét QR"}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-3 flex justify-end">
                    <Button
                        type="button"
                        className="bg-zinc-900 text-white hover:bg-zinc-800"
                        disabled={!canDepart || departManifest.isPending || !manifestId.trim()}
                        onClick={() => void onDepart()}
                    >
                        {departManifest.isPending ? "Đang xuất kho..." : "Xuất kho (Depart)"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
