import { Metadata } from "next";
import { Suspense } from "react";
import type { RawSearchParams } from "@/app/manager/_components/query";
import InventoryClient from "./_components/InventoryClient";
import InventorySkeleton from "./_components/InventorySkeleton";

export const metadata: Metadata = {
    title: "Manager Inventory | VFC",
    description: "Quản lý tồn kho, cảnh báo low-stock, hạn sử dụng và lãng phí.",
};

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function InventoryPage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={<InventorySkeleton />}>
            <InventoryClient searchParams={searchParams} />
        </Suspense>
    );
}
