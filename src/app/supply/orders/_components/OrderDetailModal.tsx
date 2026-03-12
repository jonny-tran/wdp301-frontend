import { formatDateTime, formatStatusLabel } from "@/app/supply/_components/format";
import { OrderReview } from "@/types/order";

interface OrderDetailModalProps {
    orderNo?: number;
    onClose: () => void;
    isLoading: boolean;
    isDetailError: boolean;
    isReviewError: boolean;
    detailData: Record<string, any>;
    detailItemsCount: number;
    detailItems: any[];
    detailStoreName: string;
    reviewData: OrderReview;
}

export default function OrderDetailModal({
    orderNo,
    onClose,
    isLoading,
    isDetailError,
    isReviewError,
    detailData,
    detailItems,
    detailStoreName,
}: OrderDetailModalProps) {

    const status = detailData?.status;

    const statusColor =
        status === "approved"
            ? "bg-green-100 text-green-700"
            : status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Order {orderNo ? `#${orderNo}` : ""}
                        </h3>

                        <span
                            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor}`}
                        >
                            {formatStatusLabel(status)}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Đóng
                    </button>
                </div>

                {/* CONTENT */}
                {isLoading ? (
                    <div className="p-6 text-sm text-gray-500">Đang tải...</div>
                ) : isDetailError ? (
                    <div className="p-6 text-sm text-red-500">
                        Không tải được chi tiết đơn hàng
                    </div>
                ) : isReviewError ? (
                    <div className="p-6 text-sm text-red-500">
                        Không tải được dữ liệu đánh giá
                    </div>
                ) : (
                    <div className="grid grid-cols-5 gap-6 p-6">

                        {/* LEFT PANEL */}
                        <div className="col-span-2">

                            <div className="rounded-xl border p-4">
                                <h4 className="mb-3 text-xs font-semibold uppercase text-gray-500">
                                    ORDER INFO
                                </h4>

                                <div className="space-y-3 text-sm">

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Store</span>
                                        <span className="font-semibold text-gray-800">
                                            {detailStoreName}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Delivery</span>
                                        <span className="font-semibold text-gray-800">
                                            {formatDateTime(detailData.deliveryDate)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Priority</span>
                                        <span className="font-semibold text-gray-800 capitalize">
                                            {detailData.priority}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Total</span>
                                        <span className="font-semibold text-gray-800">
                                            {detailData.totalAmount}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Items</span>
                                        <span className="font-semibold text-gray-800">
                                            {detailItems.length}
                                        </span>
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* RIGHT PANEL */}
                        <div className="col-span-3 flex flex-col gap-4">

                            {/* PRODUCTS */}
                            <div>

                                <h4 className="mb-3 text-xs font-semibold uppercase text-gray-500">
                                    PRODUCTS
                                </h4>

                                <div className="space-y-3">

                                    {detailItems.map((item, index) => (
                                        <div
                                            key={item.id || index}
                                            className="flex items-center gap-4 rounded-xl border p-3"
                                        >

                                            {item.product?.imageUrl && (
                                                <img
                                                    src={item.product.imageUrl}
                                                    alt={item.product.name}
                                                    className="h-14 w-14 rounded-lg object-cover"
                                                />
                                            )}

                                            <div className="flex-1">

                                                <p className="text-sm font-semibold text-gray-900">
                                                    {item.product?.name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    SKU: {item.product?.sku}
                                                </p>

                                            </div>

                                            <div className="text-right text-sm">

                                                <p className="text-gray-600">
                                                    YC: {item.quantityRequested}
                                                </p>

                                                <p className="font-semibold text-green-600">
                                                    Duyệt: {item.quantityApproved}
                                                </p>

                                            </div>

                                        </div>
                                    ))}

                                </div>

                            </div>
                            {/* REJECT NOTE  */}
                            {detailData.note && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    <span className="font-semibold">Lý do:</span> {detailData.note}
                                </div>
                            )}

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}