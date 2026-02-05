"use client";
import SupplySidebar from "./ui/SupplySidebar";
import SupplyHeader from "./ui/SupplyHeader";
import StatCard from "./widgets/StatCard";
import AnalyticsHeatmapWidget from "./widgets/AnalyticsHeatmapWidget";
import ShipmentTrackingWidget from "./widgets/ShipmentTrackingWidget";
import RecentActivitiesWidget from "./widgets/RecentActivitiesWidget";
import { ArrowDownTrayIcon, ArrowPathIcon, PlusIcon, ArchiveBoxIcon, ExclamationCircleIcon, CubeIcon } from "@heroicons/react/24/outline";

// Reuse the DeliveryWidget map component or a simple placeholder map if preferred
// For cloning the design exactly, I will add a Map card here inline or reuse DeliveryWidget if it fits. 
// The reference image has a "Map" card. Let's create a inline map placeholder to match the design style.

export default function SupplyDashboard() {
    return (
        <div className="flex bg-gray-50 min-h-screen font-sans">
            <SupplySidebar />

            <main className="flex-1 ml-64 relative">
                <SupplyHeader />

                <div className="p-8 max-w-[1600px] mx-auto">
                    {/* Header Controls (Title area already in SupplyHeader, but design has extra controls) */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-text-main">Supply Chain Dashboard</h2>
                            <p className="text-text-muted mt-1">Real-time Order Processing & Distribution</p>
                        </div>

                        {/* Stats Row within the same header line in design, but for responsiveness better below or side */}
                        <div className="flex gap-4">
                            <StatCard
                                icon={ArchiveBoxIcon}
                                label="Total Pending Orders"
                                value="24"
                                trend={12.5}
                                trendLabel="vs yesterday"
                            />
                            <StatCard
                                icon={CubeIcon}
                                label="Ready for Delivery"
                                value="8"
                                trend={5.2}
                                trendLabel="new batches"
                            />
                            <StatCard
                                icon={ExclamationCircleIcon}
                                label="Delayed Deliveries"
                                value="3"
                                trend={-2.1}
                                trendLabel="decreased"
                                color="red"
                            />
                        </div>
                    </div>

                    {/* Operational Bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg"><CubeIcon className="w-5 h-5 text-gray-500" /></div>
                            <div>
                                <p className="font-bold text-sm text-text-main">Supply Chain Control</p>
                                <p className="text-xs text-text-muted">Today's Operations</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-full">
                                <ExclamationCircleIcon className="w-4 h-4" />
                                <span className="text-xs font-bold">2 orders require faster allocation</span>
                            </div>
                            <div className="h-8 w-[1px] bg-gray-200"></div>
                            <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50">
                                <ArrowDownTrayIcon className="w-5 h-5 text-gray-500" />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors">
                                <ArrowPathIcon className="w-5 h-5" /> Refresh
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
                                <PlusIcon className="w-5 h-5" /> New Allocation
                            </button>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Analytic View */}
                        <div className="col-span-12 lg:col-span-5 h-[500px]">
                            <AnalyticsHeatmapWidget />
                        </div>

                        {/* Inventory History / Shipment Tracking */}
                        <div className="col-span-12 lg:col-span-4 h-[500px]">
                            <ShipmentTrackingWidget />
                        </div>

                        {/* Map View */}
                        <div className="col-span-12 lg:col-span-3 h-[500px]">
                            <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 h-full relative overflow-hidden group">
                                <div className="absolute inset-0 bg-slate-200">
                                    {/* Mock Map Background */}
                                    <div className="w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))' }}>
                                        <path d="M100 100 Q 200 200, 300 150 T 450 300" stroke="#3b82f6" strokeWidth="4" fill="none" />
                                        <circle cx="100" cy="100" r="8" fill="#10b981" stroke="white" strokeWidth="3" />
                                        <circle cx="450" cy="300" r="8" fill="#3b82f6" stroke="white" strokeWidth="3" />
                                    </svg>
                                </div>

                                <button className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                </button>

                                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-2xl shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <CubeIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted font-bold uppercase">Location</p>
                                            <p className="text-sm font-bold text-text-main">Warehouse A - Jakarta</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Table */}
                    <RecentActivitiesWidget />
                </div>
            </main>
        </div>
    );
}
