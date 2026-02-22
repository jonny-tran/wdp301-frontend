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
import { countLowStock, extractItems } from "./dashboard.mapper";
import InventoryWatchlistCard from "./InventoryWatchlistCard";
import KitchenQuickActions from "./KitchenQuickActions";
import KitchenSummaryCard from "./KitchenSummaryCard";
import PickingQueueCard from "./PickingQueueCard";

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

    const pickingItems = extractItems(pickingTaskQuery.data);
    const kitchenItems = extractItems(kitchenSummaryQuery.data) as KitchSummary[];
    const batchItems = extractItems(batchesQuery.data);
    const receiptItems = extractItems(receiptsQuery.data);

    const quickActions = [
        { href: "/kitchen/inventory", label: "Inventory" },
        { href: "/kitchen/warehouse", label: "Warehouse" },
        { href: "/kitchen/batches", label: "Batches" },
        { href: "/kitchen/production-plan", label: "Ops Board" },
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
                    value={String(countLowStock(kitchenItems))}
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
