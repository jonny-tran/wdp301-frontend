"use client";

import { ClaimAnalyticsSummary } from "@/types/claim";
import {
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { TrendingDownIcon } from "lucide-react";

export default function ClaimsAnalytics({
  stats,
}: {
  stats: ClaimAnalyticsSummary | null;
}) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* 1. Damage Rate */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
            Damage Rate
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {stats.damageRate}%
          </h3>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <TrendingDownIcon className="h-6 w-6 text-red-600" />
        </div>
      </div>

      {/* 2. Total Shipments */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
            Total Shipments
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            {stats.totalShipments.toLocaleString()}
          </h3>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <ArchiveBoxIcon className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      {/* 3. Bottleneck Analysis */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center transition-all hover:shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">
            Top Bottleneck
          </p>
        </div>

        {stats.bottleneckProducts.length > 0 ? (
          <div className="space-y-2 mt-1">
            {stats.bottleneckProducts.slice(0, 1).map((p) => (
              <div key={p.productId} className="flex justify-between items-end">
                <div className="truncate pr-2">
                  <p
                    className="text-sm font-semibold text-slate-900 truncate"
                    title={p.productName}
                  >
                    {p.productName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ID: {p.productId}
                  </p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="text-lg font-bold text-amber-600">
                    {p.totalIssues}
                  </span>
                  <span className="text-xs font-medium text-slate-400 ml-1">
                    lỗi
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-400 mt-1">
            Không có điểm nghẽn nghiêm trọng
          </p>
        )}
      </div>
    </div>
  );
}
