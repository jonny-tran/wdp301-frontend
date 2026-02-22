"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { KitchenBatchRow } from "./inventory.types";
import InventoryBatchDetails from "./InventoryBatchDetails";

interface InventoryBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    batches: KitchenBatchRow[];
    isLoading: boolean;
    isError: boolean;
}

export default function InventoryBatchModal({
    isOpen,
    onClose,
    productName,
    batches,
    isLoading,
    isError,
}: InventoryBatchModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-all">
            <div className="w-full max-w-lg rounded-[2.5rem] bg-white shadow-2xl overflow-hidden border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 px-10 py-8 bg-white">
                    <div className="min-w-0 flex-1 pr-4">
                        <h3 className="text-2xl font-black text-text-main tracking-tight truncate">{productName}</h3>
                        <p className="text-sm text-text-muted font-medium">Batch quantities & expiry details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="group rounded-full p-2 transition-colors hover:bg-gray-100"
                    >
                        <XMarkIcon className="h-6 w-6 text-text-muted group-hover:text-text-main" />
                    </button>
                </div>

                <div className="bg-gray-50/50 p-2">
                    <InventoryBatchDetails
                        selectedProductId={1} // Dummy to satisfy the existing logic
                        batches={batches}
                        isLoading={isLoading}
                        isError={isError}
                    />
                </div>

                <div className="flex justify-end border-t border-gray-100 px-10 py-6 bg-white">
                    <button
                        onClick={onClose}
                        className="rounded-2xl bg-text-main px-8 py-3 text-sm font-bold text-white transition-all hover:bg-black active:scale-95 shadow-lg shadow-black/10"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
