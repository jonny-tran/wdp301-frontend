import { useState, useEffect } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function AnalyticsHeatmapWidget() {
    // Mock data for heatmap visualization
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const [gridData, setGridData] = useState<number[][]>([]);

    useEffect(() => {
        // Generate random data only on the client side
        const data = Array.from({ length: 12 }, () =>
            Array.from({ length: 5 }, () => Math.floor(Math.random() * 5))
        );
        setGridData(data);
    }, []);

    const getIntensityClass = (value: number) => {
        switch (value) {
            case 0: return 'bg-gray-100';
            case 1: return 'bg-blue-200';
            case 2: return 'bg-blue-400';
            case 3: return 'bg-blue-600';
            case 4: return 'bg-blue-800';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-text-main">Production & Distribution Throughput</h3>
                    {/* <p className="text-xs text-text-muted">Order processing volume over time</p> */}
                </div>

                <div className="flex items-center gap-2">
                    {['Day', 'Week', 'Month', 'Quarter', 'Year', 'All'].map((tab, idx) => (
                        <button
                            key={tab}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${tab === 'Year' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-gray-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                    <button className="p-2 ml-2 hover:bg-gray-50 rounded-full text-gray-400">
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-text-main">180</span>
                        <ArrowTopRightOnSquareIcon className="w-3 h-3 text-text-muted" />
                    </div>
                    <p className="text-xs text-text-muted font-medium">Orders Processed</p>
                </div>
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-text-main">45</span>
                        <ArrowTopRightOnSquareIcon className="w-3 h-3 text-text-muted" />
                    </div>
                    <p className="text-xs text-text-muted font-medium">Avg Daily Requests</p>
                </div>
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-text-main">98%</span>
                        <ArrowTopRightOnSquareIcon className="w-3 h-3 text-text-muted" />
                    </div>
                    <p className="text-xs text-text-muted font-medium">On-Time Delivery</p>
                </div>
            </div>

            {/* Heatmap Visualization Mock */}
            <div className="w-full">
                <div className="grid grid-cols-[repeat(12,1fr)] gap-2 h-40">
                    {Array.from({ length: 12 }).map((_, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-2 h-full">
                            {/* Bars representing weeks/intensity */}
                            {Array.from({ length: 5 }).map((_, rowIndex) => {
                                // Default to 0 intensity before hydration
                                const intensity = gridData[colIndex]?.[rowIndex] ?? 0;
                                return (
                                    <div
                                        key={rowIndex}
                                        className={`flex-1 rounded-sm w-full ${getIntensityClass(intensity)}`}
                                    ></div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-[repeat(12,1fr)] gap-2 mt-2">
                    {months.map(m => (
                        <span key={m} className="text-[10px] text-center text-text-muted font-bold uppercase">{m}</span>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 mt-6 justify-center">
                    <span className="text-xs text-text-muted font-medium">Request Volume</span>
                    <div className="flex items-center gap-1 ml-2">
                        <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                        <span className="text-[10px] text-text-muted mr-2">Low</span>
                        <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                        <span className="text-[10px] text-text-muted mr-2">Normal</span>
                        <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                        <span className="text-[10px] text-text-muted mr-2">High</span>
                        <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                        <span className="text-[10px] text-text-muted mr-2">Peak</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
