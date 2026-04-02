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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">Xét duyệt Thực hiện</h3>
                        <p className="text-sm text-text-muted">Mức độ sẵn sàng của từng mặt hàng để phân bổ đơn hàng.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40"
                    >
                        Đóng
                    </button>
                </div>

                {isLoading ? (
                    <p className="text-sm text-text-muted">Đang tải đánh giá...</p>
                ) : isError ? (
                    <p className="text-sm text-red-500">Tải dữ liệu đánh giá thất bại.</p>
                ) : reviewItems.length === 0 ? (
                    <p className="text-sm text-text-muted">Không có chi tiết đánh giá.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-gray-100 p-4 text-xs">
                            <p className="font-semibold text-text-main">Đơn hàng số: {orderNo ? `#${orderNo}` : "-"}</p>
                            <p className="text-text-muted">Cửa hàng: {storeName ?? "-"}</p>
                            <p className="text-text-muted">Trạng thái: {formatStatusLabel(String(status ?? ""))}</p>
                            <p className="text-text-muted">Khả thi: {fulfillableCount}/{reviewItems.length} mặt hàng</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
