import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { KitchenSummaryRow } from "./inventory.types";

interface InventorySummaryTableProps {
    items: KitchenSummaryRow[];
    selectedProductId: number | null;
    isLoading: boolean;
    isError: boolean;
    onSelect: (productId: number) => void;
}

export default function InventorySummaryTable({
    items,
    selectedProductId,
    isLoading,
    isError,
    onSelect,
}: InventorySummaryTableProps) {
    if (isLoading) {
        return <p className="px-6 py-8 text-sm text-text-muted">Loading kitchen summary...</p>;
    }

    if (isError) {
        return <p className="px-6 py-8 text-sm text-red-500">Failed to load kitchen summary.</p>;
    }

    if (items.length === 0) {
        return <p className="px-6 py-8 text-sm text-text-muted">No inventory data found.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-text-muted">
                    <tr>
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3 text-right">Available</th>
                        <th className="px-6 py-3 text-right">Reserved</th>
                        <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {items.map((item, index) => {
                        const selected = item.productId === selectedProductId;
                        const rowKey = `${item.productId}-${item.sku ?? item.productName ?? "product"}-${index}`;
                        return (
                            <tr
                                key={rowKey}
                                onClick={() => onSelect(item.productId)}
                                className={`cursor-pointer transition ${selected ? "bg-primary/5" : "hover:bg-gray-50"}`}
                            >
                                <td className="px-6 py-4">
                                    <p className="font-bold text-text-main">{item.productName}</p>
                                    <p className="text-xs text-text-muted">{item.sku}</p>
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-text-main">
                                    {item.availableQuantity} {item.unit}
                                </td>
                                <td className="px-6 py-4 text-right text-text-muted">
                                    {item.totalReserved} {item.unit}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.isLowStock
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {item.isLowStock && <ExclamationTriangleIcon className="h-3 w-3" />}
                                        {item.isLowStock ? "Low" : "Healthy"}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
