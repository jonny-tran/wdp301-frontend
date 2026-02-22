import { Suspense } from "react";
import type { RawSearchParams } from "@/app/kitchen/_components/query";
import WarehouseClient from "./_components/WarehouseClient";
import WarehouseSkeleton from "./_components/WarehouseSkeleton";

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function WarehousePage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={<WarehouseSkeleton />}>
            <WarehouseClient searchParams={searchParams} />
        </Suspense>
    );
}