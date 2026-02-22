"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { useShipment } from "@/hooks/useShipment";
import { createPaginationSearchParams, normalizeMeta, parseListQuery, RawSearchParams } from "@/app/supply/_components/query";
import { formatStatusLabel } from "@/app/supply/_components/format";
import { ShipmentStatus } from "@/utils/enum";
import DeliveryTable from "./DeliveryTable";
import PickingDetailModal from "./PickingDetailModal";
import { extractShipments, normalizePicking } from "./delivery.mapper";

interface DeliveryClientProps {
    searchParams: RawSearchParams;
}

export default function DeliveryClient({ searchParams }: DeliveryClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();

    const parsedQuery = useMemo(
        () => parseListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const { shipmentList, shipmentPickingList } = useShipment();

    const shipmentQuery = shipmentList({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        sortOrder: parsedQuery.sortOrder,
        status: parsedQuery.status as ShipmentStatus | undefined,
        search: parsedQuery.search,
        storeId: parsedQuery.storeId,
        fromDate: parsedQuery.fromDate,
        toDate: parsedQuery.toDate,
    });

    const shipments = useMemo(() => extractShipments(shipmentQuery.data), [shipmentQuery.data]);
    const meta = useMemo(
        () => normalizeMeta((shipmentQuery.data as { meta?: unknown } | undefined)?.meta, parsedQuery.page, parsedQuery.limit, shipments.length),
        [parsedQuery.limit, parsedQuery.page, shipmentQuery.data, shipments.length],
    );
    const rowStart = (meta.currentPage - 1) * meta.itemsPerPage;

    const [detailTargetId, setDetailTargetId] = useState("");
    const pickingQuery = shipmentPickingList(detailTargetId);
    const pickingData = normalizePicking(pickingQuery.data);
    const detailShipmentNo = useMemo(() => {
        const index = shipments.findIndex((shipment) => shipment.id === detailTargetId);
        return index >= 0 ? rowStart + index + 1 : undefined;
    }, [detailTargetId, rowStart, shipments]);

    const shipmentSummary = useMemo(() => {
        const summary = {
            inTransit: 0,
            completed: 0,
            other: 0,
        };

        shipments.forEach((item) => {
            const status = String(item.status ?? "").toLowerCase();
            if (status === ShipmentStatus.IN_TRANSIT) {
                summary.inTransit += 1;
            } else if (status === ShipmentStatus.COMPLETED || status === ShipmentStatus.DELIVERED) {
                summary.completed += 1;
            } else {
                summary.other += 1;
            }
        });

        return summary;
    }, [shipments]);

    const filterConfig: FilterConfig[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Shipment ID / Order ID...",
            className: "md:col-span-2",
        },
        {
            key: "status",
            label: "Status",
            type: "select",
            options: Object.values(ShipmentStatus).map((status) => ({
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

    const handlePageChange = (nextPage: number) => {
        const query = createPaginationSearchParams(searchParamsHook, nextPage);
        router.push(`${pathname}?${query}`);
    };

    const handleRefresh = () => {
        shipmentQuery.refetch();
        if (detailTargetId) {
            pickingQuery.refetch();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black text-text-main">Delivery</h1>
                    <p className="text-sm text-text-muted">Track shipment status and picking lists from backend data.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-text-main hover:border-primary/50 hover:text-primary"
                >
                    <ArrowPathIcon className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <CounterBox label="Total Shipments" value={meta.totalItems} tone="default" />
                <CounterBox label="In transit" value={shipmentSummary.inTransit} tone="blue" />
                <CounterBox label="Completed/Delivered" value={shipmentSummary.completed} tone="green" />
            </div>

            <BaseFilter filters={filterConfig} />

            <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                <DeliveryTable
                    shipments={shipments}
                    rowStart={rowStart}
                    isLoading={shipmentQuery.isLoading}
                    isError={shipmentQuery.isError}
                    onOpenPicking={setDetailTargetId}
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
                <PickingDetailModal
                    shipmentNo={detailShipmentNo}
                    onClose={() => setDetailTargetId("")}
                    isLoading={pickingQuery.isLoading}
                    isError={pickingQuery.isError}
                    pickingData={pickingData}
                />
            )}
        </div>
    );
}

function CounterBox({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: "default" | "green" | "blue";
}) {
    const toneClass =
        tone === "green"
            ? "bg-green-50 text-green-700"
            : tone === "blue"
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-50 text-text-main";

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
            <p className={`mt-2 inline-flex rounded-lg px-2.5 py-1 text-sm font-bold ${toneClass}`}>{value}</p>
        </div>
    );
}
