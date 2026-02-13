"use client";
import { ArrowTopRightOnSquareIcon, MapPinIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function ShipmentTrackingWidget() {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-text-main">Delivery Fleet Tracking</h3>
                <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400" />
            </div>

            <div className="border border-gray-100 rounded-2xl p-4 mb-4 flex items-center justify-between bg-gray-50">
                <span className="font-bold text-text-main text-sm">Order ID: #ORD-9982-AC</span>
                <ChevronUpIcon className="w-4 h-4 text-text-muted" />
            </div>

            <div className="flex-1 space-y-5">
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Current Location:</span>
                    <span className="font-bold text-text-main">VFC District 7 Store</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Departure Time:</span>
                    <span className="font-bold text-text-main">Today, 09:30 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Cargo Type:</span>
                    <span className="font-bold text-text-main">Mixed (Canned + Fresh)</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Route ID:</span>
                    <span className="font-bold text-text-main">R-102 (D7 - D4 - D1)</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Status:</span>
                    <span className="font-bold text-green-600">Unloading</span>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden relative">
                        {/* Placeholder for User Image */}
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
                    </div>
                    <div>
                        <p className="text-xs text-text-muted font-bold uppercase">Driver</p>
                        <p className="text-sm font-bold text-text-main">John Doe</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="p-3 rounded-full border border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-all">
                        <MapPinIcon className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
