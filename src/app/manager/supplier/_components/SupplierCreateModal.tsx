"use client";

import { useEffect } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useSupplier } from "@/hooks/useSupplier";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CreateSupplierBody, CreateSupplierBodyType } from "@/schemas/supplier";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

export default function SupplierCreateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createSupplier } = useSupplier();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupplierBodyType>({
    resolver: zodResolver(CreateSupplierBody),
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        contactName: "",
        phone: "",
        address: "",
        isActive: true,
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateSupplierBodyType) => {
    try {
      await createSupplier.mutateAsync(data);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 p-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Tên công ty / Đối tác</label>
                <input
                  {...register("name")}
                  className={`w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all ${errors.name ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-4">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Người đại diện</label>
                <input
                  {...register("contactName")}
                  className={`w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:border-blue-500 ${errors.contactName ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.contactName && <p className="text-[10px] text-red-500 ml-4">{errors.contactName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Số điện thoại</label>
                <input
                  {...register("phone")}
                  className={`w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:border-blue-500 ${errors.phone ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 ml-4">{errors.phone.message}</p>}
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Địa chỉ văn phòng</label>
                <input
                  {...register("address")}
                  className={`w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:border-blue-500 ${errors.address ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.address && <p className="text-[10px] text-red-500 ml-4">{errors.address.message}</p>}
              </div>
            </div>
          </div>
          <div className="md:col-span-4 bg-slate-50/50 p-10 flex flex-col justify-between border-l border-slate-100">
            <div className="text-center relative">
              <button type="button" onClick={onClose} className="absolute -top-6 -right-6 p-2 text-slate-400"><XMarkIcon className="h-5 w-5" /></button>
              <PlusIcon className="h-10 w-10 mx-auto text-slate-900 mb-4" />
              <h3 className="text-xl font-black uppercase italic italic leading-tight">Đối tác <br /> Mới</h3>
            </div>
            <div className="space-y-3">
              <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Lưu hệ thống</button>
              <button type="button" onClick={onClose} className="w-full text-[9px] font-black text-red-500 uppercase tracking-widest">Hủy thao tác</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
