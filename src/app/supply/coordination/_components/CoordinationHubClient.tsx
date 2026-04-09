"use client";

import { useMemo, useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatStatusLabel, getStatusBadgeClass } from "@/app/supply/_components/format";
import type { Order, OrderDetail } from "@/types/order";
import { OrderStatus } from "@/utils/enum";
import InquiryModal from "./InquiryModal";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderRequest } from "@/apiRequest/order";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CoordinationBatchApproveSchema, CoordinationInquirySchema } from "@/schemas/coordination";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

function todayYmd(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function CoordinationHubClient() {
    const [deliveryDate, setDeliveryDate] = useState<string>(todayYmd());
    const [deliveryDateObj, setDeliveryDateObj] = useState<Date | undefined>(new Date());
    const [inquiryTarget, setInquiryTarget] = useState<{
        productId: number;
        productName: string;
        shortageQuantity: number;
    } | null>(null);

    const [allocationPercentage, setAllocationPercentage] = useState<number>(60);
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

    const { orderList } = useOrder();
    const queryClient = useQueryClient();

    // /orders list hiện không filter đúng theo deliveryDate khi dùng fromDate/toDate (BE đang dùng cho createdAt).
    // Coordination Hub cần lấy theo deliveryDate => FE lọc client-side từ list theo status.
    const pendingQuery = orderList({ page: 1, limit: 200, sortOrder: "DESC", status: OrderStatus.PENDING });
    const coordinatingQuery = orderList({ page: 1, limit: 200, sortOrder: "DESC", status: OrderStatus.COORDINATING });
    const waitingQuery = orderList({ page: 1, limit: 200, sortOrder: "DESC", status: OrderStatus.WAITING_FOR_PRODUCTION });

    const candidateOrders = useMemo(() => {
        const all = [
            ...(pendingQuery.data?.items ?? []),
            ...(coordinatingQuery.data?.items ?? []),
            ...(waitingQuery.data?.items ?? []),
        ] as Order[];
        return all.filter((o) => String(o.deliveryDate ?? "").slice(0, 10) === String(deliveryDate));
    }, [pendingQuery.data?.items, coordinatingQuery.data?.items, waitingQuery.data?.items, deliveryDate]);

    const summaryQuery = useQuery({
        queryKey: ["coordination-hub", "summary", deliveryDate],
        queryFn: async () => {
            const res = await orderRequest.getCoordinationSummary(deliveryDate);
            return res.data;
        },
        enabled: !!deliveryDate,
    });

    const inquiryMutation = useMutation({
        mutationFn: async (body: { deliveryDate: string; lines?: { productId: number; quantity: number }[]; note?: string }) => {
            const parsed = CoordinationInquirySchema.parse(body);
            const res = await orderRequest.createCoordinationInquiry(parsed);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã gửi Inquiry cho Bếp (đơn chuyển sang coordinating)");
            void queryClient.invalidateQueries({ queryKey: ["coordination-hub"] });
            void queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => handleErrorApi({ error }),
    });

    const batchApproveMutation = useMutation({
        mutationFn: async (body: unknown) => {
            const parsed = CoordinationBatchApproveSchema.parse(body);
            const res = await orderRequest.batchApproveCoordination(parsed as any);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã batch approve theo phân bổ");
            void queryClient.invalidateQueries({ queryKey: ["coordination-hub"] });
            void queryClient.invalidateQueries({ queryKey: ["orders"] });
            void queryClient.invalidateQueries({ queryKey: ["shipments"] });
        },
        onError: (error) => handleErrorApi({ error }),
    });

    const selectedCount = selectedOrderIds.length;

    const toggleSelect = (id: string, checked: boolean) => {
        setSelectedOrderIds((prev) => {
            if (checked) return prev.includes(id) ? prev : [...prev, id];
            return prev.filter((x) => x !== id);
        });
    };

    const selectAll = () => setSelectedOrderIds(candidateOrders.map((o) => o.id));
    const clearAll = () => setSelectedOrderIds([]);

    const canAllocate = selectedCount > 0 && allocationPercentage >= 0 && allocationPercentage <= 100;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                    <h1 className="text-3xl font-black tracking-tight text-text-main">Trung tâm điều phối</h1>
                    <p className="mt-1 text-base text-text-muted">
                        Xem tổng cầu theo ngày giao, gửi Inquiry cho Bếp, và duyệt hàng loạt theo phân bổ.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <label className="text-sm font-semibold text-text-main whitespace-nowrap">Ngày giao</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "h-11 w-full min-w-[220px] justify-start text-left text-sm font-semibold sm:w-[240px]",
                                    !deliveryDateObj && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {deliveryDateObj
                                    ? format(deliveryDateObj, "dd/MM/yyyy", { locale: vi })
                                    : "Chọn ngày giao"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto border border-zinc-200 bg-white p-0 text-zinc-900 shadow-xl"
                            align="end"
                        >
                            <Calendar
                                mode="single"
                                selected={deliveryDateObj}
                                onSelect={(date) => {
                                    if (!date) return;
                                    setDeliveryDateObj(date);
                                    const yyyy = date.getFullYear();
                                    const mm = String(date.getMonth() + 1).padStart(2, "0");
                                    const dd = String(date.getDate()).padStart(2, "0");
                                    setDeliveryDate(`${yyyy}-${mm}-${dd}`);
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button type="button" variant="outline" onClick={() => summaryQuery.refetch()}>
                        Làm mới
                    </Button>
                </div>
            </div>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="text-sm font-extrabold uppercase tracking-wide text-text-main">Tổng hợp tổng cầu</h2>
                    <span className="text-sm text-zinc-600">
                        {summaryQuery.isLoading
                            ? "Đang tải…"
                            : summaryQuery.isError
                              ? "Lỗi tải dữ liệu"
                              : `${summaryQuery.data?.items?.length ?? 0} dòng`}
                    </span>
                </div>

                {summaryQuery.isError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Không tải được summary. Kiểm tra API `GET /orders/coordination/summary?deliveryDate=YYYY-MM-DD`.
                    </div>
                )}

                <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full min-w-[920px] text-left text-sm">
                        <thead className="border-b border-gray-100 bg-zinc-50 text-[11px] font-extrabold uppercase tracking-wide text-zinc-600">
                            <tr>
                                <th className="px-3 py-2">Sản phẩm</th>
                                <th className="px-3 py-2 text-right">Tổng cầu</th>
                                <th className="px-3 py-2 text-right">Tồn kho trung tâm</th>
                                <th className="px-3 py-2 text-right">Chênh lệch</th>
                                <th className="px-3 py-2 w-[160px]">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(summaryQuery.data?.items ?? []).map((row: any) => {
                                const shortage = Number(row.shortage ?? 0);
                                const isShort = shortage > 0;
                                return (
                                    <tr key={row.productId} className={isShort ? "bg-amber-50/60" : "border-b border-gray-50"}>
                                        <td className="px-3 py-3 align-top">
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-text-main whitespace-normal break-words">
                                                    {row.productName ?? `SP #${row.productId}`}
                                                </div>
                                                <div className="mt-0.5 text-xs font-semibold text-zinc-500">#{row.productId}</div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-right align-top tabular-nums font-bold text-zinc-900">
                                            {row.totalDemand}
                                        </td>
                                        <td className="px-3 py-3 text-right align-top tabular-nums font-bold text-zinc-900">
                                            {row.atpAvailable}
                                        </td>
                                        <td className="px-3 py-3 text-right align-top tabular-nums font-black">
                                            {isShort ? (
                                                <span className="text-red-700">-{shortage}</span>
                                            ) : (
                                                <span className="text-emerald-700">OK</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 align-top">
                                            <Can I={P.ORDER_APPROVE} on={Resource.ORDER}>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    className="bg-violet-700 text-white hover:bg-violet-800"
                                                    disabled={!isShort}
                                                    onClick={() =>
                                                        setInquiryTarget({
                                                            productId: row.productId,
                                                            productName: row.productName ?? `SP #${row.productId}`,
                                                            shortageQuantity: shortage,
                                                        })
                                                    }
                                                >
                                                    Hỏi Bếp
                                                </Button>
                                            </Can>
                                        </td>
                                    </tr>
                                );
                            })}
                            {!summaryQuery.isLoading && (summaryQuery.data?.items?.length ?? 0) === 0 && (
                                <tr>
                                    <td className="px-3 py-10 text-center text-sm text-zinc-600" colSpan={5}>
                                        Chưa có dữ liệu để tổng hợp (không có đơn pending/coordinating trong ngày, hoặc chưa tải được kho bếp).
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
                    <span className="font-extrabold">Quy tắc:</span>{" "}
                    <span className="font-bold">No Backorders</span>. Khi chốt phân bổ (ví dụ 80%), phần còn thiếu bị hủy ngay và cần ghi log{" "}
                    <span className="font-mono text-[13px] font-bold">SHORTAGE_BY_COORDINATOR</span> ở BE. FEFO vẫn do BE xử lý khi thực xuất kho.
                </div>
            </section>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-sm font-extrabold uppercase tracking-wide text-text-main">Batch allocation</h2>
                        <p className="mt-1 text-base text-zinc-600">
                            Chọn các đơn của ngày {deliveryDate} và kéo % để “chia đều khó khăn”.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={selectAll} disabled={candidateOrders.length === 0}>
                            Chọn tất cả
                        </Button>
                        <Button type="button" variant="outline" onClick={clearAll} disabled={selectedCount === 0}>
                            Bỏ chọn
                        </Button>
                    </div>
                </div>

                <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_420px]">
                    <div className="overflow-x-auto rounded-2xl border border-gray-100">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead className="border-b border-gray-100 bg-zinc-50 text-[11px] font-extrabold uppercase tracking-wide text-zinc-600">
                                <tr>
                                    <th className="px-3 py-2 w-[56px]">Chọn</th>
                                    <th className="px-3 py-2">Order</th>
                                    <th className="px-3 py-2">Store</th>
                                    <th className="px-3 py-2">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(pendingQuery.isLoading || coordinatingQuery.isLoading || waitingQuery.isLoading) && (
                                    <tr>
                                        <td className="px-3 py-10 text-center text-sm text-zinc-600" colSpan={4}>
                                            Đang tải danh sách đơn…
                                        </td>
                                    </tr>
                                )}
                                {!(pendingQuery.isLoading || coordinatingQuery.isLoading || waitingQuery.isLoading) && candidateOrders.length === 0 && (
                                    <tr>
                                        <td className="px-3 py-10 text-center text-sm text-zinc-600" colSpan={4}>
                                            Không có đơn phù hợp (pending / coordinating / waiting_for_production) trong ngày.
                                        </td>
                                    </tr>
                                )}
                                {candidateOrders.map((o) => {
                                    const checked = selectedOrderIds.includes(o.id);
                                    return (
                                        <tr key={o.id} className="border-b border-gray-50">
                                            <td className="px-3 py-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 accent-violet-700"
                                                    checked={checked}
                                                    onChange={(e) => toggleSelect(o.id, e.target.checked)}
                                                />
                                            </td>
                                            <td className="px-3 py-3 align-top font-mono text-xs font-semibold text-zinc-800 break-all">{o.id}</td>
                                            <td className="px-3 py-3 align-top text-sm font-semibold text-zinc-900 whitespace-normal break-words">
                                                {o.store?.name ?? o.storeId ?? "—"}
                                            </td>
                                            <td className="px-3 py-3 align-top">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getStatusBadgeClass(
                                                        String(o.status ?? ""),
                                                    )}`}
                                                >
                                                    {formatStatusLabel(String(o.status ?? ""))}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5">
                        <p className="text-base font-extrabold text-zinc-900">Tỷ lệ phân bổ</p>
                        <p className="mt-1 text-sm text-zinc-600">
                            Công thức: quantity_approved = quantity_requested * (percentage / 100). (BE làm tròn theo rule)
                        </p>

                        <div className="mt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-zinc-700">%</span>
                                <span className="text-2xl font-black tabular-nums text-violet-700">{allocationPercentage}%</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={allocationPercentage}
                                onChange={(e) => setAllocationPercentage(Number(e.target.value))}
                                className="mt-2 w-full accent-violet-700"
                            />
                            <div className="mt-2 flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={allocationPercentage}
                                    onChange={(e) => setAllocationPercentage(Number(e.target.value))}
                                    className="h-10 w-[110px]"
                                />
                                <span className="text-sm text-zinc-600">
                                    Đã chọn: <span className="font-bold">{selectedCount}</span>
                                </span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Can I={P.ORDER_APPROVE} on={Resource.ORDER}>
                                <Button
                                    type="button"
                                    className="w-full bg-zinc-900 text-white hover:bg-zinc-800"
                                    disabled={!canAllocate || batchApproveMutation.isPending}
                                    onClick={async () => {
                                        try {
                                            const details = await Promise.all(
                                                selectedOrderIds.map(async (id) => {
                                                    const res = await orderRequest.getOrderDetail(id);
                                                    return res.data as unknown as OrderDetail;
                                                }),
                                            );
                                            const orderApprovals = details.map((d: any) => {
                                                const orderId = String(d.id);
                                                const items = (Array.isArray(d.items) ? d.items : []).map((it: any) => {
                                                    const requested = Number(it.quantityRequested ?? 0);
                                                    const approved = Math.min(
                                                        requested,
                                                        Math.floor((requested * allocationPercentage) / 100),
                                                    );
                                                    return {
                                                        orderItemId: String(it.id),
                                                        quantityApproved: approved,
                                                    };
                                                });
                                                return { orderId, items };
                                            });
                                            batchApproveMutation.mutate({ deliveryDate, orderApprovals });
                                        } catch (error) {
                                            handleErrorApi({ error });
                                        }
                                    }}
                                >
                                    {batchApproveMutation.isPending ? "Đang duyệt hàng loạt…" : "Batch Approve"}
                                </Button>
                            </Can>
                            <p className="mt-2 text-[11px] text-zinc-500">
                                API: `PATCH /orders/coordination/batch-approve` (transaction, FEFO, tạo shipment).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {inquiryTarget && (
                <InquiryModal
                    deliveryDate={deliveryDate}
                    line={{
                        productId: inquiryTarget.productId,
                        productName: inquiryTarget.productName,
                        quantity: inquiryTarget.shortageQuantity,
                    }}
                        isPending={inquiryMutation.isPending}
                    onClose={() => setInquiryTarget(null)}
                        onSubmit={(payload) =>
                            inquiryMutation.mutate(payload, {
                                onSuccess: () => setInquiryTarget(null),
                            })
                        }
                />
            )}
        </div>
    );
}

