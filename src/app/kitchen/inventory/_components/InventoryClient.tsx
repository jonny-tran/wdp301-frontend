"use client";
import React, { useState } from "react";
import { Ingredient } from "@/types/ingredient";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

// Mock Data
const MOCK_INGREDIENTS: Ingredient[] = [
    { id: 1, name: "Chicken Wings (Raw)", sku: "ING-001", category: "meat", currentStock: 120, unit: "kg", minStockLevel: 50, lastRestocked: "2023-10-24" },
    { id: 2, name: "Chicken Thighs (Raw)", sku: "ING-002", category: "meat", currentStock: 40, unit: "kg", minStockLevel: 45, lastRestocked: "2023-10-22" },
    { id: 3, name: "Flour Mix (Original)", sku: "ING-005", category: "spice", currentStock: 200, unit: "kg", minStockLevel: 50, lastRestocked: "2023-10-20" },
    { id: 4, name: "Cooking Oil", sku: "ING-008", category: "spice", currentStock: 80, unit: "L", minStockLevel: 30, lastRestocked: "2023-10-25" },
    { id: 5, name: "Cabbage (Fresh)", sku: "ING-010", category: "vegetable", currentStock: 15, unit: "kg", minStockLevel: 20, lastRestocked: "2023-10-24" },
];

export default function InventoryClient() {
    const [ingredients, setIngredients] = useState<Ingredient[]>(MOCK_INGREDIENTS);
    const [filterCategory, setFilterCategory] = useState<string>("all");

    const filteredIngredients = filterCategory === "all"
        ? ingredients
        : ingredients.filter(i => i.category === filterCategory);

    const getStockStatus = (current: number, min: number) => {
        if (current <= min) return "low";
        if (current <= min * 1.2) return "warning";
        return "good";
    };

    return (
        <div className="flex flex-col space-y-6 pb-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor raw material stock levels and manage procurement.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                        <ArrowPathIcon className="w-5 h-5" />
                        <span>Sync</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                        <PlusIcon className="w-5 h-5" />
                        <span>Add Ingredient</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search ingredients..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <select
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 outline-none focus:border-primary transition-all"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="meat">Meat</option>
                    <option value="vegetable">Vegetables</option>
                    <option value="spice">Spices & Oil</option>
                    <option value="packaging">Packaging</option>
                </select>
            </div>

            {/* Inventory List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Ingredient Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Stock Level</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Last Restocked</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredIngredients.map((item) => {
                                const status = getStockStatus(item.currentStock, item.minStockLevel);
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{item.name}</span>
                                                <span className="text-xs text-gray-400">{item.sku}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="capitalize px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono">
                                            <span className="font-bold text-gray-800 text-base">{item.currentStock}</span>
                                            <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {status === 'low' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200">
                                                    <ExclamationTriangleIcon className="w-3 h-3" /> Low Stock
                                                </span>
                                            )}
                                            {status === 'warning' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold border border-yellow-200">
                                                    Warning
                                                </span>
                                            )}
                                            {status === 'good' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                                                    Good
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(item.lastRestocked).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold text-primary hover:underline">
                                                Order More
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
