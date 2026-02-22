import { formatDateTime, formatStatusLabel } from "@/app/supply/_components/format";

interface ClaimDetailModalProps {
    claimNo?: number;
    onClose: () => void;
    isLoading: boolean;
    isError: boolean;
    detailData: Record<string, unknown>;
    detailItems: unknown[];
}

export default function ClaimDetailModal({
    claimNo,
    onClose,
    isLoading,
    isError,
    detailData,
    detailItems,
}: ClaimDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">Claim Detail</h3>
                        <p className="text-sm text-text-muted">Detailed claim information and item-level issues.</p>
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
                    <p className="text-sm text-text-muted">Loading claim detail...</p>
                ) : isError ? (
                    <p className="text-sm text-red-500">Unable to access claim detail with the current role.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-gray-100 p-4 text-xs">
                            <p className="font-semibold text-text-main">Claim No.: {claimNo ? `#${claimNo}` : "-"}</p>
                            <p className="text-text-muted">{detailData.shipmentId ? "Linked shipment: Available" : "Linked shipment: Not available"}</p>
                            <p className="text-text-muted">Status: {formatStatusLabel(String(detailData.status ?? ""))}</p>
                            <p className="text-text-muted">Created: {formatDateTime((detailData.createdAt as string | undefined) ?? undefined)}</p>
                            <p className="text-text-muted">Resolved: {formatDateTime((detailData.resolvedAt as string | undefined) ?? undefined)}</p>
                        </div>

                        {detailItems.length === 0 ? (
                            <p className="text-sm text-text-muted">No claim items.</p>
                        ) : (
                            <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                                {detailItems.map((item, index: number) => {
                                    const row = item as Record<string, unknown>;
                                    return (
                                        <div key={`${String(row.productName ?? "item")}-${index}`} className="rounded-2xl border border-gray-100 p-3">
                                            <p className="font-semibold text-text-main">{String(row.productName ?? "Product")}</p>
                                            <p className="text-xs text-text-muted">SKU: {String(row.sku ?? "-")}</p>
                                            <p className="text-xs text-text-muted">Missing: {String(row.quantityMissing ?? 0)}</p>
                                            <p className="text-xs text-text-muted">Damaged: {String(row.quantityDamaged ?? 0)}</p>
                                            <p className="text-xs text-text-muted">Reason: {String(row.reason ?? "-")}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
