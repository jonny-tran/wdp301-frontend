import { KitchenBatchRow } from "./inventory.types";

interface InventoryBatchDetailsProps {
    selectedProductId: number | null;
    batches: KitchenBatchRow[];
    isLoading: boolean;
    isError: boolean;
}

export default function InventoryBatchDetails({
    selectedProductId,
    batches,
    isLoading,
    isError,
}: InventoryBatchDetailsProps) {
    if (!selectedProductId) {
        return <p className="px-6 py-8 text-sm text-text-muted">Select a product to see its batches.</p>;
    }

    if (isLoading) {
        return <p className="px-6 py-8 text-sm text-text-muted">Loading batch details...</p>;
    }

    if (isError) {
        return <p className="px-6 py-8 text-sm text-red-500">Failed to load batch details.</p>;
    }

    if (batches.length === 0) {
        return <p className="px-6 py-8 text-sm text-text-muted">No batch available for this product.</p>;
    }

    return (
        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-4">
                {batches.map((batch: any, index: number) => {
                    const total = batch.totalQuantity ?? batch.total_quantity ?? 0;
                    const available = batch.availableQuantity ?? batch.available_quantity ?? 0;
                    const reserved = batch.reservedQuantity ?? batch.reserved_quantity ?? 0;
                    const rowKey = batch.batchId ?? batch.batchCode ?? `batch-${index}`;

                    return (
                        <div key={rowKey} className="flex flex-col bg-white rounded-2xl border border-gray-100 p-5 transition-all hover:shadow-md">
                            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">Batch Code</p>
                                    <p className="font-bold text-text-main truncate text-sm">{batch.batchCode}</p>
                                </div>
                                <div className="sm:text-right shrink-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">Expiry Date</p>
                                    <p className="font-bold text-primary text-sm">{String(batch.expiryDate).slice(0, 10)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-xl bg-gray-50/50 p-2.5 text-center border border-gray-100/50">
                                    <p className="text-[9px] font-black uppercase tracking-wider text-text-muted mb-0.5">Total</p>
                                    <p className="font-black text-text-main">{total}</p>
                                </div>
                                <div className="rounded-xl bg-green-50/50 p-2.5 text-center border border-green-100/50">
                                    <p className="text-[9px] font-black uppercase tracking-wider text-green-600 mb-0.5">Available</p>
                                    <p className="font-black text-green-700">{available}</p>
                                </div>
                                <div className="rounded-xl bg-amber-50/50 p-2.5 text-center border border-amber-100/50">
                                    <p className="text-[9px] font-black uppercase tracking-wider text-amber-600 mb-0.5">Reserved</p>
                                    <p className="font-black text-amber-700">{reserved}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
