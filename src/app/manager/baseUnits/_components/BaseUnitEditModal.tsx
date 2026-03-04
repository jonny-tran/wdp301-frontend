"use client";

import { useEffect } from "react";
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { BaseUnit } from "@/types/base-unit";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { UpdateBaseUnitBody, UpdateBaseUnitBodyType } from "@/schemas/base-unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

interface BaseUnitEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BaseUnit | null;
}

export default function BaseUnitEditModal({
  isOpen,
  onClose,
  data,
}: BaseUnitEditModalProps) {
  const { updateBaseUnit } = useBaseUnit();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateBaseUnitBodyType>({
    resolver: zodResolver(UpdateBaseUnitBody),
  });

  // Đồng bộ dữ liệu cũ vào Form khi mở Modal
  useEffect(() => {
    if (data && isOpen) {
      reset({
        name: data.name ?? "",
        description: data.description ?? "",
      });
    }
  }, [data, isOpen, reset]);

  const onSubmit = async (formData: UpdateBaseUnitBodyType) => {
    if (!data) return;

    try {
      await updateBaseUnit.mutateAsync({
        id: data.id,
        data: formData,
      });
      onClose();
    } catch (error) {
      handleErrorApi({
        error,
        setError,
      });
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
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12">
          {/* Cột trái: Form nhập liệu (Light Mode) */}
          <div className="md:col-span-7 p-12 space-y-8 bg-white">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                  Tên đơn vị
                </label>
                <input
                  {...register("name")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50/50 px-8 py-5 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none transition-all shadow-inner ${errors.name ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-4">{errors.name.message}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">
                  Mô tả
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  className={`w-full rounded-[2.5rem] border border-slate-200 bg-slate-50/50 px-8 py-5 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none transition-all shadow-inner ${errors.description ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.description && <p className="text-[10px] text-red-500 ml-4">{errors.description.message}</p>}
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
                type="button"
                onClick={onClose}
                className="absolute -top-3 -right-3 p-3 bg-white border border-slate-200 text-slate-400 rounded-full hover:bg-slate-50 shadow-md transition-all active:scale-90"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 rounded-full py-5 text-xs font-black text-white transition-all active:scale-95 shadow-lg
                                    ${isSubmitting ? "bg-slate-300" : "bg-green-600 hover:bg-green-700 shadow-green-100"}`}
              >
                {isSubmitting ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                XÁC NHẬN CẬP NHẬT
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-black text-red-500 hover:text-red-700 transition-colors uppercase tracking-[0.3em]"
              >
                HỦY BỎ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

