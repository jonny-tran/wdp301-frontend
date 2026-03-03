"use client";

import {
    ArchiveBoxIcon,
    ClipboardDocumentListIcon,
    ExclamationTriangleIcon,
    InboxArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useWarehouse } from "@/hooks/useWarehouse";
import { useInventory } from "@/hooks/useInventory";
import { useProduct } from "@/hooks/useProduct";
import { useInbound } from "@/hooks/useInbound";
import { ReceiptStatus } from "@/utils/enum";
import { KitchSummary } from "@/types/inventory";
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
    const { kitchenSummary } = useInventory();
    const { batchList } = useProduct();
    const { receiptList } = useInbound();

    const pickingTaskQuery = getPickingTaskList(DEFAULT_PAGE_QUERY);
    const kitchenSummaryQuery = kitchenSummary(DEFAULT_PAGE_QUERY);
    const batchesQuery = batchList(DEFAULT_PAGE_QUERY);
    const receiptsQuery = receiptList({ ...DEFAULT_PAGE_QUERY, status: ReceiptStatus.DRAFT });

    const pickingItems = pickingTaskQuery.data?.items || [];
    const kitchenItems = kitchenSummaryQuery.data?.items || [];
    const batchItems = batchesQuery.data?.items || [];
    const receiptItems = receiptsQuery.data?.items || [];

    const quickActions = [
        { href: "/kitchen/inventory", label: "Inventory", permission: { action: P.INVENTORY_READ_KITCHEN_SUMMARY, resource: Resource.INVENTORY } },
        { href: "/kitchen/warehouse", label: "Warehouse", permission: { action: P.WAREHOUSE_READ_TASKS, resource: Resource.WAREHOUSE } },
        { href: "/kitchen/batches", label: "Batches", permission: { action: P.INBOUND_READ_BATCH_LABEL, resource: Resource.INBOUND } },
        { href: "/kitchen/inbound", label: "Inbound", permission: { action: P.INBOUND_CREATE_RECEIPT, resource: Resource.INBOUND } },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <KitchenSummaryCard
                    icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
                    title="Picking Tasks"
                    value={String(pickingItems.length)}
                    hint="Approved orders waiting"
                />
                <KitchenSummaryCard
                    icon={<ArchiveBoxIcon className="h-5 w-5" />}
                    title="Active Batches"
                    value={String(batchItems.length)}
                    hint="From central warehouse"
                />
                <KitchenSummaryCard
                    icon={<ExclamationTriangleIcon className="h-5 w-5" />}
                    title="Low Stock"
                    value={String(kitchenItems.filter(item => item.isLowStock).length)}
                    hint="Require replenishment"
                />
                <KitchenSummaryCard
                    icon={<InboxArrowDownIcon className="h-5 w-5" />}
                    title="Draft Receipts"
                    value={String(receiptItems.length)}
                    hint="Inbound not completed"
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
