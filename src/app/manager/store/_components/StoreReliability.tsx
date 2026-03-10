"use client";

import { StoreReliabilityAnalytics } from "@/types/store";
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function StoreReliability({ stats }: { stats: StoreReliabilityAnalytics | null }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chỉ số trung bình hệ thống */}
      <div className="bg-primary p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
          System Claim Average
        </p>
        <div className="mt-4">
          <h3 className="text-6xl font-black text-white italic tracking-tighter leading-none">
            {stats.systemAverage?.averageClaimRatePercentage}%
          </h3>
          <p className="text-[9px] font-bold text-white/30 uppercase mt-4 tracking-widest">
            Dựa trên {stats.systemAverage?.totalShipments} đơn vận chuyển toàn quốc
          </p>
        </div>
      </div>

      {/* Danh sách Store cần chú ý */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            Store Reliability Ranking
          </p>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase text-red-500">
              Fraud Warning Active
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {stats.storeAnalysis?.slice(0, 3).map((s) => (
            <div
              key={s.storeId}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-black transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${s.isFraudWarning ? "bg-red-100 text-red-600" : "bg-primary text-white"}`}
                >
                  {s.isFraudWarning ? (
                    <ExclamationTriangleIcon className="h-4 w-4" />
                  ) : (
                    <ShieldCheckIcon className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-black text-black uppercase italic">
                    {s.storeName}
                  </p>
                  <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">
                    Hỏng: {s.totalDamagedQty} đơn
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-xl font-black italic tracking-tighter ${s.claimRatePercentage > (stats.systemAverage?.averageClaimRatePercentage || 0) ? "text-red-500" : "text-black"}`}
                >
                  {s.claimRatePercentage}%
                </p>
                <p className="text-[8px] font-bold text-black/20 uppercase">
                  Claim Rate
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
