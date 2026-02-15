'use client'
import { BatchModal } from "@/components/kitchen/batch/BatchModal";
import { Batch } from "@/types/product";

import {
    PlusIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon
} from "@heroicons/react/24/outline";

import { useState } from "react";

// Mock Data
const MOCK_BATCHES: Batch[] = [
    {
        id: 1,
        batchCode: "BATCH-20231025-001",
        product: { id: 101, name: "Spicy Chicken Wings", sku: "PROD-001", baseUnit: "kg", shelfLifeDays: 2 },
        quantity: 50,
        initialQuantity: 50,
        manufactureDate: "2023-10-25T08:00:00",
        expiryDate: "2023-10-27T08:00:00",
        status: "active"
    },
    {
        id: 2,
        batchCode: "BATCH-20231025-002",
        product: { id: 102, name: "Original Recipe Thighs", sku: "PROD-002", baseUnit: "kg", shelfLifeDays: 3 },
        quantity: 30,
        initialQuantity: 40,
        manufactureDate: "2023-10-25T09:30:00",
        expiryDate: "2023-10-28T09:30:00",
        status: "active"
    },
    {
        id: 3,
        batchCode: "BATCH-20231024-005",
        product: { id: 103, name: "Coleslaw Mix", sku: "PROD-005", baseUnit: "L", shelfLifeDays: 5 },
        quantity: 0,
        initialQuantity: 20,
        manufactureDate: "2023-10-24T07:00:00",
        expiryDate: "2023-10-29T07:00:00",
        status: "depleted"
    }
];

export default function BatchesClient() {
    const [batches, setBatches] = useState<Batch[]>(MOCK_BATCHES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

    const getStatusColor = (status: Batch['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'expired': return 'bg-red-100 text-red-700 border-red-200';
            case 'depleted': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleCreate = () => {
        setSelectedBatch(null);
        setIsModalOpen(true);
    };

    const handleEdit = (batch: Batch) => {
        setSelectedBatch(batch);
        setIsModalOpen(true);
    };

    const handleSubmit = (data: CreateBatchDto) => {
        // Mock submission logic
        console.log("Submitting batch:", data);
        if (selectedBatch) {
            // Update
            setBatches(batches.map(b => b.id === selectedBatch.id ? { ...b, initialQuantity: data.initialQuantity, imageUrl: data.imageUrl } : b));
        } else {
            // Create
            const newBatch: Batch = {
                id: Math.random(),
                batchCode: `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
                product: { id: data.productId, name: "New Product", sku: "PROD-New", baseUnit: "kg", shelfLifeDays: 3 }, // Mock product link
                quantity: data.initialQuantity,
                initialQuantity: data.initialQuantity,
                manufactureDate: new Date().toISOString(),
                expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                imageUrl: data.imageUrl
            };
            setBatches([newBatch, ...batches]);
        }
    };

    return (
        <div className="flex flex-col space-y-6 pb-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Batch Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Track production batches, expiry dates, and stock levels.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                        <FunnelIcon className="w-5 h-5" />
                        <span>Filter</span>
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>New Batch</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by Batch Code, Product Name or SKU..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
            </div>

            {/* Batches Table/List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Batch Code</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Quantity</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {batches.map((batch) => (
                                <tr key={batch.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {batch.batchCode}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-700">{batch.product.name}</span>
                                            <span className="text-xs text-gray-400">{batch.product.sku}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(batch.status)}`}>
                                            {batch.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-gray-800">{batch.quantity} <span className="text-xs font-normal text-gray-400">{batch.product.baseUnit}</span></span>
                                            <span className="text-xs text-gray-400">of {batch.initialQuantity}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-xs">
                                            <span className="text-gray-500">Mfg: {new Date(batch.manufactureDate).toLocaleDateString()}</span>
                                            <span className="text-red-500 font-medium">Exp: {new Date(batch.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(batch)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary transition-colors"
                                            >
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <BatchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedBatch}
            />
        </div>
    );
}
