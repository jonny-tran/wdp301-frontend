import { EyeIcon } from "@heroicons/react/24/outline";
import { OrderStatus } from "@/utils/enum";
import { formatAmount, formatDate, formatStatusLabel, getStatusBadgeClass } from "@/app/supply/_components/format";
import { OrderRow } from "./orders.types";

interface OrdersTableProps {
    orders: OrderRow[];
    rowStart: number;
    isLoading: boolean;
    isError: boolean;
    isMutating: boolean;
    onView: (orderId: string) => void;
    onApprove: (order: OrderRow) => void;
    onReject: (order: OrderRow) => void;
}

export default function OrdersTable({
    orders,
    rowStart,
    isLoading,
    isError,
    isMutating,
    onView,
    onApprove,
    onReject,
}: OrdersTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-text-muted">
                    <tr>
                        <th className="px-6 py-3">No.</th>
                        <th className="px-6 py-3">Store</th>
                        <th className="px-6 py-3">Delivery</th>
                        <th className="px-6 py-3 text-right">Total</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-sm text-text-muted">Loading orders...</td>
                        </tr>
                    ) : isError ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-sm text-red-500">Failed to load order list.</td>
                        </tr>
                    ) : orders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-sm text-text-muted">No orders match the current filters.</td>
                        </tr>
                    ) : (
                        orders.map((order, index) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-text-main">#{rowStart + index + 1}</p>
                                    <p className="text-xs text-text-muted">Created: {formatDate(order.createdAt)}</p>
                                </td>
                                <td className="px-6 py-4 text-text-main">{order.storeId}</td>
                                <td className="px-6 py-4 text-text-muted">{formatDate(order.deliveryDate)}</td>
                                <td className="px-6 py-4 text-right text-text-main">{formatAmount(order.totalAmount)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getStatusBadgeClass(order.status)}`}>
                                        {formatStatusLabel(order.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onView(order.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40 hover:text-primary"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                            View
                                        </button>

                                        {order.status === OrderStatus.PENDING && (
                                            <>
                                                <button
                                                    onClick={() => onApprove(order)}
                                                    disabled={isMutating}
                                                    className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => onReject(order)}
                                                    disabled={isMutating}
                                                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
