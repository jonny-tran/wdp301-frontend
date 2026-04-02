import { formatStatusLabel } from "@/app/supply/_components/format";
import { OrderReviewItem } from "@/types/order";

interface AllocationReviewModalProps {
    orderNo?: number;
    isLoading: boolean;
    isError: boolean;
    storeName?: string;
    status?: string;
    reviewItems: OrderReviewItem[];
    onClose: () => void;
}

export default function AllocationReviewModal({
    orderNo,
    isLoading,
    isError,
    storeName,
    status,
    reviewItems,
    onClose,
}: AllocationReviewModalProps) {
    const fulfillableCount = reviewItems.filter((item) => item.canFulfill).length;
    const stockAvailabilityPercent = reviewItems.length > 0
        ? Math.round((fulfillableCount / reviewItems.length) * 100)
        : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">Xét duyệt Phân bổ Hàng hóa</h3>
                        <p className="text-sm text-text-muted">Mức độ sẵn sàng của từng mặt hàng để phân bổ đơn hàng.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40 transition"
                    >
                        Đóng
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex items-center gap-2 py-6">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="text-sm text-text-muted">Đang tải đánh giá...</p>
                    </div>
                ) : isError ? (
                    <p className="text-sm text-red-500">Tải dữ liệu đánh giá thất bại.</p>
                ) : reviewItems.length === 0 ? (
                    <p className="text-sm text-text-muted">Không có chi tiết đánh giá.</p>
                ) : (
                    <div className="space-y-4">
                        {/* Summary Header */}
                        <div className="rounded-2xl border border-gray-100 p-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-semibold text-text-main">Đơn hàng số: {orderNo ? `#${orderNo}` : "—"}</p>
                                    <p className="text-xs text-text-muted">Cửa hàng: {storeName ?? "—"}</p>
                                    <p className="text-xs text-text-muted">Trạng thái: {formatStatusLabel(String(status ?? ""))}</p>
                                </div>
                                {/* Stock Availability Badge */}
                                <div className={`rounded-xl px-4 py-2 text-center ${
                                    stockAvailabilityPercent >= 100
                                        ? "bg-green-50 border border-green-200"
                                        : stockAvailabilityPercent >= 50
                                            ? "bg-amber-50 border border-amber-200"
                                            : "bg-red-50 border border-red-200"
                                }`}>
                                    <p className={`text-2xl font-black tabular-nums ${
                                        stockAvailabilityPercent >= 100
                                            ? "text-green-700"
                                            : stockAvailabilityPercent >= 50
                                                ? "text-amber-700"
                                                : "text-red-700"
                                    }`}>
                                        {stockAvailabilityPercent}%
                                    </p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Tồn kho khả dụng</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div>
                                <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                                    <span>Mặt hàng đủ tồn kho</span>
                                    <span className="font-bold text-text-main">{fulfillableCount}/{reviewItems.length}</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            stockAvailabilityPercent >= 100 ? "bg-green-500" : stockAvailabilityPercent >= 50 ? "bg-amber-500" : "bg-red-500"
                                        }`}
                                        style={{ width: `${Math.min(stockAvailabilityPercent, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Item-level Details */}
                        <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
                            {reviewItems.map((item, idx) => (
                                <div
                                    key={`${item.productId}-${idx}`}
                                    className={`flex items-center justify-between rounded-xl border p-3 transition ${
                                        item.canFulfill
                                            ? "border-gray-100 hover:border-green-200"
                                            : "border-orange-200 bg-orange-50/30"
                                    }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-text-main truncate">{item.productName ?? `SP #${item.productId}`}</p>
                                        <p className="text-xs text-text-muted">
                                            Yêu cầu: <span className="font-bold">{item.requestedQty}</span>
                                            {" · "}
                                            Khả dụng: <span className={`font-bold ${item.canFulfill ? "text-green-700" : "text-red-600"}`}>
                                                {item.currentStock ?? "N/A"}
                                            </span>
                                        </p>
                                    </div>
                                    <span className={`ml-3 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                        item.canFulfill
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                        {item.canFulfill ? "Đủ tồn" : "Thiếu hàng"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Decision support hint */}
                        {stockAvailabilityPercent < 100 && (
                            <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-xs text-orange-700">
                                <p className="font-semibold">⚠ Gợi ý cho Điều phối viên:</p>
                                <p className="mt-0.5">
                                    Đơn hàng này thiếu tồn kho cho {reviewItems.length - fulfillableCount} mặt hàng.
                                    Bạn có thể <span className="font-bold">ra lệnh sản xuất bổ sung</span>, hoặc <span className="font-bold">duyệt giao một phần (Partial Fulfillment)</span>.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
