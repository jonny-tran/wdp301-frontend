"use client";

import { useEffect } from "react";
import { XMarkIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CreateBaseUnitBody, CreateBaseUnitBodyType } from "@/schemas/base-unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

export default function BaseUnitCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createBaseUnit } = useBaseUnit();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateBaseUnitBodyType>({
    resolver: zodResolver(CreateBaseUnitBody),
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: "", description: "" });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateBaseUnitBodyType) => {
    try {
      await createBaseUnit.mutateAsync(data);
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-7 p-10 space-y-8 bg-white">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
                  Tên đơn vị (Ví dụ: Kg, Lon, Thùng)
                </label>
                <input
                  {...register("name")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50/50 px-8 py-5 text-sm font-bold outline-none focus:border-blue-500 shadow-inner ${errors.name ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-4">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
                  Mô tả đơn vị
                </label>
                <textarea
                  rows={3}
                  {...register("description")}
                  className={`w-full rounded-[2rem] border border-slate-200 bg-slate-50/50 px-8 py-5 text-sm font-bold outline-none focus:border-blue-500 shadow-inner ${errors.description ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.description && <p className="text-[10px] text-red-500 ml-4">{errors.description.message}</p>}
              </div>
            </div>
          </div>
          <div className="md:col-span-5 flex flex-col justify-between p-10 bg-slate-50/50 border-l border-slate-100 text-center">
            <div className="relative p-6 rounded-[2rem] bg-white border border-slate-200">
              <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic leading-tight text-slate-900">
                Thêm đơn vị <br /> tính mới
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="absolute -top-2 -right-2 p-2 bg-white border border-slate-200 text-slate-400 rounded-full shadow-md"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-green-600 py-5 text-xs font-black text-white hover:bg-green-700 active:scale-95 shadow-lg"
              >
                <CheckIcon className="h-4 w-4" /> LƯU HỆ THỐNG
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-xs font-black text-red-500 uppercase tracking-widest"
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

