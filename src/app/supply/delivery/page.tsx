"use client";

import {
    TruckIcon,
    MapPinIcon,
    ClockIcon,
    PlusIcon
} from "@heroicons/react/24/outline";

export default function SupplyDeliveryPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Map Placeholder */}
            <div className="bg-slate-800 rounded-3xl h-64 w-full flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-lg">
                <div className="absolute inset-0 bg-slate-900/50 group-hover:bg-slate-900/40 transition-colors"></div>
                <div className="text-center z-10 text-white">
                    <MapPinIcon className="w-12 h-12 mx-auto mb-2 text-primary" />
                    <h3 className="text-xl font-bold">Live Fleet Map</h3>
                    <p className="text-sm text-gray-300">Click to expand detailed view</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Schedule */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-text-main">Today's Schedule</h3>
                        <button className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <PlusIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <ClockIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-text-main">Route #R-102</span>
                                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">14:00 PM</span>
                                </div>
                                <p className="text-sm text-text-muted">District 1 - District 3 - District 10</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-text-muted">Driver: Nguyen Van A</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
                            <div className="p-3 bg-gray-50 text-gray-600 rounded-xl">
                                <ClockIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-text-main">Route #R-104</span>
                                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">16:30 PM</span>
                                </div>
                                <p className="text-sm text-text-muted">Thu Duc - District 9</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                    <span className="text-xs text-text-muted">Driver: Pending</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Vehicles */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg text-text-main">Active Vehicles</h3>
                    </div>

                    <div className="space-y-4">
                        {['51D-123.45', '59C-998.22', '51D-445.10'].map((plate, index) => (
                            <div key={plate} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <TruckIcon className="w-5 h-5 text-text-main" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-text-main">{plate}</p>
                                        <p className="text-xs text-green-600 font-medium">In Transit</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-primary hover:underline">Track</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
