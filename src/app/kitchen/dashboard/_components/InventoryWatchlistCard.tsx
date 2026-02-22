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
            <h3 className="mb-4 text-base font-bold text-text-main">Inventory Watchlist</h3>
            {isLoading ? (
                <p className="text-sm text-text-muted">Loading inventory summary...</p>
            ) : isError ? (
                <p className="text-sm text-red-500">Failed to load inventory summary.</p>
            ) : items.length === 0 ? (
                <p className="text-sm text-text-muted">No inventory data.</p>
            ) : (
                <div className="space-y-3">
                    {items
                        .sort((a: any, b: any) => {
                            const lowA = a.isLowStock ?? a.is_low_stock ?? (Number(a.availableQuantity ?? a.available_quantity ?? a.totalQuantity ?? 0) === 0);
                            const lowB = b.isLowStock ?? b.is_low_stock ?? (Number(b.availableQuantity ?? b.available_quantity ?? b.totalQuantity ?? 0) === 0);
                            return Number(lowB) - Number(lowA);
                        })
                        .slice(0, 5)
                        .map((item: any, index) => {
                            // Defensive Mapping
                            const productId = String(item.productId ?? item.product_id ?? item.id ?? "");
                            const productName = String(
                                item.productName ??
                                item.product_name ??
                                item.name ??
                                item.product?.name ??
                                "Product"
                            );

                            const availableQuantity = String(
                                item.availableQuantity ??
                                item.available_quantity ??
                                item.totalQuantity ??
                                item.quantity ??
                                0
                            );

                            const unit = String(item.unit ?? item.product?.unit ?? "");

                            // Status calculation
                            let isLowStock = false;
                            if (item.isLowStock !== undefined) isLowStock = Boolean(item.isLowStock);
                            else if (item.is_low_stock !== undefined) isLowStock = Boolean(item.is_low_stock);
                            else {
                                const availNum = Number(availableQuantity);
                                const minStock = Number(item.minStockLevel ?? item.min_stock_level ?? 0);
                                if (minStock > 0) isLowStock = availNum <= minStock;
                                else isLowStock = availNum === 0;
                            }

                            return (
                                <div key={`${productId}-${index}`} className="rounded-2xl border border-gray-100 p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-text-main">{productName}</p>
                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${isLowStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {isLowStock ? "Low" : "Normal"}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-text-muted">
                                        Available: {availableQuantity} {unit}
                                    </p>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
