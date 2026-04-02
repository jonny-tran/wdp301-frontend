"use client";

import {
    ArrowPathIcon,
    ClipboardDocumentCheckIcon,
    TruckIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";
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
    const allClaimsQuery = claimList({ page: 1, limit: 1, sortOrder: "DESC" });
    const completedOrdersQuery = orderList({ page: 1, limit: 1, sortOrder: "DESC", status: OrderStatus.COMPLETED });

    const pendingOrders = pendingOrdersQuery.data?.items || [];
    const inTransitShipments = inTransitShipmentsQuery.data?.items || [];
    const pendingClaims = pendingClaimsQuery.data?.items || [];

    const pendingOrdersTotal = pendingOrdersQuery.data?.meta?.totalItems ?? pendingOrders.length;
    const inTransitShipmentsTotal = inTransitShipmentsQuery.data?.meta?.totalItems ?? inTransitShipments.length;
    const pendingClaimsTotal = pendingClaimsQuery.data?.meta?.totalItems ?? pendingClaims.length;
    const allClaimsTotal = allClaimsQuery.data?.meta?.totalItems ?? 0;
    const completedOrdersTotal = completedOrdersQuery.data?.meta?.totalItems ?? 0;

    // Claim rate = pending claims / total claims (if there are any)
    const claimRate = allClaimsTotal > 0 ? Math.round((pendingClaimsTotal / allClaimsTotal) * 100) : 0;

    const handleRefresh = () => {
        pendingOrdersQuery.refetch();
        inTransitShipmentsQuery.refetch();
        pendingClaimsQuery.refetch();
        allClaimsQuery.refetch();
        completedOrdersQuery.refetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-black text-text-main">Bảng điều khiển</h1>
                    <p className="text-sm text-text-muted">Tổng quan đơn hàng, giao hàng và khiếu nại — dữ liệu realtime từ hệ thống.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-text-main shadow-sm transition hover:border-primary/50 hover:text-primary hover:shadow"
                >
                    <ArrowPathIcon className="h-4 w-4" />
                    Làm mới
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <DashboardKpiCard
                    label="Đơn chờ duyệt"
                    value={pendingOrdersTotal}
                    href="/supply/orders"
                    accentColor="amber"
                    icon={<ClipboardDocumentCheckIcon className="h-5 w-5" />}
                    subtitle="Đơn hàng cần xử lý"
                />
                <DashboardKpiCard
                    label="Đang vận chuyển"
                    value={inTransitShipmentsTotal}
                    href="/supply/delivery"
                    accentColor="blue"
                    icon={<TruckIcon className="h-5 w-5" />}
                    subtitle="Chuyến hàng trên đường"
                />
                <DashboardKpiCard
                    label="Khiếu nại chờ"
                    value={pendingClaimsTotal}
                    href="/supply/issues"
                    accentColor="red"
                    icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                    subtitle="Cần giải quyết"
                />
                <DashboardKpiCard
                    label="Tỷ lệ khiếu nại"
                    value={`${claimRate}%`}
                    href="/supply/issues"
                    accentColor="violet"
                    icon={<ChartBarIcon className="h-5 w-5" />}
                    subtitle={`${pendingClaimsTotal}/${allClaimsTotal} khiếu nại`}
                />
                <DashboardKpiCard
                    label="Đơn hoàn tất"
                    value={completedOrdersTotal}
                    href="/supply/orders?status=completed"
                    accentColor="green"
                    icon={<ClockIcon className="h-5 w-5" />}
                    subtitle="Tổng đơn đã hoàn thành"
                />
            </div>

            {/* Action Queue */}
            <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">Hàng đợi xử lý</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    <DashboardQueueCard
                        title="Đơn chờ duyệt"
                        rowLabel="Đơn hàng"
                        href="/supply/orders"
                        isLoading={pendingOrdersQuery.isLoading}
                        isError={pendingOrdersQuery.isError}
                        loadingMessage="Đang tải..."
                        errorMessage="Tải danh sách đơn hàng thất bại."
                        emptyMessage="Không có đơn hàng chờ duyệt."
                        items={pendingOrders as any[]}
                        renderSecondaryLine={(item) => `Cửa hàng: ${(item as any).store?.name ?? item.storeId ?? "—"}`}
                        renderDateLine={() => "Ngày giao"}
                        dateKey="deliveryDate"
                    />

                    <DashboardQueueCard
                        title="Đang vận chuyển"
                        rowLabel="Chuyến hàng"
                        href="/supply/delivery"
                        isLoading={inTransitShipmentsQuery.isLoading}
                        isError={inTransitShipmentsQuery.isError}
                        loadingMessage="Đang tải..."
                        errorMessage="Tải danh sách giao hàng thất bại."
                        emptyMessage="Không có chuyến hàng đang vận chuyển."
                        items={inTransitShipments as any[]}
                        renderSecondaryLine={() => "Đang giao hàng"}
                        renderDateLine={() => "Ngày gửi"}
                        dateKey="shipDate"
                    />

                    <DashboardQueueCard
                        title="Khiếu nại chờ"
                        rowLabel="Khiếu nại"
                        href="/supply/issues"
                        isLoading={pendingClaimsQuery.isLoading}
                        isError={pendingClaimsQuery.isError}
                        loadingMessage="Đang tải..."
                        errorMessage="Tải danh sách khiếu nại thất bại."
                        emptyMessage="Không có khiếu nại chờ xử lý."
                        items={pendingClaims as any[]}
                        renderSecondaryLine={() => "Chờ giải quyết"}
                        renderDateLine={() => "Ngày tạo"}
                        dateKey="createdAt"
                    />
                </div>
            </section>
        </div>
    );
}
