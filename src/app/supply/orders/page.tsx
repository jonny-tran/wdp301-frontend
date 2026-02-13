"use client";
import SupplyHeader from "@/components/dashboard/ui/SupplyHeader";
import SupplySidebar from "@/components/dashboard/ui/SupplySidebar";
import {
    FunnelIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function SupplyOrdersPage() {
    const orders = [
        { id: "ORD-2024-001", store: "VFC District 1", date: "Oct 24, 2024", items: 12, status: "To Process", priority: "High" },
        { id: "ORD-2024-002", store: "VFC District 3", date: "Oct 24, 2024", items: 8, status: "In Production", priority: "Normal" },
        { id: "ORD-2024-003", store: "VFC Thu Duc", date: "Oct 23, 2024", items: 24, status: "Ready to Ship", priority: "Normal" },
        { id: "ORD-2024-004", store: "VFC District 7", date: "Oct 23, 2024", items: 5, status: "Completed", priority: "Normal" },
        { id: "ORD-2024-005", store: "VFC Binh Thanh", date: "Oct 24, 2024", items: 15, status: "To Process", priority: "Urgent" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "To Process": return "bg-yellow-100 text-yellow-700";
            case "In Production": return "bg-blue-100 text-blue-700";
            case "Ready to Ship": return "bg-purple-100 text-purple-700";
            case "Completed": return "bg-green-100 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Urgent": return "text-red-600 font-bold";
            case "High": return "text-orange-600 font-semibold";
            default: return "text-gray-600";
        }
    };

    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <SupplySidebar />

            <main className="flex-1 ml-64">
                <SupplyHeader title="Order Management" />

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-text-muted font-bold uppercase">New Orders</p>
                            <p className="text-2xl font-black text-text-main mt-1">12</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-text-muted font-bold uppercase">Processing</p>
                            <p className="text-2xl font-black text-blue-600 mt-1">5</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-text-muted font-bold uppercase">Pending Delivery</p>
                            <p className="text-2xl font-black text-purple-600 mt-1">3</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-text-muted font-bold uppercase">Completed Today</p>
                            <p className="text-2xl font-black text-green-600 mt-1">8</p>
                        </div>
                    </div>

                    {/* Filters & Actions */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 flex items-center gap-2">
                                <FunnelIcon className="w-4 h-4" /> Filter
                            </button>
                            <div className="h-6 w-[1px] bg-gray-300 mx-2"></div>
                            <span className="text-sm font-bold text-primary cursor-pointer border-b-2 border-primary pb-0.5">All Orders</span>
                            <span className="text-sm text-text-muted cursor-pointer hover:text-text-main px-2">Urgent</span>
                            <span className="text-sm text-text-muted cursor-pointer hover:text-text-main px-2">To Process</span>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
                            <ArrowPathIcon className="w-4 h-4" /> Refresh
                        </button>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">Order ID</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">Store</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">Requested Date</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">Items</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">Priority</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="p-5 font-bold text-text-main text-sm">{order.id}</td>
                                        <td className="p-5 text-sm text-text-main">{order.store}</td>
                                        <td className="p-5 text-sm text-text-muted">{order.date}</td>
                                        <td className="p-5 text-sm text-text-main font-medium">{order.items} items</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className={`p-5 text-sm ${getPriorityColor(order.priority)}`}>
                                            {order.priority === 'Urgent' && <ExclamationCircleIcon className="w-4 h-4 inline mr-1" />}
                                            {order.priority}
                                        </td>
                                        <td className="p-5">
                                            <button className="text-primary text-xs font-bold hover:underline">
                                                Active details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
