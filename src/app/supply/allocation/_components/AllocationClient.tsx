"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";

import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { useOrder } from "@/hooks/useOrder";
import { useShipment } from "@/hooks/useShipment";
import { handleErrorApi } from "@/lib/errors";

import {
  createPaginationSearchParams,
  normalizeMeta,
  parseListQuery,
  RawSearchParams,
} from "@/app/supply/_components/query";
import {
  formatDateTime,
  formatStatusLabel,
  getHttpErrorMessage,
  getStatusBadgeClass,
  isForceApproveError,
} from "@/app/supply/_components/format";
import { OrderStatus } from "@/utils/enum";

import AllocationReviewModal from "./AllocationReviewModal";
import ForceApproveAllocationModal from "./ForceApproveAllocationModal";
import PendingOrdersGrid from "./PendingOrdersGrid";
import RejectAllocationModal from "./RejectAllocationModal";
import { extractOrders, extractShipments } from "./allocation.mapper";
import { ReviewItem } from "./allocation.types";

interface AllocationClientProps {
  searchParams: RawSearchParams;
}

export default function AllocationClient({ searchParams }: AllocationClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();
  const queryClient = useQueryClient();

  const parsedQuery = useMemo(
    () => parseListQuery(searchParams, { page: 1, limit: 5, sortOrder: "DESC" }),
    [searchParams]
  );

  const { orderList, reviewOrder, approveOrder, rejectOrder } = useOrder();
  const { shipmentList } = useShipment();

  const pendingQuery = orderList({
    page: parsedQuery.page,
    limit: parsedQuery.limit,
    sortOrder: parsedQuery.sortOrder,
    status: OrderStatus.PENDING,
    search: parsedQuery.search,
    fromDate: parsedQuery.fromDate,
    toDate: parsedQuery.toDate,
    storeId: parsedQuery.storeId,
  });

  const approvedQuery = orderList({
    page: 1,
    limit: 5,
    sortOrder: "DESC",
    status: OrderStatus.APPROVED,
    search: parsedQuery.search,
    fromDate: parsedQuery.fromDate,
    toDate: parsedQuery.toDate,
    storeId: parsedQuery.storeId,
  });

  const shipmentQuery = shipmentList({
    page: 1,
    limit: 5,
    sortOrder: "DESC",
    search: parsedQuery.search,
    fromDate: parsedQuery.fromDate,
    toDate: parsedQuery.toDate,
    storeId: parsedQuery.storeId,
  });

  const pendingOrders = useMemo(() => extractOrders(pendingQuery.data), [pendingQuery.data]);
  const approvedOrders = useMemo(() => extractOrders(approvedQuery.data), [approvedQuery.data]);
  const shipments = useMemo(() => extractShipments(shipmentQuery.data), [shipmentQuery.data]);

  const pendingMeta = useMemo(
    () =>
      normalizeMeta(
        (pendingQuery.data as { meta?: unknown } | undefined)?.meta,
        parsedQuery.page,
        parsedQuery.limit,
        pendingOrders.length
      ),
    [parsedQuery.limit, parsedQuery.page, pendingOrders.length, pendingQuery.data]
  );

  const pendingRowStart = (pendingMeta.currentPage - 1) * pendingMeta.itemsPerPage;

  const [reviewTargetId, setReviewTargetId] = useState("");
  const [rejectTargetId, setRejectTargetId] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [forceTargetId, setForceTargetId] = useState("");
  const [forceMessage, setForceMessage] = useState("");

  const findPendingOrderNo = (orderId: string): number | undefined => {
    const index = pendingOrders.findIndex((order) => order.id === orderId);
    return index >= 0 ? pendingRowStart + index + 1 : undefined;
  };

  const reviewOrderNo = reviewTargetId ? findPendingOrderNo(reviewTargetId) : undefined;
  const rejectOrderNo = rejectTargetId ? findPendingOrderNo(rejectTargetId) : undefined;
  const forceOrderNo = forceTargetId ? findPendingOrderNo(forceTargetId) : undefined;

  const reviewQuery = reviewOrder(reviewTargetId);
  const reviewData = (reviewQuery.data ?? { items: [] }) as {
    orderId?: string;
    storeName?: string;
    status?: string;
    items?: ReviewItem[];
  };
  const reviewItems = Array.isArray(reviewData.items) ? reviewData.items : [];

  const activityItems = useMemo(() => {
    const approvedActivity = approvedOrders.map((order, index) => ({
      key: `approved-${order.id}`,
      title: `Order #${index + 1} approved`,
      subtitle: `Store: ${order.storeId}`,
      status: formatStatusLabel(order.status),
      statusClass: getStatusBadgeClass(order.status),
      time: order.deliveryDate,
    }));

    const shipmentActivity = shipments.map((shipment, index) => ({
      key: `shipment-${shipment.id}`,
      title: `Shipment #${index + 1} update`,
      subtitle: shipment.orderId ? "Linked order: Available" : "Linked order: Not available",
      status: formatStatusLabel(String(shipment.status ?? "")),
      statusClass: getStatusBadgeClass(String(shipment.status ?? "")),
      time: shipment.shipDate,
    }));

    const parseTime = (value?: string) => {
      if (!value) return 0;
      const timestamp = new Date(value).getTime();
      return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    return [...approvedActivity, ...shipmentActivity]
      .sort((a, b) => parseTime(b.time) - parseTime(a.time))
      .slice(0, 12);
  }, [approvedOrders, shipments]);

  const filterConfig: FilterConfig[] = [
    {
      key: "search",
      label: "Search",
      type: "text",
      placeholder: "Order ID...",
      className: "md:col-span-2",
    },
    {
      key: "limit",
      label: "Rows",
      type: "select",
      defaultValue: String(parsedQuery.limit),
      options: [
        { label: "5", value: "5" },
        { label: "10", value: "10" },
        { label: "20", value: "20" },
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
    { key: "fromDate", label: "From", type: "date" },
    { key: "toDate", label: "To", type: "date" },
  ];

  const refreshAll = () => {
    pendingQuery.refetch();
    approvedQuery.refetch();
    shipmentQuery.refetch();
    if (reviewTargetId) reviewQuery.refetch();
  };

  const handlePageChange = (nextPage: number) => {
    const query = createPaginationSearchParams(searchParamsHook, nextPage);
    router.push(`${pathname}?${query}`);
  };

  const invalidateOrders = async (orderId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["order-list"] }),
      queryClient.invalidateQueries({ queryKey: ["review-order", orderId] }),
      queryClient.invalidateQueries({ queryKey: ["shipment-list"] }),
    ]);
  };

  const approve = async (orderId: string, force = false) => {
    try {
      await approveOrder.mutateAsync({
        id: orderId,
        data: force ? { force_approve: true } : {},
      });

      await invalidateOrders(orderId);

      if (reviewTargetId === orderId) setReviewTargetId("");
      setForceTargetId("");
      setForceMessage("");
    } catch (error) {
      if (!force && isForceApproveError(error)) {
        setForceTargetId(orderId);
        setForceMessage(getHttpErrorMessage(error));
        return;
      }
      handleErrorApi({ error });
    }
  };

  const submitReject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rejectTargetId || !rejectReason.trim()) return;

    try {
      await rejectOrder.mutateAsync({
        id: rejectTargetId,
        data: { reason: rejectReason.trim() },
      });

      await invalidateOrders(rejectTargetId);

      if (reviewTargetId === rejectTargetId) setReviewTargetId("");
      setRejectTargetId("");
      setRejectReason("");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const isMutating = approveOrder.isPending || rejectOrder.isPending;
  const isRefreshing =
    pendingQuery.isFetching || approvedQuery.isFetching || shipmentQuery.isFetching || reviewQuery.isFetching;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-text-main">Allocation</h1>
          <p className="text-sm text-text-muted">
            Review pending orders, verify fulfillment, and monitor shipments.
          </p>
        </div>

        <button
          onClick={refreshAll}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-text-main hover:border-primary/50 hover:text-primary disabled:opacity-60"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <MiniKpi label="Pending" value={pendingOrders.length} tone="amber" />
        <MiniKpi label="Approved" value={approvedOrders.length} tone="green" />
        <MiniKpi label="Shipments" value={shipments.length} tone="default" />
      </div>

      <BaseFilter filters={filterConfig} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <header className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wide text-text-muted">
              Orders Awaiting Decision
            </h2>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase text-amber-700">
              {pendingOrders.length}
            </span>
          </header>

          <div className="mt-3">
            <PendingOrdersGrid
              orders={pendingOrders}
              rowStart={pendingRowStart}
              isLoading={pendingQuery.isLoading}
              isError={pendingQuery.isError}
              isMutating={isMutating}
              onReview={setReviewTargetId}
              onApprove={(orderId) => approve(orderId)}
              onReject={setRejectTargetId}
            />
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <BasePagination
              currentPage={pendingMeta.currentPage}
              totalPages={pendingMeta.totalPages}
              onPageChange={handlePageChange}
              totalItems={pendingMeta.totalItems}
              itemsPerPage={pendingMeta.itemsPerPage}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wide text-text-muted">Activity</h3>
            <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">
              {activityItems.length}
            </span>
          </div>

          <div className="mt-3">
            {approvedQuery.isLoading && shipmentQuery.isLoading ? (
              <p className="text-sm text-text-muted">Loading activity...</p>
            ) : approvedQuery.isError && shipmentQuery.isError ? (
              <p className="text-sm text-red-500">Failed to load activity.</p>
            ) : activityItems.length === 0 ? (
              <p className="text-sm text-text-muted">No activity yet.</p>
            ) : (
              <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
                {activityItems.map((item) => (
                  <div key={item.key} className="rounded-xl border border-gray-100 p-3">
                    <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
                      <p className="truncate text-sm font-semibold text-text-main">
                        {item.title}
                        <span className="ml-2 text-xs font-normal text-text-muted">{item.subtitle}</span>
                      </p>
                      <p className="text-xs text-text-muted">Time: {formatDateTime(item.time)}</p>
                      <span className={`inline-flex w-fit rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modals */}
      {reviewTargetId && (
        <AllocationReviewModal
          orderNo={reviewOrderNo}
          storeName={reviewData.storeName}
          status={reviewData.status}
          reviewItems={reviewItems}
          isLoading={reviewQuery.isLoading}
          isError={reviewQuery.isError}
          onClose={() => setReviewTargetId("")}
        />
      )}

      {rejectTargetId && (
        <RejectAllocationModal
          orderNo={rejectOrderNo}
          reason={rejectReason}
          isPending={rejectOrder.isPending}
          onChangeReason={setRejectReason}
          onClose={() => {
            setRejectTargetId("");
            setRejectReason("");
          }}
          onSubmit={submitReject}
        />
      )}

      {forceTargetId && (
        <ForceApproveAllocationModal
          orderNo={forceOrderNo}
          message={forceMessage}
          isPending={approveOrder.isPending}
          onClose={() => {
            setForceTargetId("");
            setForceMessage("");
          }}
          onConfirm={() => approve(forceTargetId, true)}
        />
      )}
    </div>
  );
}

function MiniKpi({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "default" | "amber" | "green";
}) {
  const toneClass =
    tone === "amber"
      ? "bg-amber-50 text-amber-700"
      : tone === "green"
      ? "bg-green-50 text-green-700"
      : "bg-gray-50 text-text-main";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <p className={`mt-2 inline-flex rounded-lg px-2.5 py-1 text-sm font-bold ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}
