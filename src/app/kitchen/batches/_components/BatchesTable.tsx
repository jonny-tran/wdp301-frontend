import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Batch } from "@/types/product";
import { useMemo } from "react";

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
    const hasProduct = useMemo(() => batches.some((b) => b.productName), [batches]);
    const hasImage = useMemo(() => batches.some((b) => b.imageUrl), [batches]);
    const hasCurrentQty = useMemo(() => batches.some((b) => b.currentQuantity !== undefined && b.currentQuantity !== null), [batches]);
    const hasExpiry = useMemo(() => batches.some((b) => b.expiryDate), [batches]);
    const hasStatus = useMemo(() => batches.some((b) => b.status), [batches]);

    const getStatusStyles = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'available': return 'bg-green-50 text-green-600 border-green-100';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'empty': return 'bg-gray-50 text-gray-500 border-gray-100';
            case 'expired': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-text-muted">
                    <tr>
                        <th className="px-6 py-3">No.</th>
                        {hasImage && <th className="px-6 py-3">Image</th>}
                        {hasProduct && <th className="px-6 py-3">Product</th>}
                        {hasCurrentQty && <th className="px-6 py-3 text-right">Current Qty</th>}
                        {hasExpiry && <th className="px-6 py-3">Expiry</th>}
                        {hasStatus && <th className="px-6 py-3">Status</th>}
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
                                {hasImage && (
                                    <td className="px-6 py-4">
                                        {batch.imageUrl ? (
                                            <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                                                <img src={batch.imageUrl} alt="Batch" className="h-full w-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-300 border border-dashed border-slate-200">
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            </div>
                                        )}
                                    </td>
                                )}
                                {hasProduct && <td className="px-6 py-4 text-text-main">{batch.productName}</td>}
                                {hasCurrentQty && <td className="px-6 py-4 text-right font-semibold text-text-main">{batch.currentQuantity}</td>}
                                {hasExpiry && <td className="px-6 py-4 text-text-muted">{String(batch.expiryDate).slice(0, 10)}</td>}
                                {hasStatus && (
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${getStatusStyles(batch.status)}`}>
                                            {batch.status ?? 'N/A'}
                                        </span>
                                    </td>
                                )}
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
