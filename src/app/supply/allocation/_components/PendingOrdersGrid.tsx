import { EyeIcon } from "@heroicons/react/24/outline";
import { formatDateTime, formatStatusLabel, getStatusBadgeClass } from "@/app/supply/_components/format";
import { OrderCard } from "./allocation.types";

interface PendingOrdersGridProps {
    orders: OrderCard[];
    rowStart: number;
    isLoading: boolean;
    isError: boolean;
    isMutating: boolean;
    onReview: (orderId: string) => void;
    onApprove: (orderId: string) => void;
    onReject: (orderId: string) => void;
}

export default function PendingOrdersGrid({
    orders,
    rowStart,
    isLoading,
    isError,
    isMutating,
    onReview,
    onApprove,
    onReject,
}: PendingOrdersGridProps) {
    if (isLoading) {
        return <p className="text-sm text-text-muted">Loading pending orders...</p>;
    }

    if (isError) {
        return <p className="text-sm text-red-500">Failed to load pending orders.</p>;
    }

    if (orders.length === 0) {
        return <p className="text-sm text-text-muted">No pending orders.</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            {orders.map((order, index) => (
                <article
                    key={order.id}
                    className="rounded-2xl border border-gray-100 p-4 transition hover:border-primary/30"
                >
                    <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-text-main">Order #{rowStart + index + 1}</p>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getStatusBadgeClass(order.status)}`}>
                            {formatStatusLabel(order.status)}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">Store: {order.storeId}</p>
                    <p className="text-xs text-text-muted">Delivery: {formatDateTime(order.deliveryDate)}</p>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <button
                            onClick={() => onReview(order.id)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40 hover:text-primary"
                        >
                            <EyeIcon className="h-4 w-4" />
                            Review
                        </button>
                        <button
                            onClick={() => onApprove(order.id)}
                            disabled={isMutating}
                            className="rounded-lg bg-green-600 px-2 py-1.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => onReject(order.id)}
                            disabled={isMutating}
                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                        >
                            Reject
                        </button>
                    </div>
                </article>
            ))}
        </div>
    );
}
