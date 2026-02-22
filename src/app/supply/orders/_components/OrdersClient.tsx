"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { useOrder } from "@/hooks/useOrder";
import { handleErrorApi } from "@/lib/errors";
import { OrderStatus } from "@/utils/enum";
import { createPaginationSearchParams, normalizeMeta, parseListQuery, RawSearchParams } from "@/app/supply/_components/query";
import { formatStatusLabel, getHttpErrorMessage, isForceApproveError } from "@/app/supply/_components/format";
import ForceApproveModal from "./ForceApproveModal";
import OrderDetailModal from "./OrderDetailModal";
import OrdersTable from "./OrdersTable";
import RejectOrderModal from "./RejectOrderModal";
import { normalizeOrders, normalizeReview } from "./orders.mapper";
import { OrderRow } from "./orders.types";

interface OrdersClientProps {
    searchParams: RawSearchParams;
}

export default function OrdersClient({ searchParams }: OrdersClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();
    const queryClient = useQueryClient();

    const parsedQuery = useMemo(
        () => parseListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const { orderList, orderDetail, reviewOrder, approveOrder, rejectOrder } = useOrder();

    const listQuery = orderList({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        sortOrder: parsedQuery.sortOrder,
        status: parsedQuery.status as OrderStatus | undefined,
        search: parsedQuery.search,
        storeId: parsedQuery.storeId,
        fromDate: parsedQuery.fromDate,
        toDate: parsedQuery.toDate,
    });

    const orders = useMemo(() => normalizeOrders(listQuery.data), [listQuery.data]);
    const meta = useMemo(
        () => normalizeMeta((listQuery.data as { meta?: unknown } | undefined)?.meta, parsedQuery.page, parsedQuery.limit, orders.length),
        [listQuery.data, orders.length, parsedQuery.limit, parsedQuery.page],
    );
    const rowStart = (meta.currentPage - 1) * meta.itemsPerPage;

    const statusSummary = useMemo(() => {
        const summary = {
            pending: 0,
            approved: 0,
            rejected: 0,
            other: 0,
        };

        orders.forEach((order) => {
            const status = order.status.toLowerCase();
            if (status === OrderStatus.PENDING) {
                summary.pending += 1;
            } else if (status === OrderStatus.APPROVED) {
                summary.approved += 1;
            } else if (status === OrderStatus.REJECTED) {
                summary.rejected += 1;
            } else {
                summary.other += 1;
            }
        });

        return summary;
    }, [orders]);

    const [detailTargetId, setDetailTargetId] = useState("");
    const [rejectTarget, setRejectTarget] = useState<OrderRow | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [forceTarget, setForceTarget] = useState<OrderRow | null>(null);
    const [forceMessage, setForceMessage] = useState("");

    const detailQuery = orderDetail(detailTargetId);
    const reviewQuery = reviewOrder(detailTargetId);
    const detailOrderNo = useMemo(() => {
        const index = orders.findIndex((order) => order.id === detailTargetId);
        return index >= 0 ? rowStart + index + 1 : undefined;
    }, [detailTargetId, orders, rowStart]);

    const filterConfig: FilterConfig[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Order ID...",
            className: "md:col-span-2",
        },
        {
            key: "status",
            label: "Status",
            type: "select",
            options: Object.values(OrderStatus).map((status) => ({
                label: formatStatusLabel(status),
                value: status,
            })),
        },
        {
            key: "limit",
            label: "Rows",
            type: "select",
            defaultValue: String(parsedQuery.limit),
            options: [
                { label: "10", value: "10" },
                { label: "20", value: "20" },
                { label: "50", value: "50" },
            ],
        },
        {
            key: "sortOrder",
            label: "Sort",
            type: "select",
            defaultValue: parsedQuery.sortOrder,
            options: [
                { label: "Newest", value: "DESC" },
                { label: "Oldest", value: "ASC" },
            ],
        },
        {
            key: "fromDate",
            label: "From",
            type: "date",
        },
        {
            key: "toDate",
            label: "To",
            type: "date",
        },
    ];

    const refreshData = () => {
        listQuery.refetch();
        if (detailTargetId) {
            detailQuery.refetch();
            reviewQuery.refetch();
        }
    };

    const handlePageChange = (nextPage: number) => {
        const query = createPaginationSearchParams(searchParamsHook, nextPage);
        router.push(`${pathname}?${query}`);
    };

    const invalidateOrderData = async (orderId: string) => {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["order-list"] }),
            queryClient.invalidateQueries({ queryKey: ["order-detail", orderId] }),
            queryClient.invalidateQueries({ queryKey: ["review-order", orderId] }),
        ]);
    };

    const handleApprove = async (order: OrderRow, force = false) => {
        try {
            await approveOrder.mutateAsync({
                id: order.id,
                data: force ? { force_approve: true } : {},
            });

            await invalidateOrderData(order.id);
            setForceTarget(null);
            setForceMessage("");
            if (detailTargetId === order.id) {
                setDetailTargetId("");
            }
        } catch (error) {
            if (!force && isForceApproveError(error)) {
                setForceTarget(order);
                setForceMessage(getHttpErrorMessage(error));
                return;
            }

            handleErrorApi({ error });
        }
    };

    const handleRejectSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!rejectTarget || !rejectReason.trim()) return;

        try {
            await rejectOrder.mutateAsync({
                id: rejectTarget.id,
                data: { reason: rejectReason.trim() },
            });

            await invalidateOrderData(rejectTarget.id);

            if (detailTargetId === rejectTarget.id) {
                setDetailTargetId("");
            }
            setRejectReason("");
            setRejectTarget(null);
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    const detailData = (detailQuery.data ?? {}) as Record<string, unknown>;
    const detailItems = Array.isArray(detailData.items) ? detailData.items : [];
    const detailStore = detailData.store as Record<string, unknown> | undefined;
    const reviewData = normalizeReview(reviewQuery.data);

    const isMutating = approveOrder.isPending || rejectOrder.isPending;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black text-text-main">Order Management</h1>
                    <p className="text-sm text-text-muted">Approve, reject, and track order status for the supply coordinator role.</p>
                </div>
                <button
                    onClick={refreshData}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-text-main hover:border-primary/50 hover:text-primary"
                >
                    <ArrowPathIcon className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-5">
                    <SummaryItem label="Total Records" value={meta.totalItems} tone="default" />
                    <SummaryItem label="Pending" value={statusSummary.pending} tone="amber" />
                    <SummaryItem label="Approved" value={statusSummary.approved} tone="green" />
                    <SummaryItem label="Rejected" value={statusSummary.rejected} tone="red" />
                    <SummaryItem label="Other" value={statusSummary.other} tone="default" />
                </div>
            </div>

            <BaseFilter filters={filterConfig} />

            <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                <OrdersTable
                    orders={orders}
                    rowStart={rowStart}
                    isLoading={listQuery.isLoading}
                    isError={listQuery.isError}
                    isMutating={isMutating}
                    onView={setDetailTargetId}
                    onApprove={(order) => handleApprove(order)}
                    onReject={setRejectTarget}
                />

                <div className="border-t border-gray-100 px-6 py-4">
                    <BasePagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={meta.totalItems}
                        itemsPerPage={meta.itemsPerPage}
                    />
                </div>
            </section>

            {detailTargetId && (
                <OrderDetailModal
                    orderNo={detailOrderNo}
                    onClose={() => setDetailTargetId("")}
                    isLoading={detailQuery.isLoading || reviewQuery.isLoading}
                    isDetailError={detailQuery.isError}
                    isReviewError={reviewQuery.isError}
                    detailData={detailData}
                    detailItemsCount={detailItems.length}
                    detailStoreName={String(detailStore?.name ?? detailData.storeId ?? "-")}
                    reviewData={reviewData}
                />
            )}

            {rejectTarget && (
                <RejectOrderModal
                    reason={rejectReason}
                    isPending={rejectOrder.isPending}
                    onChangeReason={setRejectReason}
                    onClose={() => {
                        setRejectTarget(null);
                        setRejectReason("");
                    }}
                    onSubmit={handleRejectSubmit}
                />
            )}

            {forceTarget && (
                <ForceApproveModal
                    message={forceMessage}
                    isPending={approveOrder.isPending}
                    onClose={() => {
                        setForceTarget(null);
                        setForceMessage("");
                    }}
                    onConfirm={() => handleApprove(forceTarget, true)}
                />
            )}
        </div>
    );
}

function SummaryItem({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: "default" | "amber" | "green" | "red";
}) {
    const toneClass =
        tone === "amber"
            ? "bg-amber-50 text-amber-700"
            : tone === "green"
                ? "bg-green-50 text-green-700"
                : tone === "red"
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-50 text-text-main";

    return (
        <div className="rounded-xl border border-gray-100 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
            <p className={`mt-2 inline-flex rounded-lg px-2.5 py-1 text-sm font-bold ${toneClass}`}>{value}</p>
        </div>
    );
}
