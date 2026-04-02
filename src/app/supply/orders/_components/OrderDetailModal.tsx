import { formatDateTime, formatStatusLabel } from "@/app/supply/_components/format";
import { OrderReview, OrderReviewItem } from "@/types/order";

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
    onRequestProduction?: (productId: number, productName: string, shortageQty: number) => void;
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
    reviewData,
    onRequestProduction,
}: OrderDetailModalProps) {

    const status = detailData?.status;

    const statusColor =
        status === "approved"
            ? "bg-green-100 text-green-700"
            : status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700";

    // Build a map productId -> reviewItem for quick lookup
    const reviewMap = new Map<number, OrderReviewItem>();
    if (reviewData?.items) {
        reviewData.items.forEach((ri) => reviewMap.set(ri.productId, ri));
    }

    // Calculate overall fulfillment summary
    const totalReviewItems = reviewData?.items?.length ?? 0;
    const fulfillableCount = reviewData?.items?.filter((ri) => ri.canFulfill).length ?? 0;
    const fulfillPercent = totalReviewItems > 0 ? Math.round((fulfillableCount / totalReviewItems) * 100) : 0;
    const allCanFulfill = totalReviewItems > 0 && fulfillableCount === totalReviewItems;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b px-6 py-4 flex-shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Đơn hàng {orderNo ? `#${orderNo}` : ""}
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
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center gap-2 p-6">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span className="text-sm text-gray-500">Đang tải...</span>
                        </div>
                    ) : isDetailError ? (
                        <div className="p-6 text-sm text-red-500">
                            Không tải được chi tiết đơn hàng
                        </div>
                    ) : isReviewError ? (
                        <div className="p-6 text-sm text-red-500">
                            Không tải được dữ liệu đánh giá tồn kho
                        </div>
                    ) : (
                        <div className="grid grid-cols-5 gap-6 p-6">

                            {/* LEFT PANEL — Order Info + Review Summary */}
                            <div className="col-span-2 space-y-4">

                                {/* Order Info */}
                                <div className="rounded-xl border p-4">
                                    <h4 className="mb-3 text-xs font-semibold uppercase text-gray-500">
                                        THÔNG TIN ĐƠN HÀNG
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Cửa hàng</span>
                                            <span className="font-semibold text-gray-800">
                                                {detailStoreName}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Ngày giao</span>
                                            <span className="font-semibold text-gray-800">
                                                {formatDateTime(detailData.deliveryDate)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Ưu tiên</span>
                                            <span className="font-semibold text-gray-800 capitalize">
                                                {detailData.priority === "high" ? "Cao" : detailData.priority === "low" ? "Thấp" : detailData.priority ?? "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Số sản phẩm</span>
                                            <span className="font-semibold text-gray-800">
                                                {detailItems.length}
                                            </span>
                                        </div>
                                        {detailData.consolidationGroupId && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Nhóm gom đơn</span>
                                                <span className="font-mono text-xs font-semibold text-violet-700">
                                                    {String(detailData.consolidationGroupId).slice(0, 8).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* REVIEW SUMMARY — Stock availability for Coordinator */}
                                {totalReviewItems > 0 && (
                                    <div className={`rounded-xl border-2 p-4 ${
                                        allCanFulfill
                                            ? "border-green-200 bg-green-50/50"
                                            : "border-orange-300 bg-orange-50/50"
                                    }`}>
                                        <h4 className="mb-3 text-xs font-semibold uppercase text-gray-500">
                                            ĐÁNH GIÁ TỒN KHO
                                        </h4>

                                        {/* Overall fulfillment badge */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-600">Khả năng đáp ứng</span>
                                            <div className={`rounded-lg px-3 py-1.5 text-center ${
                                                allCanFulfill
                                                    ? "bg-green-100"
                                                    : fulfillPercent >= 50
                                                        ? "bg-amber-100"
                                                        : "bg-red-100"
                                            }`}>
                                                <span className={`text-xl font-black tabular-nums ${
                                                    allCanFulfill
                                                        ? "text-green-700"
                                                        : fulfillPercent >= 50
                                                            ? "text-amber-700"
                                                            : "text-red-700"
                                                }`}>
                                                    {fulfillPercent}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                                                <span>Mặt hàng đủ tồn kho</span>
                                                <span className="font-bold text-gray-700">{fulfillableCount}/{totalReviewItems}</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        allCanFulfill ? "bg-green-500" : fulfillPercent >= 50 ? "bg-amber-500" : "bg-red-500"
                                                    }`}
                                                    style={{ width: `${Math.min(fulfillPercent, 100)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Verdict */}
                                        {allCanFulfill ? (
                                            <div className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-xs text-green-800">
                                                <span className="text-base">✅</span>
                                                <span className="font-semibold">Đủ tồn kho — Có thể duyệt đơn hàng này.</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2 rounded-lg bg-orange-100 px-3 py-2 text-xs text-orange-800">
                                                    <span className="text-base mt-0.5">⚠️</span>
                                                    <div>
                                                        <p className="font-semibold">Không đủ tồn kho để duyệt toàn bộ.</p>
                                                        <p className="mt-0.5 text-orange-600">
                                                            Thiếu {totalReviewItems - fulfillableCount} mặt hàng. Bạn có thể:
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="rounded-lg border border-orange-200 bg-white px-3 py-2 text-xs text-gray-600 space-y-1">
                                                    <p>• <span className="font-semibold text-amber-700">Yêu cầu sản xuất</span> — gửi lệnh tới bếp (nút bên phải)</p>
                                                    <p>• <span className="font-semibold text-red-600">Từ chối</span> — đóng tab, bấm nút "Từ chối"</p>
                                                    <p>• <span className="font-semibold text-blue-600">Phê duyệt bắt buộc</span> — duyệt giao một phần</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT PANEL — Products with Review Data */}
                            <div className="col-span-3 flex flex-col gap-4">

                                <div>
                                    <h4 className="mb-3 text-xs font-semibold uppercase text-gray-500">
                                        DANH SÁCH SẢN PHẨM
                                    </h4>

                                    <div className="space-y-3">
                                        {detailItems.map((item, index) => {
                                            const productId = item.productId ?? item.product?.id;
                                            const reviewItem = productId ? reviewMap.get(Number(productId)) : undefined;
                                            const productName = item.product?.name ?? reviewItem?.productName ?? "—";
                                            const requestedQty = Number(item.quantityRequested ?? reviewItem?.requestedQty ?? 0);
                                            const currentStock = reviewItem?.currentStock ?? 0;
                                            const shortage = reviewItem && !reviewItem.canFulfill
                                                ? Math.max(0, requestedQty - currentStock)
                                                : 0;

                                            return (
                                                <div
                                                    key={item.id || index}
                                                    className={`rounded-xl border p-3 transition ${
                                                        reviewItem && !reviewItem.canFulfill
                                                            ? "border-orange-200 bg-orange-50/30"
                                                            : "border-gray-100"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {item.product?.imageUrl && (
                                                            <img
                                                                src={item.product.imageUrl}
                                                                alt={productName}
                                                                className="h-14 w-14 rounded-lg object-cover"
                                                            />
                                                        )}

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                                {productName}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                SKU: {item.product?.sku ?? "—"}
                                                            </p>
                                                        </div>

                                                        {/* Quantity + Stock Info */}
                                                        <div className="flex items-center gap-3">
                                                            {/* Requested & Approved */}
                                                            <div className="text-right text-sm">
                                                                <p className="text-gray-600">
                                                                    Yêu cầu: <span className="font-bold">{requestedQty || "–"}</span>
                                                                </p>
                                                                {item.quantityApproved != null && (
                                                                    <p className="font-semibold text-green-600">
                                                                        Duyệt: {item.quantityApproved}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Stock Status from Review API */}
                                                            {reviewItem && (
                                                                <div className={`flex flex-col items-center rounded-lg px-3 py-2 min-w-[80px] ${
                                                                    reviewItem.canFulfill
                                                                        ? "bg-green-50 border border-green-200"
                                                                        : "bg-red-50 border border-red-200"
                                                                }`}>
                                                                    <span className={`text-lg font-black tabular-nums ${
                                                                        reviewItem.canFulfill ? "text-green-700" : "text-red-700"
                                                                    }`}>
                                                                        {reviewItem.currentStock}
                                                                    </span>
                                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Tồn kho</span>
                                                                    <span className={`mt-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                                                                        reviewItem.canFulfill
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-red-100 text-red-700"
                                                                    }`}>
                                                                        {reviewItem.canFulfill ? "ĐỦ" : "THIẾU"}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Request Production Action — only for out-of-stock items */}
                                                    {reviewItem && !reviewItem.canFulfill && onRequestProduction && status === "pending" && (
                                                        <div className="mt-3 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                                                            <div className="text-xs text-amber-800">
                                                                <p className="font-semibold">Thiếu {shortage} đơn vị so với yêu cầu</p>
                                                                <p className="text-amber-600">Gửi lệnh sản xuất tới bếp để bổ sung tồn kho</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => onRequestProduction(
                                                                    Number(productId),
                                                                    productName,
                                                                    shortage
                                                                )}
                                                                className="ml-3 whitespace-nowrap rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition"
                                                            >
                                                                🏭 Yêu cầu sản xuất
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* REJECT NOTE */}
                                {detailData.note && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                        <span className="font-semibold">Lý do từ chối:</span> {detailData.note}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}