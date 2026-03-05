"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useClaim } from "@/hooks/useClaim";
<<<<<<< HEAD
import { extractClaims } from "./claims.mapper";
import ClaimTable from "./ClaimsTable";
import ClaimDetailView from "./ClaimDetailView";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
=======
import { Claim, ClaimAnalyticsSummary, QueryClaim } from "@/types/claim";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

export default function ClaimClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

<<<<<<< HEAD
  // 1. Quản lý ID để chuyển đổi giữa View Danh sách và View Chi tiết
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  // 2. Bóc tách params từ URL để đồng bộ hóa filter
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const limit = 10;

  // 3. Khởi tạo Hook và Queries
  const { claimList, resolveClaim } = useClaim();
  const {
    data: response,
    isLoading,
    refetch,
  } = claimList({
    page,
    limit,
    search,
    sortOrder: "DESC", // Thêm trường này để fix lỗi TypeScript
=======
export default function ClaimsClient() {
  // 1. Quản lý trạng thái UI
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected text-red-500"
  >("all");
  const [params, setParams] = useState<QueryClaim>({ page: 1, limit: 10, sortOrder: "DESC" });
  const [modal, setModal] = useState<{
    isOpen: boolean;
    claimId: string | null;
  }>({
    isOpen: false,
    claimId: null,
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
  });
  // 4. Mapping dữ liệu từ data.items của API
  const claims = extractClaims(response, (page - 1) * limit);

  // 5. Logic xử lý tìm kiếm cập nhật URL
  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("search", val);
    else params.delete("search");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // 6. Logic xử lý Phê duyệt nhanh (Resolve PATCH API)
  const handleResolve = (id: string) => {
    resolveClaim.mutate({
      id,
      data: {
        status: "approved",
        resolutionNote: "Đã phê duyệt thông qua trình quản lý nhanh.",
      },
    });
  };

<<<<<<< HEAD
  // --- LUỒNG 1: HIỂN THỊ CHI TIẾT KHIẾU NẠI (KHI CÓ ID) ---
  if (selectedClaimId) {
    return (
      <ClaimDetailView
        claimId={selectedClaimId}
        onBack={() => setSelectedClaimId(null)}
=======
  // 3. Mapping dữ liệu phòng thủ
  const allClaims: Claim[] = useMemo(() => (claimsQuery.data as any)?.items || (claimsQuery.data as any)?.data?.items || [], [claimsQuery.data]);
  const stats = useMemo(() => (analyticsQuery.data as any)?.data || analyticsQuery.data || null, [analyticsQuery.data]);

  // 4. Client Filter
  const filteredClaims = useMemo(() => {
    if (activeTab === "all") return allClaims;
    return allClaims.filter((c) => c.status === activeTab);
  }, [allClaims, activeTab]);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="px-1 space-y-1">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black leading-none">
          Claims Management
        </h1>
        <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] italic">
          Hệ thống phê duyệt khiếu nại & Thất thoát hàng hóa
        </p>
      </div>

      <ClaimsAnalytics stats={stats} />

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
        detailData={detailQuery.data ?? null} // Dữ liệu trả về từ claimDetail(id).data
        isLoading={detailQuery.isLoading}
        onClose={() => setModal({ isOpen: false, claimId: null })}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
      />
    );
  }

  // --- LUỒNG 2: HIỂN THỊ DANH SÁCH TỔNG HỢP ---
  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Quản lý <span className="text-indigo-600">Khiếu nại</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-3 italic">
            Theo dõi và xử lý thất thoát vận hành
          </p>
        </div>
      </div>

      {/* MAIN DATA CONTAINER */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative mx-4">
        {/* TOP BAR: SEARCH & STATUS FILTER */}
        <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 stroke-[2.5px]" />
            <input
              type="text"
              defaultValue={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm mã vận đơn (Shipment ID)..."
              className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 ring-indigo-500/10 transition-all shadow-sm italic placeholder:text-slate-300"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-sm">
              <ShieldCheckIcon className="w-4 h-4 text-indigo-500 stroke-[2.5px]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tất cả trạng thái
              </span>
            </div>
            <Button
              onClick={() => refetch()}
              className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowPathIcon
                className={`w-5 h-5 text-slate-500 stroke-[2.5px] ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* DATA TABLE */}
        {isLoading ? (
          <div className="py-40 text-center">
            <p className="font-black text-slate-200 italic uppercase text-[10px] tracking-[0.4em] animate-pulse">
              Đang đồng bộ hồ sơ khiếu nại...
            </p>
          </div>
        ) : (
          <ClaimTable
            data={claims}
            onSelect={(id: string) => setSelectedClaimId(id)}
            onResolve={handleResolve}
          />
        )}

        {/* FOOTER BAR */}
        <div className="bg-slate-50/50 px-10 py-6 border-t border-slate-50 flex justify-between items-center italic">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Tổng cộng: {response?.meta?.totalItems || 0} hồ sơ vận hành
          </p>
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-emerald-600 uppercase">
              Hệ thống thời gian thực
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
