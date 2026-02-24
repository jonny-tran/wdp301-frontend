"use client";

import { useState } from "react";
import { useProduct } from "@/hooks/useProduct";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

export default function BatchCreateModal({
  isOpen,
  onClose,
  productId,
  productName,
}: any) {
  const { createBatch } = useProduct();
  const [formData, setFormData] = useState({
    batchCode: `BATCH-${Date.now()}`, // Tự động gợi ý mã lô
    expiryDate: "",
    initialQuantity: 1,
    productId: productId,
  });

  const handleSubmit = async () => {
    if (!formData.expiryDate) return toast.error("Vui lòng chọn hạn sử dụng");
    try {
      await createBatch.mutateAsync({ ...formData, productId });
      toast.success("Đã nhập lô hàng mới thành công!");
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 space-y-6 shadow-2xl animate-in zoom-in">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">
            Nhập lô: {productName}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Mã Lô Hàng
            </label>
            <input
              value={formData.batchCode}
              onChange={(e) =>
                setFormData({ ...formData, batchCode: e.target.value })
              }
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Số lượng ban đầu
            </label>
            <input
              type="number"
              min={1}
              value={formData.initialQuantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  initialQuantity: Number(e.target.value),
                })
              }
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Hạn sử dụng
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 py-5 text-xs font-black text-white hover:bg-blue-700 shadow-xl active:scale-95"
        >
          <CheckIcon className="h-4 w-4 stroke-[3px]" /> XÁC NHẬN NHẬP KHO
        </button>
      </div>
    </div>
  );
}
