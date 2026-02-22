import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Batch } from "@/types/product";

interface BatchesTableProps {
    batches: Batch[];
    rowStart: number;
    isLoading: boolean;
    isError: boolean;
    onEdit: (batchId: number) => void;
}

export default function BatchesTable({
    batches,
    rowStart,
    isLoading,
    isError,
    onEdit,
}: BatchesTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-text-muted">
                    <tr>
                        <th className="px-6 py-3">No.</th>
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3 text-right">Initial Qty</th>
                        <th className="px-6 py-3 text-right">Current Qty</th>
                        <th className="px-6 py-3">Expiry</th>
                        <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-sm text-text-muted">Loading batches...</td>
                        </tr>
                    ) : isError ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-sm text-red-500">Failed to load batches.</td>
                        </tr>
                    ) : batches.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-sm text-text-muted">No batch found.</td>
                        </tr>
                    ) : (
                        batches.map((batch, index) => (
                            <tr key={batch.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-text-main">#{rowStart + index + 1}</p>
                                    <p className="text-xs text-text-muted">Code: {batch.batchCode}</p>
                                </td>
                                <td className="px-6 py-4 text-text-main">{batch.productName}</td>
                                <td className="px-6 py-4 text-right font-semibold text-text-main">{batch.initialQuantity}</td>
                                <td className="px-6 py-4 text-right text-text-muted">{batch.currentQuantity}</td>
                                <td className="px-6 py-4 text-text-muted">{String(batch.expiryDate).slice(0, 10)}</td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onEdit(batch.id)}
                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40 hover:text-primary"
                                    >
                                        <PencilSquareIcon className="h-4 w-4" />
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
