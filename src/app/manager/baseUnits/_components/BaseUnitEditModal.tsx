"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { BaseUnitRow } from "./base-unit.types";
import { toast } from "sonner";

interface BaseUnitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BaseUnitRow | null;
}

export default function BaseUnitEditModal({
  isOpen,
  onClose,
  data,
}: BaseUnitEditModalProps) {
  const { updateBaseUnit } = useBaseUnit(); // Gọi PATCH /base-units/:id
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Đồng bộ dữ liệu cũ vào Form khi mở Modal
  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        name: data.name ?? "",
        description: data.description ?? "",
      });
    }
  }, [data, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    try {
      await updateBaseUnit.mutateAsync({
        id: data.id,
        data: formData,
      });
      toast.success("Cập nhật đơn vị thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Cột trái: Form nhập liệu (Light Mode) */}
          <div className="md:col-span-7 p-12 space-y-8 bg-white">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                  Tên đơn vị
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-full border border-slate-200 bg-slate-50/50 px-8 py-5 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                  Mô tả
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-[2.5rem] border border-slate-200 bg-slate-50/50 px-8 py-5 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Cột phải: Header & Hành động */}
          <div className="md:col-span-5 flex flex-col justify-between p-12 bg-slate-50/50 border-l border-slate-100">
            <div className="relative p-8 rounded-[2rem] bg-white border border-slate-200 text-center shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tighter italic leading-tight text-slate-900">
                Chỉnh sửa <br /> Đơn vị tính
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3">
                Manager Control Mode
              </p>
              <button
                onClick={onClose}
                className="absolute -top-3 -right-3 p-3 bg-white border border-slate-200 text-slate-400 rounded-full hover:bg-slate-50 shadow-md transition-all active:scale-90"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleSubmit}
                disabled={updateBaseUnit.isPending}
                className={`w-full flex items-center justify-center gap-3 rounded-full py-5 text-xs font-black text-white transition-all active:scale-95 shadow-lg
                                    ${updateBaseUnit.isPending ? "bg-slate-300" : "bg-green-600 hover:bg-green-700 shadow-green-100"}`}
              >
                {updateBaseUnit.isPending ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                XÁC NHẬN CẬP NHẬT
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-xs font-black text-red-500 hover:text-red-700 transition-colors uppercase tracking-[0.3em]"
              >
                HỦY BỎ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
