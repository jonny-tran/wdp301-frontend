import { KitchenDetail } from "@/types/inventory";

interface InventoryBatchDetailsProps {
    selectedProductId: number | null;
    batches: KitchenDetail["batches"];
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
        return <p className="px-6 py-8 text-sm text-text-muted">Chọn một sản phẩm để xem các lô hàng.</p>;
    }

    if (isLoading) {
        return <p className="px-6 py-8 text-sm text-text-muted">Đang tải chi tiết lô hàng...</p>;
    }

    if (isError) {
        return <p className="px-6 py-8 text-sm text-red-500">Tải chi tiết lô hàng thất bại.</p>;
    }

    if (batches.length === 0) {
        return <p className="px-6 py-8 text-sm text-text-muted">Không có lô hàng nào cho sản phẩm này.</p>;
    }

    return (
        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-6">
            <div className="flex flex-col gap-4">
                {batches.map((batch, index) => {
                    const total = batch.totalQuantity;
                    const available = batch.availableQuantity;
                    const reserved = batch.reservedQuantity;
                    const rowKey = batch.batchId;

                    return (
                        <div key={rowKey} className="flex flex-col bg-white rounded-2xl border border-gray-100 p-5 transition-all hover:shadow-md">
                            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">Mã lô hàng</p>
                                    <p className="font-bold text-text-main truncate text-sm">{batch.batchCode}</p>
                                </div>
                                <div className="sm:text-right shrink-0">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">Ngày hết hạn</p>
                                    <p className="font-bold text-primary text-sm">{String(batch.expiryDate).slice(0, 10)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-xl bg-gray-50/50 p-2.5 text-center border border-gray-100/50">
                                    <p className="text-[9px] font-black uppercase tracking-wider text-text-muted mb-0.5">Tổng</p>
                                    <p className="font-black text-text-main">{total}</p>
                                </div>
                                <div className="rounded-xl bg-green-50/50 p-2.5 text-center border border-green-100/50">
                                    <p className="text-[9px] font-black uppercase tracking-wider text-green-600 mb-0.5">Có sẵn</p>
                                    <p className="font-black text-green-700">{available}</p>
                                </div>
                                <div className="rounded-xl bg-amber-50/50 p-2.5 text-center border border-amber-100/50">
                                    <p className="text-[9px] font-black uppercase tracking-wider text-amber-600 mb-0.5">Đặt trước</p>
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
