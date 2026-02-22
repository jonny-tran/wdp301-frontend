import { formatDateTime, formatStatusLabel } from "@/app/supply/_components/format";
import { OrderReviewView } from "./orders.types";

interface OrderDetailModalProps {
    orderNo?: number;
    onClose: () => void;
    isLoading: boolean;
    isDetailError: boolean;
    isReviewError: boolean;
    detailData: Record<string, unknown>;
    detailItemsCount: number;
    detailStoreName: string;
    reviewData: OrderReviewView;
}

export default function OrderDetailModal({
    orderNo,
    onClose,
    isLoading,
    isDetailError,
    isReviewError,
    detailData,
    detailItemsCount,
    detailStoreName,
    reviewData,
}: OrderDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">Order Detail</h3>
                        <p className="text-sm text-text-muted">Order profile and fulfillment review data.</p>
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
                    <p className="text-sm text-text-muted">Loading order detail...</p>
                ) : isDetailError ? (
                    <p className="text-sm text-red-500">Failed to load order detail.</p>
                ) : isReviewError ? (
                    <p className="text-sm text-red-500">Failed to load review data.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <section className="rounded-2xl border border-gray-100 p-4">
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">Order Detail</h4>
                            <div className="space-y-2 text-xs">
                                <p className="font-semibold text-text-main">Order No.: {orderNo ? `#${orderNo}` : "-"}</p>
                                <p className="text-text-muted">Store: {detailStoreName}</p>
                                <p className="text-text-muted">Status: {formatStatusLabel(String(detailData.status ?? ""))}</p>
                                <p className="text-text-muted">Delivery: {formatDateTime((detailData.deliveryDate as string | undefined) ?? undefined)}</p>
                                <p className="text-text-muted">Items: {detailItemsCount}</p>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-100 p-4">
                            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">Coordinator Review</h4>
                            {reviewData.items.length === 0 ? (
                                <p className="text-sm text-text-muted">No products in review.</p>
                            ) : (
                                <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                                    {reviewData.items.map((item) => (
                                        <div key={item.productId} className="rounded-xl border border-gray-100 p-3">
                                            <p className="font-semibold text-text-main">{item.productName}</p>
                                            <div className="mt-1 grid grid-cols-3 gap-2 text-[11px] text-text-muted">
                                                <span>Req: {item.requestedQty}</span>
                                                <span>Stock: {item.currentStock}</span>
                                                <span className={item.canFulfill ? "text-green-600" : "text-red-600"}>
                                                    {item.canFulfill ? "Enough" : "Short"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
