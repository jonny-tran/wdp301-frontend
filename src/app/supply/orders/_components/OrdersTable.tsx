import { EyeIcon } from "@heroicons/react/24/outline";
import { OrderStatus } from "@/utils/enum";
import { formatAmount, formatDate, formatStatusLabel, getStatusBadgeClass } from "@/app/supply/_components/format";
import { Order } from "@/types/order";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

interface OrdersTableProps {
    orders: Order[];
    rowStart: number;
    isLoading: boolean;
    isError: boolean;
    mutatingOrderId: string | null;
    onView: (orderId: string) => void;
    onApprove: (order: Order) => void;
    onReject: (order: Order) => void;
}

export default function OrdersTable({
    orders,
    rowStart,
    isLoading,
    isError,
    mutatingOrderId,
    onView,
    onApprove,
    onReject,
}: OrdersTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-text-muted">
                    <tr>
                        <th className="px-6 py-3">STT</th>
                        <th className="px-6 py-3">Cửa hàng</th>
                        <th className="px-6 py-3">Ngày giao</th>
                        <th className="px-6 py-3 text-right">Tổng cộng</th>
                        <th className="px-6 py-3 text-center">Trạng thái</th>
                        <th className="px-6 py-3 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-sm text-text-muted">Đang tải đơn hàng...</td>
                        </tr>
                    ) : isError ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-sm text-red-500">Không thể tải danh sách đơn hàng.</td>
                        </tr>
                    ) : orders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-sm text-text-muted">Không có đơn hàng nào khớp với bộ lọc.</td>
                        </tr>
                    ) : (
                        orders.map((order, index) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-text-main">#{rowStart + index + 1}</p>
                                    <p className="text-xs text-text-muted">Tạo lúc: {formatDate(order.createdAt)}</p>
                                </td>
                                <td className="px-6 py-4 text-text-main">{order.store?.name}</td>
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
                                            Xem
                                        </button>

                                        {order.status === OrderStatus.PENDING && (
                                            <>
                                                <Can I={P.ORDER_APPROVE} on={Resource.ORDER}>
                                                    <button
                                                        onClick={() => onApprove(order)}
                                                        disabled={!!mutatingOrderId && mutatingOrderId === order.id}
                                                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60"
                                                    >
                                                        {mutatingOrderId === order.id ? "..." : "Approve"}
                                                    </button>
                                                </Can>
                                                <Can I={P.ORDER_REJECT} on={Resource.ORDER}>
                                                    <button
                                                        onClick={() => onReject(order)}
                                                        disabled={!!mutatingOrderId && mutatingOrderId === order.id}
                                                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                                                    >
                                                        {mutatingOrderId === order.id ? "..." : "Reject"}
                                                    </button>
                                                </Can>
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
