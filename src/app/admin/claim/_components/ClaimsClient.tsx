"use client";

import { useMemo, useState, useCallback } from "react";
import { useClaim } from "@/hooks/useClaim";
import { Claim, QueryClaim } from "@/types/claim";
import { PaginationMeta } from "@/types/base";
import { ClaimStatus } from "@/utils/enum";
import { BasePagination } from "@/components/layout/BasePagination";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Components
import ClaimsTable from "./ClaimsTable";
import ClaimResolveModal from "./ClaimResolveModal";

type ClaimsTab = "all" | "pending" | "approved" | "rejected";

/** Cấu trúc response wrapper cho danh sách claims */
interface ClaimListResponse {
  items?: Claim[];
  meta?: PaginationMeta;
  data?: {
    items?: Claim[];
    meta?: PaginationMeta;
  };
}

const TABS: { id: ClaimsTab; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ duyệt" },
  { id: "approved", label: "Chấp nhận" },
  { id: "rejected", label: "Từ chối" },
];

export default function ClaimsClient() {
  const [activeTab, setActiveTab] = useState<ClaimsTab>("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    claimId: string | null;
  }>({
    isOpen: false,
    claimId: null,
  });

  // Query params — gắn status filter vào API call
  const queryParams: QueryClaim = useMemo(
    () => ({
      page,
      limit: 10,
      sortOrder: "DESC" as const,
      ...(activeTab !== "all"
        ? { status: activeTab as ClaimStatus }
        : {}),
    }),
    [page, activeTab],
  );

  const { claimList, claimDetail } = useClaim();

  const claimsQuery = claimList(queryParams);
  const detailQuery = claimDetail(modal.claimId || "");

  // Mapping dữ liệu phòng thủ
  const allClaims: Claim[] = useMemo(() => {
    const data = claimsQuery.data as ClaimListResponse | undefined;
    return data?.items || data?.data?.items || [];
  }, [claimsQuery.data]);

  // Pagination meta
  const meta = useMemo(() => {
    const data = claimsQuery.data as ClaimListResponse | undefined;
    const m = data?.meta || data?.data?.meta;
    return {
      currentPage: m?.currentPage ?? page,
      totalPages: m?.totalPages ?? 1,
      totalItems: m?.totalItems ?? 0,
      itemsPerPage: m?.itemsPerPage ?? 10,
    };
  }, [claimsQuery.data, page]);

  const handleTabChange = useCallback((tab: ClaimsTab) => {
    setActiveTab(tab);
    setPage(1); // Reset page khi đổi tab
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-1">
        <div className="p-2.5 bg-primary rounded-2xl shadow-lg shadow-primary/20">
          <ExclamationTriangleIcon className="h-6 w-6 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 leading-none">
            Quản lý khiếu nại
          </h1>
          <p className="text-xs text-slate-400">
            Hệ thống theo dõi khiếu nại &amp; thất thoát hàng hóa
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABLE + PAGINATION */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden flex flex-col min-h-[500px]">
        <ClaimsTable
          items={allClaims}
          isLoading={claimsQuery.isLoading}
          onViewDetail={(id: string) => setModal({ isOpen: true, claimId: id })}
        />
        <div className="mt-auto border-t border-slate-100 px-6 py-4">
          <BasePagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            itemsPerPage={meta.itemsPerPage}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* DETAIL MODAL */}
      <ClaimResolveModal
        isOpen={modal.isOpen}
        claimId={modal.claimId}
        detailData={detailQuery.data ?? null}
        isLoading={detailQuery.isLoading}
        onClose={() => setModal({ isOpen: false, claimId: null })}
      />
    </div>
  );
}
