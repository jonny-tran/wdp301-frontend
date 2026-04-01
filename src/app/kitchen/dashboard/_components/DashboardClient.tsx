"use client";

import {
    ArchiveBoxIcon,
    ClipboardDocumentListIcon,
    ExclamationTriangleIcon,
    InboxArrowDownIcon,
    ChartBarIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { isSameDay, parseISO } from "date-fns";
import { useMemo } from "react";
import { normalizeInventoryAgingReportFromApi } from "@/lib/kitchen-inventory-mapper";
import { useWarehouse } from "@/hooks/useWarehouse";
import { useInventory } from "@/hooks/useInventory";
import { useProduct } from "@/hooks/useProduct";
import { useInbound } from "@/hooks/useInbound";
import { useProduction } from "@/hooks/useProduction";
import { ReceiptStatus } from "@/utils/enum";
import InventoryWatchlistCard from "./InventoryWatchlistCard";
import KitchenQuickActions from "./KitchenQuickActions";
import KitchenSummaryCard from "./KitchenSummaryCard";
import PickingQueueCard from "./PickingQueueCard";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

const DEFAULT_PAGE_QUERY = {
    page: 1,
    limit: 5,
    sortOrder: "DESC" as const,
};

export default function DashboardClient() {
    const { getPickingTaskList } = useWarehouse();
    const { kitchenSummary, inventoryAgingReport } = useInventory();
    const { batchList } = useProduct();
    const { receiptList } = useInbound();
    const { productionOrders } = useProduction();

    const pickingTaskQuery = getPickingTaskList(DEFAULT_PAGE_QUERY);
    const kitchenSummaryQuery = kitchenSummary(DEFAULT_PAGE_QUERY);
    const batchesQuery = batchList(DEFAULT_PAGE_QUERY);
    const receiptsQuery = receiptList({ ...DEFAULT_PAGE_QUERY, status: ReceiptStatus.DRAFT });
    const prodTodayQuery = productionOrders({ page: 1, limit: 200, sortOrder: "DESC" });
    const agingQuery = inventoryAgingReport({ daysThreshold: 14 });

    const pickingItems = pickingTaskQuery.data?.items || [];
    const kitchenItems = kitchenSummaryQuery.data?.items || [];
    const batchItems = batchesQuery.data?.items || [];
    const receiptItems = receiptsQuery.data?.items || [];

    const now = new Date();
    const prodItems = prodTodayQuery.data?.items ?? [];
    const todayProd = prodItems.filter((o) => {
        try {
            return isSameDay(parseISO(o.createdAt), now);
        } catch {
            return false;
        }
    });
    const plannedToday = todayProd
        .filter((o) => {
            const u = String(o.status).toUpperCase();
            return u === "PENDING" || u === "IN_PROGRESS";
        })
        .reduce((s, o) => s + o.targetQuantity, 0);
    const completedToday = todayProd
        .filter((o) => String(o.status).toUpperCase() === "COMPLETED")
        .reduce((s, o) => s + (o.actualQuantity ?? 0), 0);

    const agingRows = useMemo(() => normalizeInventoryAgingReportFromApi(agingQuery.data), [agingQuery.data]);
    const expiring48hCount = useMemo(() => {
        if (agingQuery.isError) return null;
        return agingRows.filter((row) => row.daysUntilExpiry >= 0 && row.daysUntilExpiry <= 2).length;
    }, [agingRows, agingQuery.isError]);

    const quickActions = [
        { href: "/kitchen/inventory", label: "Inventory", permission: { action: P.INVENTORY_READ_KITCHEN_SUMMARY, resource: Resource.INVENTORY } },
        { href: "/kitchen/warehouse", label: "Warehouse", permission: { action: P.WAREHOUSE_READ_TASKS, resource: Resource.WAREHOUSE } },
        { href: "/kitchen/batches", label: "Batches", permission: { action: P.INBOUND_READ_BATCH_LABEL, resource: Resource.INBOUND } },
        { href: "/kitchen/inbound", label: "Inbound", permission: { action: P.INBOUND_CREATE_RECEIPT, resource: Resource.INBOUND } },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <KitchenSummaryCard
                    icon={<ChartBarIcon className="h-5 w-5" />}
                    title="Mục tiêu SX hôm nay"
                    value={`${Math.round(completedToday * 100) / 100} / ${Math.round(plannedToday * 100) / 100}`}
                    hint="Hoàn tất (actual) so với lệnh còn chờ + đang chạy (planned)"
                    emphasis
                />
                <KitchenSummaryCard
                    icon={<ClockIcon className="h-5 w-5 text-amber-600" />}
                    title="Sắp hết hạn (48h)"
                    value={agingQuery.isError ? "—" : String(expiring48hCount ?? 0)}
                    hint={
                        agingQuery.isLoading
                            ? "Đang tải aging…"
                            : agingQuery.isError
                              ? "Không tải được báo cáo aging"
                              : "Lô còn ≤ 2 ngày theo calendar (ước lượng 48h)"
                    }
                    emphasis
                />
                <KitchenSummaryCard
                    icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
                    title="Tác vụ lấy hàng"
                    value={String(pickingItems.length)}
                    hint="Đơn hàng đã duyệt đang chờ"
                />
                <KitchenSummaryCard
                    icon={<ArchiveBoxIcon className="h-5 w-5" />}
                    title="Lô hàng đang hoạt động"
                    value={String(batchItems.length)}
                    hint="Từ kho trung tâm"
                />
                <KitchenSummaryCard
                    icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                    title="Low Stock"
                    value={String(kitchenItems.filter(item => item.isLowStock).length)}
                    hint="Require replenishment"
                />
                <KitchenSummaryCard
                    icon={<InboxArrowDownIcon className="h-5 w-5" />}
                    title="Phiếu nháp"
                    value={String(receiptItems.length)}
                    hint="Nhập kho chưa hoàn tất"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                <PickingQueueCard
                    isLoading={pickingTaskQuery.isLoading}
                    isError={pickingTaskQuery.isError}
                    tasks={pickingItems}
                />

                <div className="xl:col-span-2 space-y-6">
                    <InventoryWatchlistCard
                        isLoading={kitchenSummaryQuery.isLoading}
                        isError={kitchenSummaryQuery.isError}
                        items={kitchenItems}
                    />

                    <KitchenQuickActions links={quickActions} />
                </div>
            </div>
        </div>
    );
}
