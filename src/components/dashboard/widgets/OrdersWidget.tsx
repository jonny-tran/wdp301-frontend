"use client";
import { ClipboardDocumentListIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function OrdersWidget() {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <ClipboardDocumentListIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-text-main">Orders</h3>
                        <p className="text-xs text-text-muted">Consolidate & Classify</p>
                    </div>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Today</span>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-text-muted">Total Requests</span>
                    <span className="text-lg font-bold text-text-main">24</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                        <p className="text-xs text-yellow-600 font-bold uppercase mb-1">To Process</p>
                        <p className="text-2xl font-black text-yellow-700">8</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-xs text-green-600 font-bold uppercase mb-1">Standard</p>
                        <p className="text-2xl font-black text-green-700">12</p>
                    </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-purple-600 font-bold uppercase mb-1">Urgent / Special</p>
                        <p className="text-2xl font-black text-purple-700">4</p>
                    </div>
                </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-text-main text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors">
                Review Orders <ArrowRightIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
