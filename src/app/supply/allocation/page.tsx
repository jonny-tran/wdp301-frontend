"use client";
import SupplyHeader from "@/components/dashboard/ui/SupplyHeader";
import SupplySidebar from "@/components/dashboard/ui/SupplySidebar";
import {
    CubeIcon,
    ArrowRightIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";

export default function SupplyAllocationPage() {
    const allocations = [
        { id: "AL-8821", orderId: "ORD-2024-002", batch: "BATCH-A-99", product: "Tomato Sauce", quantity: "200kg", status: "Allocated", progress: 100 },
        { id: "AL-8822", orderId: "ORD-2024-005", batch: "BATCH-B-12", product: "Flour Type 1", quantity: "500kg", status: "Pending", progress: 0 },
        { id: "AL-8823", orderId: "ORD-2024-006", batch: "BATCH-C-33", product: "Spices Mix", quantity: "50kg", status: "In Progress", progress: 60 },
    ];

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <SupplySidebar />

            <main className="flex-1 ml-64">
                <SupplyHeader title="Stock Allocation" />

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <CubeIcon className="w-6 h-6 text-white" />
                                </div>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm">Total Stock</span>
                            </div>
                            <p className="text-3xl font-black">2,450 kg</p>
                            <p className="text-sm text-blue-100 mt-1">Available for allocation</p>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                                    <ChartBarIcon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-3xl font-black text-text-main">85%</p>
                            <p className="text-sm text-text-muted mt-1">Production efficiency</p>
                            <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                                <div className="bg-orange-500 h-full rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-lg text-text-main mb-4">Quick Actions</h3>
                            <button className="w-full py-3 mb-2 rounded-xl bg-text-main text-white font-bold text-sm hover:bg-black transition-colors">
                                Auto-Allocate Pending
                            </button>
                            <button className="w-full py-3 rounded-xl border border-gray-200 text-text-main font-bold text-sm hover:bg-gray-50 transition-colors">
                                View Inventory Map
                            </button>
                        </div>
                    </div>

                    {/* Pending Allocations */}
                    <div>
                        <h2 className="text-xl font-bold text-text-main mb-4">Active Allocations</h2>
                        <div className="space-y-4">
                            {allocations.map((item) => (
                                <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">IMG</div>
                                        <div>
                                            <p className="font-bold text-text-main">{item.product}</p>
                                            <p className="text-xs text-text-muted">{item.batch} • {item.quantity}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 px-12">
                                        <div className="flex justify-between text-xs font-bold text-text-muted mb-1">
                                            <span>Progress</span>
                                            <span>{item.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${item.status === 'Pending' ? 'bg-gray-300' : 'bg-green-500'}`}
                                                style={{ width: `${item.progress === 0 && item.status !== 'Pending' ? 5 : item.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="text-right min-w-[120px]">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-1
                                            ${item.status === 'Allocated' ? 'bg-green-100 text-green-700' :
                                                item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'}`}>
                                            {item.status}
                                        </span>
                                        <p className="text-xs text-text-muted">For {item.orderId}</p>
                                    </div>

                                    <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-primary transition-colors ml-4">
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
