"use client";

import { useEffect } from "react";
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useSupplier } from "@/hooks/useSupplier";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Supplier } from "@/types/supplier";
import { UpdateSupplierBody, UpdateSupplierBodyType } from "@/schemas/supplier";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

interface SupplierEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Supplier | null;
}

export default function SupplierEditModal({ isOpen, onClose, data }: SupplierEditModalProps) {
  const { updateSupplier } = useSupplier();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSupplierBodyType>({
    resolver: zodResolver(UpdateSupplierBody),
  });

  // Prefill dữ liệu khi mở modal
  useEffect(() => {
    if (data && isOpen) {
      reset({
        name: data.name || "",
        contactName: data.contactName || "",
        phone: data.phone || "",
        address: data.address || "",
        isActive: data.isActive,
      });
    }
  }, [data, isOpen, reset]);

  const onSubmit = async (formData: UpdateSupplierBodyType) => {
    if (!data?.id) return;
    try {
      await updateSupplier.mutateAsync({ id: String(data.id), data: formData });
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 p-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                  Tên công ty
                </label>
                <input
                  {...register("name")}
                  className={`w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner ${errors.name ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-4">{errors.name.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                  Đại diện
                </label>
                <input
                  {...register("contactName")}
                  className={`w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 ${errors.contactName ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.contactName && <p className="text-[10px] text-red-500 ml-4">{errors.contactName.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  className={`w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 ${errors.phone ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 ml-4">{errors.phone.message}</p>}
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">
                  Địa chỉ
                </label>
                <input
                  {...register("address")}
                  className={`w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 ${errors.address ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.address && <p className="text-[10px] text-red-500 ml-4">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-50/50 p-10 flex flex-col justify-between border-l border-slate-100">
            <div className="text-center relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute -top-6 -right-6 p-2 text-slate-300 hover:text-red-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-black uppercase italic leading-tight">
                Edit <br /> Supplier
              </h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 tracking-widest italic">
                Entry ID: #{data?.id}
              </p>
            </div>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2
                  ${isSubmitting ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-black"}`}
              >
                {isSubmitting ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                Xác nhận sửa
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

