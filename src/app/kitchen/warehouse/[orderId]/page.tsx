import { Suspense } from "react";
import PickingClient from "./_components/PickingClient";
import PickingSkeleton from "./_components/PickingSkeleton";

export default async function PickingPage(props: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await props.params;
    return (
        <Suspense fallback={<PickingSkeleton />}>
            <PickingClient orderId={orderId} />
        </Suspense>
    );
}
