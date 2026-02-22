
import { Suspense } from "react";
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
