"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useOrder } from "@/hooks/useOrder";
import { useShipment } from "@/hooks/useShipment";
import { useClaim } from "@/hooks/useClaim";
import { ClaimStatus, OrderStatus, ShipmentStatus } from "@/utils/enum";
import DashboardKpiCard from "./DashboardKpiCard";
import DashboardQueueCard from "./DashboardQueueCard";
import { extractItems } from "./dashboard.mapper";

const QUERY = {
    page: 1,
    limit: 6,
    sortOrder: "DESC" as const,
};

export default function SupplyDashboardClient() {
    const { orderList } = useOrder();
    const { shipmentList } = useShipment();
    const { claimList } = useClaim();

    const pendingOrdersQuery = orderList({ ...QUERY, status: OrderStatus.PENDING });
    const inTransitShipmentsQuery = shipmentList({ ...QUERY, status: ShipmentStatus.IN_TRANSIT });
    const pendingClaimsQuery = claimList({ ...QUERY, status: ClaimStatus.PENDING });

    const pendingOrders = extractItems(pendingOrdersQuery.data);
    const inTransitShipments = extractItems(inTransitShipmentsQuery.data);
    const pendingClaims = extractItems(pendingClaimsQuery.data);

    const handleRefresh = () => {
        pendingOrdersQuery.refetch();
        inTransitShipmentsQuery.refetch();
        pendingClaimsQuery.refetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-black text-text-main">Supply Dashboard</h1>
                    <p className="text-sm text-text-muted">Backend-driven overview for orders, shipments, and claims.</p>
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
                <DashboardKpiCard label="Pending Orders" value={pendingOrders.length} href="/supply/orders" />
                <DashboardKpiCard label="In-Transit Shipments" value={inTransitShipments.length} href="/supply/delivery" />
                <DashboardKpiCard label="Pending Claims" value={pendingClaims.length} href="/supply/issues" />
            </div>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">Action Queue</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <DashboardQueueCard
                        title="Pending Orders"
                        rowLabel="Order"
                        href="/supply/orders"
                        isLoading={pendingOrdersQuery.isLoading}
                        isError={pendingOrdersQuery.isError}
                        loadingMessage="Loading..."
                        errorMessage="Failed to load order list."
                        emptyMessage="No pending orders."
                        items={pendingOrders}
                        renderSecondaryLine={(item) => `Store: ${String(item.storeName ?? item.storeId ?? "-")}`}
                        renderDateLine={() => "Delivery date"}
                        dateKey="deliveryDate"
                    />

                    <DashboardQueueCard
                        title="In-Transit Shipments"
                        rowLabel="Shipment"
                        href="/supply/delivery"
                        isLoading={inTransitShipmentsQuery.isLoading}
                        isError={inTransitShipmentsQuery.isError}
                        loadingMessage="Loading..."
                        errorMessage="Failed to load shipment list."
                        emptyMessage="No in-transit shipments."
                        items={inTransitShipments}
                        renderSecondaryLine={() => "Delivery in progress"}
                        renderDateLine={() => "Ship date"}
                        dateKey="shipDate"
                    />

                    <DashboardQueueCard
                        title="Pending Claims"
                        rowLabel="Claim"
                        href="/supply/issues"
                        isLoading={pendingClaimsQuery.isLoading}
                        isError={pendingClaimsQuery.isError}
                        loadingMessage="Loading..."
                        errorMessage="Failed to load claim list."
                        emptyMessage="No pending claims."
                        items={pendingClaims}
                        renderSecondaryLine={() => "Pending resolution"}
                        renderDateLine={() => "Created at"}
                        dateKey="createdAt"
                    />
                </div>
            </section>
        </div>
    );
}
