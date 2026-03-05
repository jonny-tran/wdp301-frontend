"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/hooks/useStore";
import { Store, StoreReliabilityAnalytics, StoreDemandPatternAnalytics } from "@/types/store";

// Components
import StoreTable from "./StoreTable";
import StoreModal from "./StoreModal";
import StoreReliability from "./StoreReliability";
import DemandPattern from "./DemandPattern";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

// Icons
import {
  PlusIcon,
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function StoreClient() {
  // 1. Quản lý Params theo cấu trúc Query API của Hàn
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    isActive: undefined as boolean | undefined,
    sortOrder: "DESC" as "ASC" | "DESC",
    sortBy: "createdAt",
  });

  // ID sản phẩm để soi biểu đồ nhu cầu
  const [demandProductId, setDemandProductId] = useState<number>(1);
  const [modal, setModal] = useState({ isOpen: false, editingStore: null });

  // 2. Gọi đúng tên hàm từ useStore.ts của Hàn
  const {
    storeList,
    deleteStore,
    storeReliabilityAnalytics,
    storeDemandPatternAnalytics,
  } = useStore();

  const { data: listData, isLoading: isListLoading } = storeList(params);
  const { data: reliabilityRaw } = storeReliabilityAnalytics();
  const { data: demandRaw, isLoading: isDemandLoading } =
    storeDemandPatternAnalytics({
      productId: demandProductId,
    });

  // 3. Sử dụng Raw data trực tiếp
  const stores: Store[] = useMemo(() => (listData as any)?.items || listData?.items || [], [listData]);
  const reliabilityStats: StoreReliabilityAnalytics = useMemo(
    () => (reliabilityRaw as any)?.data || reliabilityRaw || [],
    [reliabilityRaw],
  );
  const demandPattern: StoreDemandPatternAnalytics = useMemo(
    () => (demandRaw as any)?.data || demandRaw || [],
    [demandRaw],
  );

  const meta = (listData as any)?.meta || (listData as any)?.data?.meta || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setParams({ ...params, page: newPage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700 pb-20 p-1 md:p-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-black rounded-xl">
              <BuildingStorefrontIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black">
              Store Intel
            </h1>
          </div>
          <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] italic ml-1">
            Quản lý mạng lưới chi nhánh & Phân tích [cite: 2026-02-25]
          </p>
        </div>

        <Can I={P.STORE_CREATE} on={Resource.STORE}>
          <button
            onClick={() => setModal({ isOpen: true, editingStore: null })}
            className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
          >
            <PlusIcon className="h-4 w-4 stroke-[3px]" />
            Add Store
          </button>
        </Can>
      </div>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Render an toàn: Chỉ render khi có dữ liệu chartData */}
        <DemandPattern
          data={demandPattern}
          isLoading={isDemandLoading}
          onSearchId={(id: number) => setDemandProductId(id)}
        />
        <StoreReliability stats={reliabilityStats} />
      </div>

      {/* FILTER BAR SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="md:col-span-2 relative group">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="Search by name..."
            value={params.search}
            onChange={(e) =>
              setParams({ ...params, search: e.target.value, page: 1 })
            }
            className="w-full bg-white border-none rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-black focus:ring-2 focus:ring-black/5 outline-none transition-all shadow-sm"
          />
        </div>

        <select
          value={
            params.isActive === undefined ? "" : params.isActive.toString()
          }
          onChange={(e) =>
            setParams({
              ...params,
              isActive:
                e.target.value === "" ? undefined : e.target.value === "true",
              page: 1,
            })
          }
          className="bg-white border-none rounded-2xl py-3.5 px-6 text-[10px] font-black uppercase tracking-widest text-black outline-none shadow-sm cursor-pointer appearance-none"
        >
          <option value="">-- Trạng thái --</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <select
          value={params.sortOrder}
          onChange={(e) =>
            setParams({ ...params, sortOrder: e.target.value as any, page: 1 })
          }
          className="bg-white border-none rounded-2xl py-3.5 px-6 text-[10px] font-black uppercase tracking-widest text-black outline-none shadow-sm cursor-pointer appearance-none"
        >
          <option value="DESC">DESC (Mới nhất)</option>
          <option value="ASC">ASC (Cũ nhất)</option>
        </select>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[550px] flex flex-col">
        <div className="flex-1">
          <StoreTable
            items={stores}
            isLoading={isListLoading}
            onEdit={(s: any) => setModal({ isOpen: true, editingStore: s })}
            onDelete={(id: string) =>
              confirm("Xóa store?") && deleteStore.mutate(id)
            }
          />
        </div>

        {/* PAGINATION */}
        <div className="px-10 py-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/80">
          <div className="text-[10px] font-black uppercase tracking-[0.2em]">
            <p>
              Trang {meta.currentPage} / {meta.totalPages}
            </p>
            <p className="text-[9px] font-bold text-black/30 mt-1 uppercase italic">
              Total {meta.totalItems} stores found
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(params.page - 1)}
              disabled={params.page === 1 || isListLoading}
              className="p-3 rounded-xl border border-slate-100 hover:bg-black hover:text-white disabled:opacity-10 transition-all shadow-sm"
            >
              <ChevronLeftIcon className="h-4 w-4 stroke-[3px]" />
            </button>

            <div className="flex gap-1.5">
              {[...Array(meta.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-11 h-11 rounded-xl text-[10px] font-black transition-all ${params.page === i + 1
                    ? "bg-black text-white shadow-xl"
                    : "bg-slate-50 text-black/40 hover:bg-slate-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(params.page + 1)}
              disabled={params.page === meta.totalPages || isListLoading}
              className="p-3 rounded-xl border border-slate-100 hover:bg-black hover:text-white disabled:opacity-10 transition-all shadow-sm"
            >
              <ChevronRightIcon className="h-4 w-4 stroke-[3px]" />
            </button>
          </div>
        </div>
      </div>

      <StoreModal
        isOpen={modal.isOpen}
        editingStore={modal.editingStore}
        onClose={() => setModal({ isOpen: false, editingStore: null })}
      />
    </div>
  );
}
