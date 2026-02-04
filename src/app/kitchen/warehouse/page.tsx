"use client";
import React from "react";
import Link from "next/link";
import { WarehouseTask } from "@/types/warehouse";
import {
    ClipboardDocumentCheckIcon,
    TruckIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline";

// Mock Data
const PENDING_TASKS: WarehouseTask[] = [
    { orderId: "ORD-20231025-001", type: "picking", status: "pending", createdAt: "2023-10-25T14:00:00", totalItems: 12 },
    { orderId: "ORD-20231025-005", type: "picking", status: "in_progress", createdAt: "2023-10-25T14:15:00", totalItems: 8 },
    { orderId: "ORD-20231025-008", type: "packing", status: "pending", createdAt: "2023-10-25T13:45:00", totalItems: 25 },
];

export default function WarehousePage() {
    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Warehouse Operations</h1>
                <p className="text-sm text-gray-500 mt-1">Manage picking tasks, packing, and shipments.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex items-start justify-between">
                    <div>
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Pending Pick</span>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">5</h3>
                        <p className="text-xs text-gray-500 mt-2">Orders waiting for ingredients</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm text-orange-500">
                        <ClipboardDocumentCheckIcon className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-start justify-between">
                    <div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Ready to Pack</span>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">2</h3>
                        <p className="text-xs text-gray-500 mt-2">Picking completed</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500">
                        <TruckIcon className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100 flex items-start justify-between">
                    <div>
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Issues</span>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">1</h3>
                        <p className="text-xs text-gray-500 mt-2">Stock discrepancies reported</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm text-red-500">
                        <ExclamationTriangleIcon className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">Priority Tasks</h2>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {PENDING_TASKS.map((task) => (
                        <div key={task.orderId} className="flex items-center justify-between p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-xl ${task.type === 'picking' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {task.type === 'picking' ? <ClipboardDocumentCheckIcon className="w-6 h-6" /> : <TruckIcon className="w-6 h-6" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-gray-800 text-lg">{task.orderId}</h4>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                                            }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {task.type === 'picking' ? 'Picking List' : 'Verification & Packing'} • {task.totalItems} items
                                    </p>
                                    <span className="text-xs text-gray-400 mt-1 block">Requested: {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            <Link
                                href={task.type === 'picking' ? `/kitchen/warehouse/${task.orderId}` : '#'}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-gray-800 hover:scale-105 transition-all"
                            >
                                <span>Start {task.type === 'picking' ? 'Picking' : 'Packing'}</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
