"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UpdateBatchBodyType } from "@/schemas/product";
import { Batch } from "@/types/product";
import { BatchStatus } from "@/utils/enum";
import ImageUpload from "@/components/shared/ImageUpload";

interface BatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateBatchBodyType) => void;
    initialData?: Batch | null;
    isPending?: boolean;
    isLoadingData?: boolean;
}

const BATCH_STATUS_OPTIONS = [
    { value: BatchStatus.PENDING, label: "Chờ xử lý" },
    { value: BatchStatus.AVAILABLE, label: "Sẵn sàng" },
    { value: BatchStatus.EMPTY, label: "Hết hàng" },
    { value: BatchStatus.EXPIRED, label: "Hết hạn" },
];

export function BatchModal({ isOpen, onClose, onSubmit, initialData, isPending, isLoadingData }: BatchModalProps) {
    const [initialQuantity, setInitialQuantity] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState<BatchStatus | "">("");

    useEffect(() => {
        if (!initialData) {
            setInitialQuantity("");
            setImageUrl("");
            setStatus("");
            return;
        }

        const qty = initialData.initialQuantity ?? initialData.currentQuantity;
        setInitialQuantity(qty !== undefined && qty !== null ? String(qty) : "");
        setImageUrl(initialData.imageUrl ?? "");
        setStatus((initialData.status as BatchStatus) ?? "");
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: UpdateBatchBodyType = {};

        if (initialQuantity.trim()) {
            payload.initialQuantity = Number(initialQuantity);
        }

        if (imageUrl.trim()) {
            payload.imageUrl = imageUrl.trim();
        }

        if (status) {
            payload.status = status as BatchStatus;
        }

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-all animate-in fade-in duration-300">
            <div className="w-full max-w-4xl rounded-[3rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative">
                {isLoadingData && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Đang tải dữ liệu lô hàng...</p>
                    </div>
                )}
                <div className="flex items-center justify-between border-b border-gray-100 px-10 py-6 bg-slate-50/50">
                    <div>
                        <h3 className="text-2xl font-black text-text-main uppercase italic">Update Batch</h3>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">
                            {initialData?.productName ? `ID: ${initialData.id} • ${initialData.productName}` : "Refining warehouse stock details"}
                        </p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-3 hover:bg-white hover:shadow-md transition-all active:scale-90">
                        <XMarkIcon className="h-6 w-6 text-text-main" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                        {/* LEFT COLUMN: IMAGE & CODE */}
                        <div className="md:col-span-5 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">Hình ảnh (Editable)</label>
                                <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50/50 p-1 shadow-sm">
                                    <ImageUpload
                                        value={imageUrl}
                                        onChange={(url) => setImageUrl(url)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Batch Code (ReadOnly)</label>
                                <div className="rounded-full border border-slate-200 bg-slate-50 px-8 py-4 text-sm font-bold text-slate-900 shadow-inner">
                                    {initialData?.batchCode ?? "N/A"}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: METADATA & INPUTS */}
                        <div className="md:col-span-7 flex flex-col justify-between space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Expiry Date</label>
                                    <div className="rounded-full border border-slate-200 bg-slate-50 px-8 py-4 text-sm font-bold text-red-500 shadow-inner">
                                        {initialData?.expiryDate ? new Date(initialData.expiryDate).toLocaleDateString('vi-VN') : "N/A"}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">Current Qty</label>
                                    <div className="rounded-full border border-slate-200 bg-slate-50 px-8 py-4 text-sm font-bold text-primary shadow-inner">
                                        {initialData?.currentQuantity ?? 0}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">Update Initial Qty</label>
                                    <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        value={initialQuantity}
                                        onChange={(event) => setInitialQuantity(event.target.value)}
                                        className="w-full rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-900 outline-none shadow-sm focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-300"
                                        placeholder="Enter new quantity..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">Trạng thái lô</label>
                                    <div className="relative">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as BatchStatus | "")}
                                            className="w-full rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                                        >
                                            <option value="">-- Giữ nguyên --</option>
                                            {BATCH_STATUS_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-50 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex items-center justify-center gap-3 rounded-full bg-primary px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-primary-dark shadow-xl shadow-primary/20 disabled:bg-slate-300 transition-all active:scale-95"
                                >
                                    {isPending ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}