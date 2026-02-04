"use client";
import {
    ClipboardDocumentListIcon,
    CubeIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    EllipsisHorizontalIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    TicketIcon,
    CheckIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function KitchenDashboardPage() {
    return (
        <div className="space-y-6">
            {/* 1. Top Stats Row - Cân bằng 3 cột */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Orders Card */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                        <ClipboardDocumentListIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">12</h3>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pending Orders</p>
                    </div>
                </div>

                {/* Production Card */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                        <CubeIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">5</h3>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Batches</p>
                    </div>
                </div>

                {/* Inventory Card */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">3</h3>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Low Stock Alerts</p>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Chart & Checklist) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tabs & Update Time */}
                    <div className="flex items-center justify-between">
                        <div className="flex bg-white rounded-full p-1 border border-gray-100 shadow-sm">
                            {['Daily', 'Weekly', 'Monthly'].map((tab, i) => (
                                <button key={tab} className={`px-5 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all ${i === 0 ? 'bg-black text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
                            <ClockIcon className="w-3.5 h-3.5" />
                            Last updated: Today, 2:30 PM
                        </div>
                    </div>

                    {/* Production Trend Chart */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 relative">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-sm font-bold text-gray-900">Production Output</h3>
                            <button className="text-gray-300"><EllipsisHorizontalIcon className="w-5 h-5" /></button>
                        </div>

                        <div className="w-full h-56 relative">
                            {/* SVG Chart - Đường cong đỏ mềm mại hơn */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                                <path d="M0,160 Q100,180 150,80 T300,100 T450,140 T600,100" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
                                <circle cx="300" cy="100" r="4" fill="white" stroke="#EF4444" strokeWidth="2" />
                            </svg>

                            {/* Tooltip */}
                            <div className="absolute top-8 left-[40%] bg-white px-3 py-2 rounded-xl shadow-2xl border border-gray-50 text-center">
                                <p className="text-[10px] text-gray-400 font-bold">Thursday 12th May</p>
                                <p className="text-sm font-black text-gray-900">1,240 Units</p>
                            </div>
                        </div>

                        <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-300 uppercase">
                            <span>09 Mo.</span><span>10 Tu.</span><span>11 We.</span><span>12 Th.</span><span>13 Fr.</span><span>14 Sa.</span><span>15 Su.</span>
                        </div>
                    </div>

                    {/* Morning Prep Checklist */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="text-orange-400"><ClockIcon className="w-5 h-5" /></div>
                            <h3 className="text-sm font-bold text-gray-900">Morning Prep Checklist</h3>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold mb-6">JUNE 24, 2025</p>

                        <div className="space-y-4">
                            {[
                                { t: 'Check inventory expiration dates', c: true },
                                { t: 'Calibrate ovens and fryers', c: true },
                                { t: 'Review franchise orders for today', c: true },
                                { t: 'Prepare batter mix for Batch #102', c: false }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${item.c ? 'bg-red-500 text-white' : 'border-2 border-gray-100'}`}>
                                        {item.c && <CheckIcon className="w-3.5 h-3.5" />}
                                    </div>
                                    <span className={`text-xs font-medium ${item.c ? 'text-gray-300 line-through' : 'text-gray-600'}`}>
                                        {item.t}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-colors">
                                Submit Checklist
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column (Actions & Info) */}
                <div className="space-y-4">
                    {/* Quick Action Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <button className="bg-black text-white p-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 h-24 hover:bg-gray-800 transition-colors">
                            <PlusIcon className="w-5 h-5" />
                            <span className="text-[10px] font-bold text-center leading-tight">Create Plan</span>
                        </button>
                        <button className="bg-yellow-400 text-gray-900 p-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 h-24 hover:bg-yellow-500 transition-colors">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            <span className="text-[10px] font-bold text-center leading-tight">Import Goods</span>
                        </button>
                        <button className="bg-red-500 text-white p-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-2 h-24 hover:bg-red-600 transition-colors">
                            <TicketIcon className="w-5 h-5" />
                            <span className="text-[10px] font-bold text-center leading-tight">Log Issue</span>
                        </button>
                    </div>

                    {/* Team Overview */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Team Overview</h3>
                            <button className="text-[10px] font-bold text-gray-400 hover:text-red-500">VIEW SHIFT</button>
                        </div>
                        <div className="flex justify-around items-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">6</div>
                                <div className="text-[9px] uppercase font-bold text-gray-300">Scheduled today</div>
                            </div>
                            <div className="h-8 w-px bg-gray-50"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">132 H</div>
                                <div className="text-[9px] uppercase font-bold text-gray-300">Total Hour today</div>
                            </div>
                        </div>
                    </div>

                    {/* Latest Shift Photo */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
                        <h3 className="text-[11px] font-bold text-gray-900 uppercase mb-4">Latest Shift photo</h3>
                        <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4">
                            <Image
                                src="/hero.webp" // Thay thế bằng ảnh thực tế của bạn
                                alt="Kitchen"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-300">23 June 2025</span>
                            <button className="bg-black text-white px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase hover:bg-gray-800 transition-colors">
                                View photo log
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}