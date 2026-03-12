"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useOrder } from "@/hooks/useOrder";
import { useShipment } from "@/hooks/useShipment";
import { useClaim } from "@/hooks/useClaim";
import { ClaimStatus, OrderStatus, ShipmentStatus } from "@/utils/enum";
import DashboardKpiCard from "./DashboardKpiCard";
import DashboardQueueCard from "./DashboardQueueCard";

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

    const pendingOrders = pendingOrdersQuery.data?.items || [];
    const inTransitShipments = inTransitShipmentsQuery.data?.items || [];
    const pendingClaims = pendingClaimsQuery.data?.items || [];

    const handleRefresh = () => {
        pendingOrdersQuery.refetch();
        inTransitShipmentsQuery.refetch();
        pendingClaimsQuery.refetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-black text-text-main">Bảng điều khiển cung ứng</h1>
                    <p className="text-sm text-text-muted">
                        Tổng quan các đơn hàng, vận chuyển và khiếu nại từ hệ thống.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-text-main hover:border-primary/50 hover:text-primary"
                >
                    <ArrowPathIcon className="h-4 w-4" />
                    Làm mới
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <DashboardKpiCard label="Đơn hàng chờ xử lý" value={pendingOrders.length} href="/supply/orders" />
                <DashboardKpiCard label="Đơn vận chuyển đang giao" value={inTransitShipments.length} href="/supply/delivery" />
                <DashboardKpiCard label="Khiếu nại đang chờ" value={pendingClaims.length} href="/supply/issues" />
            </div>

            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">
                        Hàng đợi xử lý
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <DashboardQueueCard
                        title="Đơn hàng chờ xử lý"
                        rowLabel="Đơn hàng"
                        href="/supply/orders"
                        isLoading={pendingOrdersQuery.isLoading}
                        isError={pendingOrdersQuery.isError}
                        loadingMessage="Đang tải..."
                        errorMessage="Không thể tải danh sách đơn hàng."
                        emptyMessage="Không có đơn hàng chờ xử lý."
                        items={pendingOrders as any[]}
                        renderSecondaryLine={(item) => `Cửa hàng: ${String(item.storeName ?? item.storeId ?? "-")}`}
                        renderDateLine={() => "Ngày giao hàng"}
                        dateKey="deliveryDate"
                    />

                    <DashboardQueueCard
                        title="Đơn vận chuyển đang giao"
                        rowLabel="Vận chuyển"
                        href="/supply/delivery"
                        isLoading={inTransitShipmentsQuery.isLoading}
                        isError={inTransitShipmentsQuery.isError}
                        loadingMessage="Đang tải..."
                        errorMessage="Không thể tải danh sách vận chuyển."
                        emptyMessage="Không có đơn vận chuyển đang giao."
                        items={inTransitShipments as any[]}
                        renderSecondaryLine={() => "Đang giao hàng"}
                        renderDateLine={() => "Ngày gửi"}
                        dateKey="shipDate"
                    />

                    <DashboardQueueCard
                        title="Khiếu nại đang chờ"
                        rowLabel="Khiếu nại"
                        href="/supply/issues"
                        isLoading={pendingClaimsQuery.isLoading}
                        isError={pendingClaimsQuery.isError}
                        loadingMessage="Đang tải..."
                        errorMessage="Không thể tải danh sách khiếu nại."
                        emptyMessage="Không có khiếu nại đang chờ."
                        items={pendingClaims as any[]}
                        renderSecondaryLine={() => "Đang chờ xử lý"}
                        renderDateLine={() => "Ngày tạo"}
                        dateKey="createdAt"
                    />
                </div>
            </section>
        </div>
    );
}