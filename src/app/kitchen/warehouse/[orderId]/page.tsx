"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PickingItem } from "@/types/warehouse";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ClipboardDocumentCheckIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

// Mock Data
const MOCK_PICKING_LIST: PickingItem[] = [
    { batchId: 101, batchCode: "BATCH-CHICKEN-001", productName: "Spicy Chicken Wings", quantityToPick: 50, expiryDate: "2023-10-26T00:00:00", picked: false },
    { batchId: 102, batchCode: "BATCH-SAUCE-005", productName: "Signature Spicy Sauce", quantityToPick: 5, expiryDate: "2023-10-30T00:00:00", picked: false },
    { batchId: 105, batchCode: "BATCH-FLOUR-020", productName: "Coating Mix", quantityToPick: 10, expiryDate: "2023-11-01T00:00:00", picked: false },
];

export default function PickingPage() {
    const params = useParams();
    const orderId = params.orderId as string;
    const [items, setItems] = useState<PickingItem[]>(MOCK_PICKING_LIST);

    const togglePicked = (batchId: number) => {
        setItems(items.map(item =>
            item.batchId === batchId ? { ...item, picked: !item.picked } : item
        ));
    };

    const progress = Math.round((items.filter(i => i.picked).length / items.length) * 100);

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/kitchen/warehouse" className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-800">
                    <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-800">Picking for {orderId}</h1>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200">
                            IN PROGRESS
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Follow FEFO: Pick items with earliest expiry date first.</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{progress}%</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Completed</div>
                </div>
            </div>

            {/* Picking List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
                <div className="overflow-y-auto flex-1 p-6 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.batchId}
                            onClick={() => togglePicked(item.batchId)}
                            className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all group ${item.picked
                                ? "bg-green-50/50 border-green-200"
                                : "bg-white border-gray-100 hover:border-primary/30 hover:shadow-md"
                                }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${item.picked ? "bg-green-500 border-green-500 text-white" : "border-gray-200 text-transparent group-hover:border-primary/30"
                                    }`}>
                                    <CheckCircleIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-lg transition-colors ${item.picked ? "text-gray-500 line-through" : "text-gray-800"}`}>
                                        {item.productName}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.batchCode}</span>
                                        <span className={`text-xs font-bold flex items-center gap-1 ${new Date(item.expiryDate) < new Date('2023-10-28') ? "text-red-500" : "text-green-600"
                                            }`}>
                                            {new Date(item.expiryDate) < new Date('2023-10-28') && <ExclamationTriangleIcon className="w-3 h-3" />}
                                            Exp: {new Date(item.expiryDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-800">{item.quantityToPick} <span className="text-sm font-normal text-gray-400">units</span></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <button className="text-sm font-bold text-red-500 hover:text-red-600 px-4 py-2 hover:bg-red-50 rounded-xl transition-colors">
                        Report Issue
                    </button>
                    <button
                        disabled={progress < 100}
                        className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${progress === 100
                            ? "bg-primary hover:bg-primary-dark hover:scale-105 shadow-primary/30"
                            : "bg-gray-300 cursor-not-allowed text-gray-500"
                            }`}
                    >
                        <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        Finalize Shipment
                    </button>
                </div>
            </div>
        </div>
    );
}
