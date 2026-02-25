"use client";

import { useState, useMemo } from "react";
import { useProduct } from "@/hooks/useProduct";
import { extractBatchItems } from "./batch.mapper";
import BatchTable from "./BatchTable";
import BatchFormModal from "./BatchFormModal";
import {
  InboxStackIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function BatchClient() {
  const { batchList } = useProduct();

  // 1. Quản lý trạng thái phân trang và tìm kiếm
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Quản lý trạng thái Modal hợp nhất
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  // 3. Fetch dữ liệu từ API
  const { data, isLoading, isError, isPlaceholderData } = batchList({
    page,
    limit: 10,
  });

  // 4. Mapper dữ liệu phòng thủ
  const items = useMemo(() => {
    const all = extractBatchItems(data);
    if (!searchTerm) return all;
    // Lọc client-side theo mã lô hàng
    return all.filter((b) =>
      b.batchCode.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const meta = data?.data?.meta || data?.meta;

  // 5. Logic đóng mở Modal
  const handleOpenCreate = () => {
    setSelectedBatch(null); // Không có data => Mode Create
    setIsModalOpen(true);
  };

  const handleOpenEdit = (batch: any) => {
    setSelectedBatch(batch); // Có data => Mode Edit
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-500">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-xl shadow-slate-200">
            <InboxStackIcon className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Inventory Batches
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-1">
              Manager Portal • Batch & Expiry Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 stroke-[3px]" />
            <input
              placeholder="Lọc mã lô hàng..."
              className="w-full pl-12 pr-6 py-4 rounded-full bg-white border border-slate-100 text-xs font-bold outline-none focus:border-indigo-600 focus:shadow-xl focus:shadow-indigo-50 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full text-xs font-black uppercase italic hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 border-b-4 border-indigo-800"
          >
            <PlusIcon className="h-4 w-4 stroke-[3px]" /> Khởi tạo Lô
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="rounded-[3.5rem] border border-slate-100 bg-white shadow-2xl overflow-hidden min-h-[550px] flex flex-col relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <ArrowPathIcon className="h-10 w-10 animate-spin text-indigo-600" />
          </div>
        )}

        <div className="flex-1">
          <BatchTable
            items={items}
            isLoading={isLoading && !isPlaceholderData}
            isError={isError}
            onEdit={handleOpenEdit} // Truyền hàm mở Edit Modal
          />
        </div>

        {/* Pagination Section */}
        {meta && meta.totalPages > 1 && (
          <div className="px-12 py-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">
                Trang {meta.currentPage} trên {meta.totalPages}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                Hiển thị {items.length} trên tổng số {meta.totalItems} lô hàng
              </span>
            </div>

            <div className="flex gap-3">
              <button
                disabled={page === 1 || isLoading}
                onClick={() => setPage((p) => p - 1)}
                className="p-3 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm active:scale-90"
              >
                <ChevronLeftIcon className="h-4 w-4 stroke-[3px]" />
              </button>
              <button
                disabled={page === meta.totalPages || isLoading}
                onClick={() => setPage((p) => p + 1)}
                className="p-3 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm active:scale-90"
              >
                <ChevronRightIcon className="h-4 w-4 stroke-[3px]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL HỢP NHẤT (CREATE/EDIT) */}
      <BatchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        batch={selectedBatch}
      />
    </div>
  );
}
