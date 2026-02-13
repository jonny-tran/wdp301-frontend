"use client";
import { FunnelIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export default function RecentActivitiesWidget() {
    const activities = [
        { id: "#REQ-2024-001", store: "District 1 Store", items: "12 batches", date: "Today, 10:30", type: "Urgent Restock", assigned: "Truck #51D-123", status: "In Transit" },
        { id: "#REQ-2024-002", store: "Thu Duc Branch", items: "450kg Rice", date: "Today, 09:15", type: "Standard", assigned: "Warehouse A", status: "Processing" },
        { id: "#REQ-2024-003", store: "Binh Thanh Store", items: "8 batches", date: "Yesterday, 16:45", type: "Schedule Plan", assigned: "Pending", status: "Pending" },
        { id: "#REQ-2024-004", store: "District 7 Store", items: "20kg Spices", date: "Yesterday, 14:20", type: "Quick Restock", assigned: "Truck #59C-998", status: "Delivered" },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'In Transit': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                    <h3 className="text-lg font-bold text-text-main">Order Classification & Request Log</h3>
                    <div className="flex items-center gap-2">
                        {['All', 'Delivered', 'In Transit', 'Pending', 'Processing'].map((filter, idx) => (
                            <button
                                key={filter}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${idx === 0 ? 'bg-primary text-white' : 'text-text-muted hover:bg-gray-50'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-text-main">
                        <FunnelIcon className="w-4 h-4" /> Filter
                    </button>
                    <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                        <span>1-4 of 12</span>
                        <button className="p-1 hover:bg-gray-50 rounded"><ChevronLeftIcon className="w-3 h-3" /></button>
                        <button className="p-1 hover:bg-gray-50 rounded"><ChevronRightIcon className="w-3 h-3" /></button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 text-left">
                            <th className="py-4 pl-4"><input type="checkbox" className="rounded text-primary focus:ring-primary" /></th>
                            <th className="py-4 text-xs font-bold text-text-muted uppercase">Request ID</th>
                            <th className="py-4 text-xs font-bold text-text-muted uppercase">Store / Destination</th>
                            <th className="py-4 text-xs font-bold text-text-muted uppercase">Items / Volume</th>
                            <th className="py-4 text-xs font-bold text-text-muted uppercase">Requested Date</th>
                            <th className="py-4 text-xs font-bold text-text-muted uppercase">Type</th>
                            <th className="py-4 text-xs font-bold text-text-muted uppercase">Assigned To</th>
                            <th className="py-4 text-xs font-bold text-text-muted uppercase">Status</th>
                            <th className="py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {activities.map((item) => (
                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 pl-4"><input type="checkbox" className="rounded text-primary focus:ring-primary" /></td>
                                <td className="py-4 text-sm font-bold text-text-main">{item.id}</td>
                                <td className="py-4 text-sm text-text-main">{item.store}</td>
                                <td className="py-4 text-sm font-bold text-text-main">{item.items}</td>
                                <td className="py-4 text-sm text-text-main">{item.date}</td>
                                <td className="py-4 text-sm text-text-main">{item.type}</td>
                                <td className="py-4 text-sm text-text-main">{item.assigned}</td>
                                <td className="py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${getStatusStyle(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-4 text-right pr-4">
                                    <button className="text-gray-400 hover:text-text-main"><EllipsisHorizontalIcon className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
