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
        { href: "/kitchen/inventory", label: "Kho hàng" },
        { href: "/kitchen/warehouse", label: "Nhà kho" },
        { href: "/kitchen/batches", label: "Lô hàng" },
        { href: "/kitchen/production-plan", label: "Bảng điều hành" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                    title="Sắp hết hàng"
                    value={String(countLowStock(kitchenItems))}
                    hint="Cần bổ sung hàng"
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
