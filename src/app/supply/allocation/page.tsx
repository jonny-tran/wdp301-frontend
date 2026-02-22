import { Suspense } from "react";
import type { RawSearchParams } from "@/app/supply/_components/query";
import AllocationClient from "./_components/AllocationClient";
import AllocationSkeleton from "./_components/AllocationSkeleton";

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function SupplyAllocationPage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={<AllocationSkeleton />}>
            <AllocationClient searchParams={searchParams} />
        </Suspense>
    );
}
