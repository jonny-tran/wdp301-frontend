"use client";
import { ExclamationTriangleIcon, ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function IssuesWidget() {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 hover:shadow-md transition-all relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full opacity-50 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <ExclamationTriangleIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-text-main">Issues</h3>
                        <p className="text-xs text-text-muted">Action Required</p>
                    </div>
                </div>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">2 Active</span>
            </div>

            <div className="space-y-3 relative z-10">
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-text-main">Shortage Alert</p>
                            <p className="text-xs text-text-muted mt-0.5">Tomato Paste (Batch #441) is low on stock.</p>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-text-main">Late Delivery</p>
                            <p className="text-xs text-text-muted mt-0.5">Order #ORD-2024-001 delayed by 2h.</p>
                        </div>
                    </div>
                </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-colors relative z-10">
                Resolve Issues <ArrowRightIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
