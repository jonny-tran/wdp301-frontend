
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Kitchen Inventory | VFC",
    description: "Real-time kitchen inventory and stock levels.",
};
import type { RawSearchParams } from "@/app/kitchen/_components/query";
import InventoryClient from "./_components/InventoryClient";
import InventorySkeleton from "./_components/InventorySkeleton";

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
