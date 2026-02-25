"use client";

import { FormEvent, useState } from "react";
import { XMarkIcon, TruckIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useSupplier } from "@/hooks/useSupplier";
import { CreateReceiptBodyType } from "@/schemas/inbound";

interface InboundCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateReceiptBodyType) => void;
    isPending?: boolean;
}

export default function InboundCreateModal({
    isOpen,
    onClose,
    onSubmit,
    isPending
}: InboundCreateModalProps) {
    const { supplierList } = useSupplier();
    const [supplierId, setSupplierId] = useState<string>("");
    const [note, setNote] = useState<string>("");

    const suppliersQuery = supplierList({ page: 1, limit: 100, sortOrder: "DESC" });
    const suppliers = (suppliersQuery.data as any)?.items || (suppliersQuery.data as any)?.data?.items || [];

    if (!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!supplierId) return;

        onSubmit({
            supplierId: Number(supplierId),
            note: note.trim() || undefined
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl transition-all animate-in zoom-in duration-300">
                <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50/50 px-8 py-6">
                    <div>
                        <h3 className="text-xl font-black text-text-main tracking-tight uppercase italic">New Goods Receipt</h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Initialize a draft shipment from supplier</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-white hover:shadow-md hover:text-gray-600 active:scale-90"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-6">
                        {/* Supplier Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2 flex items-center gap-2">
                                <TruckIcon className="h-3.5 w-3.5" />
                                Select Supplier
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={supplierId}
                                    onChange={(e) => setSupplierId(e.target.value)}
                                    className="w-full appearance-none rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-900 outline-none shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                                >
                                    <option value="" disabled>{suppliersQuery.isLoading ? "Loading suppliers..." : "Choose a supplier..."}</option>
                                    {!suppliersQuery.isLoading && suppliers.length === 0 && (
                                        <option value="" disabled>No suppliers found</option>
                                    )}
                                    {suppliers.map((s: any) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            {suppliersQuery.isLoading && <p className="text-[10px] text-primary animate-pulse ml-4 italic">Loading suppliers...</p>}
                        </div>

                        {/* Notes */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2 flex items-center gap-2">
                                <DocumentTextIcon className="h-3.5 w-3.5" />
                                Shipment Notes
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Any specific instructions for this shipment..."
                                className="w-full rounded-[2rem] border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-900 outline-none shadow-sm focus:ring-4 focus:ring-primary/5 transition-all min-h-[120px] resize-none placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-red-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !supplierId}
                            className="flex items-center justify-center gap-3 rounded-full bg-primary px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-primary-dark shadow-xl shadow-primary/20 disabled:bg-slate-300 transition-all active:scale-95"
                        >
                            {isPending ? "Starting..." : "Start Receiving"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
