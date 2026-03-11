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
        return <p className="p-4 text-sm text-gray-500">Chọn một sản phẩm để xem các lô hàng.</p>;
    }

    if (isLoading) {
        return <p className="p-4 text-sm text-gray-500">Đang tải chi tiết lô hàng...</p>;
    }

    if (isError) {
        return <p className="p-4 text-sm text-red-500">Tải chi tiết lô hàng thất bại.</p>;
    }

    if (batches.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="text-sm text-gray-500">Không có lô hàng nào cho sản phẩm này.</p>
            </div>
        );
    }

    return (
        <div className="max-h-[50vh] overflow-y-auto">
            {batches.map((batch) => (
                <div key={batch.batchId} className="border-b border-gray-100 last:border-b-0">
                    <div className="grid grid-cols-2 gap-2 p-3 hover:bg-gray-50">
                        {/* Left: Batch Code + Expiry */}
                        <div>
                            <p className="text-xs font-bold uppercase text-gray-500">Mã lô</p>
                            <p className="text-sm font-bold text-gray-800">{batch.batchCode}</p>
                            <p className="text-xs text-red-500 mt-1">
                                HSD: {new Date(batch.expiryDate).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                        {/* Right: Quantities */}
                        <div className="text-right">
                            <div className="grid grid-cols-3 gap-1 text-xs">
                                <div>
                                    <p className="font-bold text-gray-800">{batch.totalQuantity}</p>
                                    <p className="text-gray-400">Tổng</p>
                                </div>
                                <div>
                                    <p className="font-bold text-green-600">{batch.availableQuantity}</p>
                                    <p className="text-gray-400">Có sẵn</p>
                                </div>
                                <div>
                                    <p className="font-bold text-amber-500">{batch.reservedQuantity}</p>
                                    <p className="text-gray-400">Đặt trước</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
