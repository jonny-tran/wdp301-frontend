"use client";

import { useState } from "react";
import {
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ArrowTrendingDownIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

import { ClaimAnalyticsSummary } from "@/types/claim";

export default function ClaimsAnalytics({ stats }: { stats: ClaimAnalyticsSummary | null }) {
  const [searchId, setSearchId] = useState("");

  if (!stats) return null;

  // Tìm kiếm sản phẩm trong danh sách bottlenecks dựa trên ID nhập vào
  const searchedProduct = stats.bottleneckProducts.find(
    (p) => p.productId.toString() === searchId.trim(),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Damage Rate */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] relative z-10">
          Damage Rate
        </p>
        <h3 className="text-5xl font-black text-black italic tracking-tighter mt-2 relative z-10">
          {stats.damageRate}%
        </h3>
        <ArrowTrendingDownIcon className="h-20 w-20 text-red-500 absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity" />
      </div>

      {/* 2. Total Shipments */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] relative z-10">
          Total Shipments
        </p>
        <h3 className="text-5xl font-black text-black italic tracking-tighter mt-2 relative z-10">
          {stats.totalShipments}
        </h3>
        <ArchiveBoxIcon className="h-20 w-20 text-black absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity" />
      </div>

      {/* 3. Bottleneck Search & List (Thẻ Đen) */}
      <div className="bg-primary p-8 rounded-[2.5rem] shadow-2xl relative min-h-[220px] overflow-hidden">
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400" />
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              Bottleneck Analysis
            </p>
          </div>

          {/* Ô nhập Product ID để tra cứu nhanh */}
          {/* <div className="flex items-center bg-white/10 rounded-full px-3 py-1 border border-white/10 focus-within:border-white/40 transition-all">
            <MagnifyingGlassIcon className="h-3 w-3 text-white/40 mr-2" />
            <input
              type="text"
              placeholder="ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="bg-transparent border-none text-[10px] font-black text-white w-12 focus:w-20 transition-all outline-none placeholder:text-white/20"
            />
          </div> */}
        </div>

        <div className="space-y-4 relative z-10">
          {searchId ? (
            searchedProduct ? (
              <div className="animate-in fade-in slide-in-from-left-2 duration-500">
                <p className="text-[11px] font-black text-white uppercase italic truncate">
                  {searchedProduct.productName}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-yellow-400 italic leading-none">
                    {searchedProduct.totalIssues}
                  </span>
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-tighter">
                    Lỗi: Damaged {searchedProduct.damageCount} / Missing{" "}
                    {searchedProduct.missingCount}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[10px] font-bold text-white/20 italic uppercase py-4">
                ID #{searchId} không có trong danh sách nghẽn
              </p>
            )
          ) : (
            /* Hiển thị Top 2 mặc định nếu không search */
            stats.bottleneckProducts.slice(0, 2).map((p) => (
              <div
                key={p.productId}
                className="border-l-2 border-white/10 pl-4 py-1 hover:border-yellow-400 transition-colors"
              >
                <p className="text-[10px] font-black text-white uppercase italic truncate opacity-80">
                  #{p.productId} - {p.productName}
                </p>
                <p className="text-[12px] font-black text-yellow-400 italic">
                  {p.totalIssues}{" "}
                  <span className="text-[8px] text-white/40 ml-1 not-italic">
                    lỗi
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
