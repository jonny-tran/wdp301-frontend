"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { XMarkIcon, CalendarIcon, CubeIcon } from "@heroicons/react/24/outline";
import { UpdateBatchBodyType } from "@/schemas/product";
import { Batch } from "@/types/product";
import { BatchStatus } from "@/utils/enum";
import { useUpload } from "@/hooks/useUpload";

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
    const { uploadImage } = useUpload();

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

        if (imageUrl.trim() && imageUrl !== initialData?.imageUrl) {
            payload.imageUrl = imageUrl.trim();
        }

        // Only update status if user selected a new one
        if (status && status !== initialData?.status) {
            payload.status = status as BatchStatus;
        }

        onSubmit(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-black">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black">
                    <div className="flex items-center gap-2">
                        <CubeIcon className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase">Cập nhật lô hàng - {initialData?.batchCode}</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Loading overlay */}
                {isLoadingData && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Image - Circular placeholder */}
                    <div className="flex justify-center">
                        <div className="w-32 h-32 rounded-full border-2 border-black flex items-center justify-center overflow-hidden bg-gray-50">
                            {imageUrl ? (
                                <img src={imageUrl} alt="Batch" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold text-gray-400">Ảnh</span>
                            )}
                        </div>
                    </div>

                    {/* 2 Columns: Left + Right */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Left Column */}
                        <div className="space-y-3">
                            {/* Expiry Date */}
                            <div className="border-2 border-black rounded-lg p-2">
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    Hạn sử dụng
                                </div>
                                <p className="text-sm font-bold text-red-600">
                                    {initialData?.expiryDate
                                        ? new Date(initialData.expiryDate).toLocaleDateString('vi-VN')
                                        : "N/A"}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="border-2 border-black rounded-lg p-2">
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    Status
                                </div>
                                <select
                                    value={status || initialData?.status || ""}
                                    onChange={(e) => setStatus(e.target.value as BatchStatus | "")}
                                    className="w-full text-sm font-medium bg-transparent outline-none cursor-pointer"
                                >
                                    {BATCH_STATUS_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                            {/* Current Quantity */}
                            <div className="border-2 border-black rounded-lg p-2">
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    Số lượng
                                </div>
                                <p className="text-sm font-bold text-green-600">
                                    {initialData?.currentQuantity ?? 0}
                                </p>
                            </div>

                            {/* Change Quantity */}
                            <div className="border-2 border-black rounded-lg p-2">
                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    Thay đổi SL
                                </div>
                                <input
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={initialQuantity}
                                    onChange={(event) => setInitialQuantity(event.target.value)}
                                    className="w-full text-sm font-medium bg-transparent outline-none placeholder:text-gray-300"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload Button */}
                    <div className="flex justify-center">
                        <label className="cursor-pointer text-xs font-bold underline">
                            {uploadImage.isPending ? "Đang tải..." : "Thay đổi ảnh"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        try {
                                            const response = await uploadImage.mutateAsync(file);
                                            if (response?.url) {
                                                setImageUrl(response.url);
                                            }
                                        } catch (error) {
                                            console.error("Upload failed:", error);
                                        }
                                    }
                                }}
                            />
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 text-sm font-bold uppercase border-2 border-black rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 py-2 text-sm font-bold uppercase text-white bg-black rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                        >
                            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
