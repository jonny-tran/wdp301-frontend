"use client";
import React, { Fragment, useState, useEffect } from "react";
// import { Dialog, Transition } from "@headlessui/react"; 
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Batch, CreateBatchDto } from "@/types/";

// Since I'm not sure if headlessui is installed, I'll build a custom modal using standard Tailwind
// If headlessui is preferred I can switch, but standard is safer without checking package.json again

interface BatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateBatchDto) => void;
    initialData?: Batch | null;
}

export const BatchModal = ({ isOpen, onClose, onSubmit, initialData }: BatchModalProps) => {
    const [formData, setFormData] = useState<CreateBatchDto>({
        productId: 0,
        initialQuantity: 0,
        imageUrl: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                productId: initialData.product.id,
                initialQuantity: initialData.initialQuantity,
                imageUrl: initialData.imageUrl || "",
            });
        } else {
            setFormData({ productId: 0, initialQuantity: 0, imageUrl: "" });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">
                        {initialData ? "Update Batch" : "Create New Batch"}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Product
                        </label>
                        <select
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: Number(e.target.value) })}
                            disabled={!!initialData} // Lock product on edit
                        >
                            <option value={0}>Select a product...</option>
                            <option value={101}>Spicy Chicken Wings</option>
                            <option value={102}>Original Recipe Thighs</option>
                            <option value={103}>Coleslaw Mix</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Initial Quantity
                        </label>
                        <input
                            type="number"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.initialQuantity}
                            onChange={(e) => setFormData({ ...formData, initialQuantity: Number(e.target.value) })}
                            min={1}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                            Image URL (Optional)
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all"
                        >
                            {initialData ? "Save Changes" : "Create Batch"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
