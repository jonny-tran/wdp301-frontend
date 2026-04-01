import { Suspense } from "react";
import type { RawSearchParams } from "@/app/manager/_components/query";
import OrdersClient from "./_components/OrdersClient";

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function ManagerProductionOrdersPage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense
            fallback={
                <div className="p-12 text-center text-xs font-semibold text-slate-400">
                    Đang tải lệnh sản xuất...
                </div>
            }
        >
            <OrdersClient searchParams={searchParams} />
        </Suspense>
    );
}
