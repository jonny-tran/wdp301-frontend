"use client";

import { useMemo, useState } from "react";
import { useClaim } from "@/hooks/useClaim";
import { extractClaims, extractClaimAnalytics } from "./claims.mapper";

// Components
import ClaimsTable from "./ClaimsTable";
import ClaimResolveModal from "./ClaimResolveModal";

export default function ClaimsClient() {
  // 1. Quản lý trạng thái UI
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected text-red-500"
  >("all");
  const [params, setParams] = useState<{
    page: number;
    limit: number;
    sortOrder: "ASC" | "DESC";
  }>({
    page: 1,
    limit: 10,
    sortOrder: "DESC",
  });
  const [modal, setModal] = useState<{
    isOpen: boolean;
    claimId: string | null;
  }>({
    isOpen: false,
    claimId: null,
  });

  // 2. Gọi Hook đúng tên hàm: claimList, claimAnalyticsSummary, claimDetail
  const { claimList, claimAnalyticsSummary, claimDetail } = useClaim();

  // Query dữ liệu
  const claimsQuery = claimList(params);
  const analyticsQuery = claimAnalyticsSummary({});
  const detailQuery = claimDetail(modal.claimId || "");

  // 3. Mapping dữ liệu phòng thủ
  const allClaims = useMemo(
    () => extractClaims(claimsQuery.data),
    [claimsQuery.data],
  );
  const stats = useMemo(
    () => extractClaimAnalytics(analyticsQuery.data),
    [analyticsQuery.data],
  );

  // 4. Client Filter
  const filteredClaims = useMemo(() => {
    if (activeTab === "all") return allClaims;
    return allClaims.filter((c) => c.status === activeTab);
  }, [allClaims, activeTab]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="px-1 space-y-1">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black leading-none">
          Quản lý Khiếu nại
        </h1>
        <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] italic">
          Hệ thống phê duyệt khiếu nại & Thất thoát hàng hóa
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-[2rem] w-fit shadow-sm">
        {[
          { id: "all", label: "Tất cả" },
          { id: "pending", label: "Chờ duyệt" },
          { id: "approved", label: "Chấp nhận" },
          { id: "rejected", label: "Từ chối" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300
              ${activeTab === tab.id
                ? "bg-black text-white shadow-2xl scale-[1.05]"
                : "text-black/30 hover:text-black hover:bg-white"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        <ClaimsTable
          items={filteredClaims}
          isLoading={claimsQuery.isLoading}
          onViewDetail={(id: string) => setModal({ isOpen: true, claimId: id })}
        />
      </div>

      <ClaimResolveModal
        isOpen={modal.isOpen}
        claimId={modal.claimId}
        detailData={detailQuery.data} // Dữ liệu trả về từ claimDetail(id).data
        isLoading={detailQuery.isLoading}
        onClose={() => setModal({ isOpen: false, claimId: null })}
      />
    </div>
  );
}
