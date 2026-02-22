"use client";

import { XMarkIcon, CubeIcon, TagIcon, ScaleIcon, CalendarIcon, TruckIcon } from "@heroicons/react/24/outline";

interface ReceiptDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiptCode: string;
    details: any;
    isLoading: boolean;
}

export default function ReceiptDetailModal({
    isOpen,
    onClose,
    receiptCode,
    details,
    isLoading
}: ReceiptDetailModalProps) {
    if (!isOpen) return null;

    const items = Array.isArray(details?.items) ? details.items : [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-8 py-6">
                    <div>
                        <h3 className="text-xl font-black text-text-main tracking-tight">Receipt Details</h3>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mt-0.5">#{String(details?.id || receiptCode).slice(0, 8).toUpperCase()}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto p-8">
                    {/* Top Info Section */}
                    {!isLoading && details && (
                        <div className="mb-8 grid gap-6 sm:grid-cols-2">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-text-muted">
                                    <TruckIcon className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Supplier Info</span>
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-4">
                                    <p className="text-sm font-bold text-text-main">{details.supplier?.name || "Unknown Supplier"}</p>
                                    <p className="mt-1 text-xs text-text-muted">{details.supplier?.contactName} • {details.supplier?.phone}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-text-muted">
                                    <TagIcon className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Notes</span>
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-4 min-h-[58px]">
                                    <p className="text-xs font-medium text-text-muted italic leading-relaxed">
                                        {details.note ? `"${details.note}"` : "No notes provided for this shipment."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                        <CubeIcon className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-text-main">Expected Items</h4>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="mt-4 text-sm font-bold text-text-muted">Loading items...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="rounded-[2rem] border-2 border-dashed border-gray-100 py-12 text-center bg-gray-50/30">
                            <CubeIcon className="mx-auto h-12 w-12 text-gray-200" />
                            <p className="mt-3 text-sm font-bold text-text-main">No products found</p>
                            <p className="mt-1 text-[11px] text-text-muted px-12">This draft shipment exists in the system but doesn't have any products attached yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {items.map((item: any, index: number) => {
                                const productName = item.productName || item.batch?.product?.name || "Unknown Product";
                                const batchCode = item.batchCode || item.batch?.batchCode || "N/A";
                                const expiryDate = item.expiryDate || item.batch?.expiryDate;
                                const unit = item.unit || item.batch?.product?.unit || "Units";

                                return (
                                    <div
                                        key={item.batchId ?? index}
                                        className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-gray-50 p-2.5 text-text-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                                                    <CubeIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-text-main">{productName}</h4>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-text-muted">
                                                        <TagIcon className="h-3.5 w-3.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Batch: {batchCode}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1 text-primary">
                                                    <ScaleIcon className="h-4 w-4" />
                                                    <span className="text-lg font-black tracking-tight">{item.quantity}</span>
                                                    <span className="text-[10px] font-bold uppercase mt-1">{unit}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 rounded-xl bg-gray-50/50 p-3">
                                            <div className="flex items-center gap-2 text-text-muted">
                                                <CalendarIcon className="h-3.5 w-3.5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Expiry Date:</span>
                                            </div>
                                            <span className="text-xs font-bold text-red-500">
                                                {expiryDate ? new Date(expiryDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : "Not Set"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-6">
                    <button
                        onClick={onClose}
                        className="w-full rounded-2xl bg-white border border-gray-200 py-3 text-sm font-black text-text-main transition-all hover:bg-gray-50 active:scale-[0.98] shadow-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
