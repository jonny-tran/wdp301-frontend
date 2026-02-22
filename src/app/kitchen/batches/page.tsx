
import { Suspense } from "react";
import type { RawSearchParams } from "@/app/kitchen/_components/query";
import BatchesClient from "./_components/BatchesClient";
import BatchesSkeleton from "./_components/BatchesSkeleton";

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function BatchesPage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={<BatchesSkeleton />}>
            <BatchesClient searchParams={searchParams} />
        </Suspense>
    );
}
