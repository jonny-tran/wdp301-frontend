"use client";

import { useMemo, useState } from "react";
import { useProduct } from "@/hooks/useProduct";
import { Batch, Product } from "@/types/product";
import { XMarkIcon, CubeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import BatchCreateModal from "../../batch/_components/BatchFormModal";

export default function ProductBatchModal({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: Product | null }) {
  const { batchList } = useProduct();
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);

  const { data, isLoading } = batchList({
    productId: product?.id,
    limit: 100,
    page: 1,
    sortOrder: "DESC",
  });

  const responseData = data as Record<string, unknown> | undefined;
  const batches: Batch[] = useMemo(() => (responseData?.items || data || []) as Batch[], [responseData, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm shadow-2xl animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <CubeIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-wider uppercase text-text-main">
                Lô: {product?.name}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                SKU: {product?.sku}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddBatchOpen(true)}
              className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[10px] font-black text-white hover:bg-primary-dark transition-all shadow-lg"
            >
              <PlusIcon className="h-3.5 w-3.5 stroke-[3.5px]" /> NHẬP LÔ MỚI
            </button>
            <button
              onClick={onClose}
              title="Đóng"
              className="p-3 hover:bg-white rounded-full border border-slate-200"
            >
              <XMarkIcon className="h-6 w-6 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="py-20 text-center animate-pulse text-xs font-black text-slate-300">
              Đang kiểm kho...
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                  <th className="pb-4 px-4">Mã Lô</th>
                  <th className="pb-4 px-4">Hạn sử dụng</th>
                  <th className="pb-4 px-4 text-right">Số lượng tồn</th>
                  <th className="pb-4 px-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {batches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-5 px-4 font-black text-sm text-slate-700">
                      {batch.batchCode}
                    </td>
                    <td className="py-5 px-4 text-xs font-bold text-slate-400 italic">
                      {new Date(batch.expiryDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-5 px-4 text-right font-black text-slate-900">
                      {batch.currentQuantity}
                    </td>
                    <td className="py-5 px-4 text-center">
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          batch.status === "available"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-orange-50 text-orange-600 border-orange-100",
                        )}
                      >
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <BatchCreateModal
          isOpen={isAddBatchOpen}
          onClose={() => setIsAddBatchOpen(false)}
          batch={null}
          productId={product?.id}
          productName={product?.name}
        />
      </div>
    </div>
  );
}
