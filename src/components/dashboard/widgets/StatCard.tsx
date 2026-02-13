"use client";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    trend: number;
    trendLabel?: string;
    color?: "default" | "red" | "blue" | "green";
}

export default function StatCard({ icon: Icon, label, value, trend, trendLabel = "vs last week", color = "default" }: StatCardProps) {
    const isPositive = trend >= 0;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl text-text-main">
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-text-muted font-medium text-sm mb-1">{label}</h3>
                    <p className="text-3xl font-black text-text-main">{value}</p>
                </div>
            </div>

            <div className={`flex flex-col items-end ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <div className="flex items-center gap-1 font-bold text-sm bg-gray-50 px-2 py-1 rounded-full">
                    {isPositive ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                    <span>{Math.abs(trend)}%</span>
                </div>
                <span className="text-[10px] text-text-muted mt-1">{trendLabel}</span>
            </div>
        </div>
    );
}
