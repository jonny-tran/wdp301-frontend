import { EyeIcon } from "@heroicons/react/24/outline";
import { formatDateTime, formatStatusLabel, getStatusBadgeClass } from "@/app/supply/_components/format";
import { Order } from "@/types/order";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

interface PendingOrdersGridProps {
    orders: Order[];
    rowStart: number;
    isLoading: boolean;
    isError: boolean;
    isMutating: boolean;
    isCheckingStock: boolean;
    orderCanFulfillMap: Map<string, boolean>;
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
    isCheckingStock,
    orderCanFulfillMap,
    onReview,
    onApprove,
    onReject,
}: PendingOrdersGridProps) {
    if (isLoading || isCheckingStock) {
        return (
            <div className="flex items-center gap-2 py-6">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-text-muted">Đang kiểm tra tồn kho...</p>
            </div>
        );
    }

    if (isError) {
        return <p className="text-sm text-red-500 py-4">Tải đơn hàng chờ thất bại.</p>;
    }

    if (orders.length === 0) {
        return (
            <div className="rounded-xl bg-gray-50 py-8 text-center">
                <p className="text-sm text-text-muted">Không có đơn hàng chờ xử lý.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3">
            {orders.map((order, index) => {
                const canFulfill = orderCanFulfillMap.get(order.id);
                const isPartialFulfill = canFulfill === false;

                return (
                    <article
                        key={order.id}
                        className={`rounded-2xl border p-4 transition hover:shadow-sm ${
                            isPartialFulfill
                                ? "border-orange-200 bg-orange-50/30"
                                : "border-gray-100 hover:border-primary/30"
                        }`}
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-text-main">Đơn hàng #{rowStart + index + 1}</p>
                                {isPartialFulfill && (
                                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-700">
                                        Thiếu tồn kho
                                    </span>
                                )}
                            </div>
                            <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getStatusBadgeClass(order.status)}`}>
                                {formatStatusLabel(order.status)}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-text-muted">Cửa hàng: {order.store?.name ?? order.storeId}</p>
                        <p className="text-xs text-text-muted">Ngày giao: {formatDateTime(order.deliveryDate)}</p>

                        {/* Stock availability indicator */}
                        {isPartialFulfill && (
                            <div className="mt-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700">
                                <span className="font-semibold">⚠ Gợi ý:</span> Tồn kho không đủ. Bạn có thể{" "}
                                <span className="font-semibold">ra lệnh sản xuất thêm</span> hoặc{" "}
                                <span className="font-semibold">duyệt giao một phần (Partial)</span>.
                            </div>
                        )}

                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <button
                                onClick={() => onReview(order.id)}
                                className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40 hover:text-primary transition"
                            >
                                <EyeIcon className="h-4 w-4" />
                                Xem xét
                            </button>
                            <Can I={P.ORDER_APPROVE} on={Resource.ORDER}>
                                {isPartialFulfill ? (
                                    <button
                                        onClick={() => onApprove(order.id)}
                                        disabled={isMutating}
                                        className="rounded-lg border-2 border-orange-300 bg-orange-50 px-2 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 disabled:opacity-60 transition"
                                        title="Duyệt giao một phần (Partial Fulfillment)"
                                    >
                                        Duyệt (Partial)
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onApprove(order.id)}
                                        disabled={isMutating}
                                        className="rounded-lg bg-green-600 px-2 py-1.5 text-xs font-bold text-white hover:bg-green-700 disabled:opacity-60 transition"
                                    >
                                        Duyệt
                                    </button>
                                )}
                            </Can>
                            <Can I={P.ORDER_REJECT} on={Resource.ORDER}>
                                <button
                                    onClick={() => onReject(order.id)}
                                    disabled={isMutating}
                                    className="rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-60 transition"
                                >
                                    Từ chối
                                </button>
                            </Can>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
