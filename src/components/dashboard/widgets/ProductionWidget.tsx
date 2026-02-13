"use client";
import { Squares2X2Icon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function ProductionWidget() {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                        <Squares2X2Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-text-main">Allocation</h3>
                        <p className="text-xs text-text-muted">Production & Distribution</p>
                    </div>
                </div>
                <div className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                        <span className="text-text-muted">Production Plan</span>
                        <span className="text-orange-600">85%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                        <span className="text-text-muted">Stock Allocated</span>
                        <span className="text-green-600">60%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <p className="text-sm font-bold text-text-main">Distribution Pending</p>
                    </div>
                    <p className="text-xs text-text-muted pl-5">3 batches pending for distribution to Store A & B.</p>
                </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-xl border border-gray-200 text-text-main font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                Manage Allocation <ArrowRightIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
