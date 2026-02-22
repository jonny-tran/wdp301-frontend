import { Suspense } from "react";
import type { RawSearchParams } from "@/app/supply/_components/query";
import OrdersClient from "./_components/OrdersClient";
import OrdersSkeleton from "./_components/OrdersSkeleton";

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function SupplyOrdersPage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={<OrdersSkeleton />}>
            <OrdersClient searchParams={searchParams} />
        </Suspense>
    );
}
