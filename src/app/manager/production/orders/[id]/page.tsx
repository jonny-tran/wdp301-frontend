import { Suspense } from "react";
import OrderDetailClient from "../_components/OrderDetailClient";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ManagerProductionOrderDetailPage(props: Props) {
    const { id } = await props.params;

    return (
        <Suspense
            fallback={
                <div className="p-12 text-center text-xs font-semibold text-slate-400">
                    Đang tải chi tiết lệnh...
                </div>
            }
        >
            <OrderDetailClient orderId={id} />
        </Suspense>
    );
}
