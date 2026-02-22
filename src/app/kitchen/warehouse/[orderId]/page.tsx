import { Suspense } from "react";
import PickingClient from "./_components/PickingClient";
import PickingSkeleton from "./_components/PickingSkeleton";

type Props = {
    params: { orderId: string };
};

export default function PickingPage(props: Props) {
    return (
        <Suspense fallback={<PickingSkeleton />}>
            <PickingClient orderId={props.params.orderId} />
        </Suspense>
    );
}
