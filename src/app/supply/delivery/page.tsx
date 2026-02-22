import { Suspense } from "react";
import type { RawSearchParams } from "@/app/supply/_components/query";
import DeliveryClient from "./_components/DeliveryClient";
import DeliverySkeleton from "./_components/DeliverySkeleton";

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function SupplyDeliveryPage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={<DeliverySkeleton />}>
            <DeliveryClient searchParams={searchParams} />
        </Suspense>
    );
}
