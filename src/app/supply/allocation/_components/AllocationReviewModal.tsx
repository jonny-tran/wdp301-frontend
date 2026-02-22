import { formatStatusLabel } from "@/app/supply/_components/format";
import { ReviewItem } from "./allocation.types";

interface AllocationReviewModalProps {
    orderNo?: number;
    isLoading: boolean;
    isError: boolean;
    storeName?: string;
    status?: string;
    reviewItems: ReviewItem[];
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
                        <h3 className="text-lg font-bold text-text-main">Fulfillment Review</h3>
                        <p className="text-sm text-text-muted">Item-level readiness for order allocation.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40"
                    >
                        Close
                    </button>
                </div>

                {isLoading ? (
                    <p className="text-sm text-text-muted">Loading review...</p>
                ) : isError ? (
                    <p className="text-sm text-red-500">Failed to load review data.</p>
                ) : reviewItems.length === 0 ? (
                    <p className="text-sm text-text-muted">No review details.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-gray-100 p-4 text-xs">
                            <p className="font-semibold text-text-main">Order No.: {orderNo ? `#${orderNo}` : "-"}</p>
                            <p className="text-text-muted">Store: {storeName ?? "-"}</p>
                            <p className="text-text-muted">Status: {formatStatusLabel(String(status ?? ""))}</p>
                            <p className="text-text-muted">Fulfillable: {fulfillableCount}/{reviewItems.length}</p>
                        </div>

                        <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                            {reviewItems.map((item, index) => (
                                <div key={`${item.productName}-${index}`} className="rounded-xl border border-gray-100 p-3">
                                    <p className="font-semibold text-text-main">{item.productName ?? "Product"}</p>
                                    <div className="mt-1 grid grid-cols-3 gap-2 text-[11px] text-text-muted">
                                        <span>Req: {item.requestedQty ?? 0}</span>
                                        <span>Stock: {item.currentStock ?? 0}</span>
                                        <span className={item.canFulfill ? "text-green-600" : "text-red-600"}>
                                            {item.canFulfill ? "Fulfillable" : "Short"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
