"use client";
import { TruckIcon, ArrowRightIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function DeliveryWidget() {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <TruckIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-text-main">Logistics</h3>
                        <p className="text-xs text-text-muted">Schedule & Track</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-dashed border-gray-200 space-y-6">
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white ring-1 ring-green-100"></div>
                        <p className="text-xs font-bold text-green-600 mb-0.5">In Transit</p>
                        <p className="text-sm font-bold text-text-main">Truck #8821 - Route A</p>
                        <p className="text-xs text-text-muted">ETA: 14:30 PM</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white ring-1 ring-blue-100"></div>
                        <p className="text-xs font-bold text-blue-600 mb-0.5">Scheduled</p>
                        <p className="text-sm font-bold text-text-main">Truck #9910 - Route B</p>
                        <p className="text-xs text-text-muted">Departure: 16:00 PM</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-2 p-2 bg-indigo-50 rounded-lg">
                    <MapPinIcon className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-medium text-indigo-700">3 active shipments</span>
                </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-xl border border-gray-200 text-text-main font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                Track Fleet <ArrowRightIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
