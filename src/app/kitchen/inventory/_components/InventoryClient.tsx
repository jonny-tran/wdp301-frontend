"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { useInventory } from "@/hooks/useInventory";
import { createPaginationSearchParams, normalizeMeta, parseKitchenListQuery, RawSearchParams } from "@/app/kitchen/_components/query";
import InventoryBatchDetails from "./InventoryBatchDetails";
import InventoryBatchModal from "./InventoryBatchModal";
import { extractBatchItems, extractSummaryItems } from "./inventory.mapper";
import InventorySummaryTable from "./InventorySummaryTable";

interface InventoryClientProps {
    searchParams: RawSearchParams;
}

export default function InventoryClient({ searchParams }: InventoryClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();

    const parsedQuery = useMemo(
        () => parseKitchenListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const { kitchenSummary, kitchenDetails } = useInventory();

    const summaryQuery = kitchenSummary({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        search: parsedQuery.search,
        sortOrder: parsedQuery.sortOrder,
    });

    const summaryItems = useMemo(() => extractSummaryItems(summaryQuery.data), [summaryQuery.data]);
    const meta = useMemo(
        () => normalizeMeta((summaryQuery.data as { meta?: unknown } | undefined)?.meta, parsedQuery.page, parsedQuery.limit, summaryItems.length),
        [parsedQuery.limit, parsedQuery.page, summaryItems.length, summaryQuery.data],
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const selectedProduct = useMemo(() => {
        return summaryItems.find((item) => item.productId === selectedProductId);
    }, [selectedProductId, summaryItems]);

    const detailsQuery = kitchenDetails(selectedProductId ?? 0);
    const batches = useMemo(() => extractBatchItems(detailsQuery.data), [detailsQuery.data]);

    const filterConfig: FilterConfig[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Search by product name...",
            className: "md:col-span-2",
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
    ];

    const handlePageChange = (nextPage: number) => {
        const query = createPaginationSearchParams(searchParamsHook, nextPage);
        router.push(`${pathname}?${query}`);
    };

    const handleSelectProduct = (id: number) => {
        setSelectedProductId(id);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between px-2">
                <div>
                    <h1 className="text-3xl font-black text-text-main tracking-tight">Kitchen Inventory</h1>
                    <p className="text-sm text-text-muted">Live product-level stock from central kitchen.</p>
                </div>
            </div>

            <BaseFilter filters={filterConfig} />

            <div className="rounded-[2.5rem] border border-gray-100 bg-white shadow-xl overflow-hidden transition-all hover:shadow-2xl hover:border-primary/10">
                <div className="border-b border-gray-100 px-8 py-5 bg-gray-50/30">
                    <h2 className="text-sm font-black uppercase tracking-widest text-text-muted">Product Summary</h2>
                </div>

                <InventorySummaryTable
                    items={summaryItems}
                    selectedProductId={selectedProductId}
                    isLoading={summaryQuery.isLoading}
                    isError={summaryQuery.isError}
                    onSelect={handleSelectProduct}
                />

                <div className="border-t border-gray-100 px-8 py-5 bg-white">
                    <BasePagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={meta.totalItems}
                        itemsPerPage={meta.itemsPerPage}
                    />
                </div>
            </div>

            <InventoryBatchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productName={selectedProduct?.productName ?? "Product Details"}
                batches={batches}
                isLoading={detailsQuery.isLoading}
                isError={detailsQuery.isError}
            />
        </div>
    );
}