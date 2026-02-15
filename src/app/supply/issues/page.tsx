"use client";

import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

export default function SupplyIssuesPage() {
    const issues = [
        { id: 1, type: "Shortage Alert", desc: "Tomato Paste (Batch #441) is low on stock.", severity: "High", date: "Oct 24, 09:30 AM", status: "Open" },
        { id: 2, type: "Late Delivery", desc: "Order #ORD-2024-001 delayed by 2h due to traffic.", severity: "Medium", date: "Oct 24, 08:15 AM", status: "Investigating" },
        { id: 3, type: "Quality Flag", desc: "Customer reported damaged packaging on Order #ORD-2024-004.", severity: "Low", date: "Oct 23, 16:45 PM", status: "Resolved" },
    ];

    const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case "High": return "bg-red-100 text-red-700 border-red-200";
            case "Medium": return "bg-orange-100 text-orange-700 border-orange-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-red-500 rounded-3xl p-6 text-white shadow-lg shadow-red-500/20">
                    <p className="text-sm font-medium opacity-80">Critical Issues</p>
                    <p className="text-4xl font-black mt-2">3</p>
                    <p className="text-sm mt-2 font-medium bg-white/20 inline-block px-3 py-1 rounded-full">Requires attention</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-text-muted">Open Tickets</p>
                    <p className="text-4xl font-black text-text-main mt-2">12</p>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <p className="text-sm font-bold text-text-muted">Resolved Today</p>
                    <p className="text-4xl font-black text-green-600 mt-2">5</p>
                </div>
            </div>

            {/* Issue List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-text-main">Recent Reports</h3>
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search issues..."
                            className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-primary/20 border-none outline-none"
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                    {issues.map((issue) => (
                        <div key={issue.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-start gap-4">
                            <div className={`p-3 rounded-2xl ${issue.severity === 'High' ? 'bg-red-50' : 'bg-gray-100'}`}>
                                {issue.status === 'Resolved' ? (
                                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                ) : (
                                    <ExclamationTriangleIcon className={`w-6 h-6 ${issue.severity === 'High' ? 'text-red-500' : 'text-gray-500'}`} />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-text-main text-base">{issue.type}</h4>
                                    <span className="text-xs text-text-muted">{issue.date}</span>
                                </div>
                                <p className="text-sm text-text-muted mb-3">{issue.desc}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${getSeverityStyle(issue.severity)}`}>
                                        {issue.severity} Priority
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                        {issue.status}
                                    </span>
                                </div>
                            </div>

                            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-text-main hover:bg-black hover:text-white transition-all">
                                Resolve
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
