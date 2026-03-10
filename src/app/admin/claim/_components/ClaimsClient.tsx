"use client";

import { useMemo, useState } from "react";
import { useClaim } from "@/hooks/useClaim";
import { Claim } from "@/types/claim";
import { PaginationMeta } from "@/types/base";

// Components
import ClaimsTable from "./ClaimsTable";
import ClaimResolveModal from "./ClaimResolveModal";

type ClaimsTab = "all" | "pending" | "approved" | "rejected";

interface ClaimListParams {
  page: number;
  limit: number;
  sortOrder: "ASC" | "DESC";
}

/** Cấu trúc response wrapper cho danh sách claims */
interface ClaimListResponse {
  items?: Claim[];
  meta?: PaginationMeta;
  data?: {
    items?: Claim[];
    meta?: PaginationMeta;
  };
}

export default function ClaimsClient() {
  // 1. Quản lý trạng thái UI
  const [activeTab, setActiveTab] = useState<ClaimsTab>("all");
  const [params] = useState<ClaimListParams>({ page: 1, limit: 10, sortOrder: "DESC" });
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
  const _analyticsQuery = claimAnalyticsSummary({});
  void _analyticsQuery; // Analytics data used for future dashboard charts
  const detailQuery = claimDetail(modal.claimId || "");

  // 3. Mapping dữ liệu phòng thủ
  const allClaims: Claim[] = useMemo(() => {
    const data = claimsQuery.data as ClaimListResponse | undefined;
    return data?.items || data?.data?.items || [];
  }, [claimsQuery.data]);

  // 4. Client Filter
  const filteredClaims = useMemo(() => {
    if (activeTab === "all") return allClaims;
    return allClaims.filter((c) => c.status === activeTab);
  }, [allClaims, activeTab]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="px-1 space-y-1">
        <h1 className="text-3xl font-black font-display tracking-wider uppercase text-text-main leading-none">
          Quản lý Khiếu nại
        </h1>
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] italic">
          Hệ thống phê duyệt khiếu nại &amp; Thất thoát hàng hóa
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-[2rem] w-fit shadow-sm">
        {([
          { id: "all" as const, label: "Tất cả" },
          { id: "pending" as const, label: "Chờ duyệt" },
          { id: "approved" as const, label: "Chấp nhận" },
          { id: "rejected" as const, label: "Từ chối" },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300
              ${activeTab === tab.id
                ? "bg-primary text-white shadow-2xl scale-[1.05]"
                : "text-text-muted hover:text-black hover:bg-white"
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
        detailData={detailQuery.data ?? null} // Dữ liệu trả về từ claimDetail(id).data
        isLoading={detailQuery.isLoading}
        onClose={() => setModal({ isOpen: false, claimId: null })}
      />
    </div>
  );
}
