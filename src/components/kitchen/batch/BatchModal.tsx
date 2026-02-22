"use client";

import { FormEvent, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UpdateBatchBodyType } from "@/schemas/product";
import { Batch } from "@/types/product";

interface BatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateBatchBodyType) => void;
    initialData?: Batch | null;
    isPending?: boolean;
}

export function BatchModal({ isOpen, onClose, onSubmit, initialData, isPending }: BatchModalProps) {
    const [initialQuantity, setInitialQuantity] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (!initialData) {
            setInitialQuantity("");
            setImageUrl("");
            return;
        }

        setInitialQuantity(String(initialData.initialQuantity ?? ""));
        setImageUrl(initialData.imageUrl ?? "");
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        const payload: UpdateBatchBodyType = {};

        if (initialQuantity.trim()) {
            payload.initialQuantity = Number(initialQuantity);
        }

        if (imageUrl.trim()) {
            payload.imageUrl = imageUrl.trim();
        }

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h3 className="text-lg font-bold text-text-main">Update Batch</h3>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
                        <XMarkIcon className="h-5 w-5 text-text-main" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-text-muted">Batch Code</label>
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm font-bold text-text-main">
                                {initialData?.batchCode ?? "N/A"}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-text-muted">Expiry Date</label>
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm font-bold text-red-500">
                                {initialData?.expiryDate ? new Date(initialData.expiryDate).toLocaleDateString('vi-VN') : "N/A"}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-text-muted">Current Quantity</label>
                            <div className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm font-bold text-primary">
                                {initialData?.currentQuantity ?? 0}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl bg-gray-50/30 p-4 border border-gray-100/50">
                        <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-primary">Initial Quantity (Editable)</label>
                            <input
                                type="number"
                                min="1"
                                value={initialQuantity}
                                onChange={(event) => setInitialQuantity(event.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-text-main outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                placeholder="Enter new initial quantity"
                            />
                            <p className="mt-1.5 text-[10px] text-text-muted italic">
                                * This will adjust the inventory level in the Central Warehouse.
                            </p>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-primary">Image URL (Editable)</label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(event) => setImageUrl(event.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-text-main outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                                placeholder="https://image-url.com/..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-gray-200 px-6 py-2.5 text-sm font-black text-text-main hover:bg-gray-50 transition-all border-b-2 active:border-b-0 active:translate-y-[2px]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-2xl bg-primary px-8 py-2.5 text-sm font-black text-white hover:bg-primary-dark shadow-lg shadow-primary/20 disabled:opacity-60 transition-all border-b-2 border-primary-dark active:border-b-0 active:translate-y-[2px]"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}