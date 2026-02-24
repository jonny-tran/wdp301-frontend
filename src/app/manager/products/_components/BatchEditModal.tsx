"use client";

import { useEffect, useState } from "react";
import { useProduct } from "@/hooks/useProduct"; // Đã đổi từ useBatches
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function BatchEditModal({ isOpen, onClose, batch }: any) {
  const { updateBatch } = useProduct();
  const [formData, setFormData] = useState({
    initialQuantity: 0,
    imageUrl: "",
    status: "pending",
  });

  useEffect(() => {
    if (isOpen && batch) {
      setFormData({
        initialQuantity: Number(batch.currentQuantity) || 0,
        imageUrl: batch.imageUrl || "",
        status: batch.status || "pending",
      });
    }
  }, [isOpen, batch]);

  const handleSubmit = async () => {
    try {
      // Khớp params với hook: { id, data }
      await updateBatch.mutateAsync({
        id: batch.id,
        data: {
          initialQuantity: formData.initialQuantity,
          imageUrl: formData.imageUrl,
          status: formData.status as any,
        },
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in border border-slate-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">
            Sửa Lô: {batch?.batchCode}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Ảnh xác nhận
            </label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Số lượng ban đầu
            </label>
            <input
              type="number"
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white"
              value={formData.initialQuantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  initialQuantity: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Trạng thái
            </label>
            <select
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="available">Available</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={updateBatch.isPending}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-slate-900 py-5 text-xs font-black text-white hover:bg-black transition-all active:scale-95 disabled:bg-slate-300 shadow-xl"
        >
          {updateBatch.isPending ? "Đang lưu..." : "XÁC NHẬN LƯU"}
        </button>
      </div>
    </div>
  );
}
