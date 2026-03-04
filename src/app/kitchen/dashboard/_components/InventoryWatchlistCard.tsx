import { KitchSummary } from "@/types/inventory";

interface InventoryWatchlistCardProps {
    isLoading: boolean;
    isError: boolean;
    items: KitchSummary[];
}

export default function InventoryWatchlistCard({
    isLoading,
    isError,
    items,
}: InventoryWatchlistCardProps) {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-base font-bold text-text-main">Theo dõi tồn kho</h3>
            {isLoading ? (
                <p className="text-sm text-text-muted">Đang tải tổng quan tồn kho...</p>
            ) : isError ? (
                <p className="text-sm text-red-500">Tải tổng quan tồn kho thất bại.</p>
            ) : items.length === 0 ? (
                <p className="text-sm text-text-muted">Không có dữ liệu tồn kho.</p>
            ) : (
                <div className="space-y-3">
                    {items
                        .sort((a, b) => Number(b.isLowStock) - Number(a.isLowStock))
                        .slice(0, 5)
                        .map((item, index) => {
                            const { productId, productName, availableQuantity, unit, isLowStock } = item;

                            return (
                                <div key={productId || index} className="rounded-2xl border border-gray-100 p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-text-main">{productName}</p>
                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${isLowStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {isLowStock ? "Thấp" : "Bình thường"}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-text-muted">
                                        Có sẵn: {availableQuantity} {unit}
                                    </p>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
