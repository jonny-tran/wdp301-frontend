"use client";

import { XMarkIcon, CubeIcon } from "@heroicons/react/24/outline";
import { KitchenDetail } from "@/types/inventory";
import InventoryBatchDetails from "./InventoryBatchDetails";

interface InventoryBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    selectedProductId: number | null;
    batches: KitchenDetail["batches"];
    isLoading: boolean;
    isError: boolean;
}

export default function InventoryBatchModal({
    isOpen,
    onClose,
    productName,
    selectedProductId,
    batches,
    isLoading,
    isError,
}: InventoryBatchModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-black">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black">
                    <div className="flex items-center gap-2">
                        <CubeIcon className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase">{productName}</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[50vh] overflow-y-auto">
                    <InventoryBatchDetails
                        selectedProductId={selectedProductId}
                        batches={batches}
                        isLoading={isLoading}
                        isError={isError}
                    />
                </div>

                {/* Footer */}
                <div className="border-t-2 border-black p-3">
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-sm font-bold uppercase text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
