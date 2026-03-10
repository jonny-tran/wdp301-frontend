import { Suspense } from "react";
import type { RawSearchParams } from "@/app/manager/_components/query";
import OrderClient from "./_components/OrderClient";
import OrderSkeleton from "./_components/OrderSkeleton";

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function OrderPage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={<OrderSkeleton />}>
            <OrderClient searchParams={searchParams} />
        </Suspense>
    );
}
