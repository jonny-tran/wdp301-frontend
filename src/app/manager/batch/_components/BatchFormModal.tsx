"use client";

import ImageUpload from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProduct";
import { handleErrorApi } from "@/lib/errors";
import { UpdateBatchBody, UpdateBatchBodyType } from "@/schemas/product";
import { Batch } from "@/types/product";
import { BatchStatus } from "@/utils/enum";
import {
  CalendarIcon,
  CheckIcon,
  CircleStackIcon,
  PencilSquareIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, Resolver } from "react-hook-form";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  batch: Batch | null;
  productId?: number;
  productName?: string;
}

export default function BatchFormModal({
  isOpen,
  onClose,
  batch,
  productId,
  productName,
}: Props) {
  const { updateBatch } = useProduct();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateBatchBodyType>({
    resolver: zodResolver(UpdateBatchBody) as unknown as Resolver<UpdateBatchBodyType>,
  });

  // Sync dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen && batch) {
      reset({
        initialQuantity: Math.floor(Number(batch.currentQuantity)),
        imageUrl: batch.imageUrl || "",
        status: batch.status as BatchStatus,
      });
    }
  }, [isOpen, batch, reset]);

  const onSubmit = async (data: UpdateBatchBodyType) => {
    try {
      if (!batch?.id) return;
      await updateBatch.mutateAsync({
        id: batch.id,
        data: {
          initialQuantity: data.initialQuantity,
          imageUrl: data.imageUrl || undefined,
          status: data.status,
        },
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl bg-white rounded-[3rem] p-12 space-y-8 shadow-2xl animate-in zoom-in border border-slate-100"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-50 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-amber-500">
              <PencilSquareIcon className="h-6 w-6 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-black font-display tracking-wider uppercase text-text-main">
                {batch
                  ? `Cập nhật Lô: ${batch.batchCode}`
                  : `Thêm Lô mới: ${productName}`}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-1">
                {batch ? "Batch Modification Mode" : "New Batch Entry"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="p-3 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          <div className="space-y-6">
            {/* THÔNG TIN CỐ ĐỊNH (DISABLE) */}
            <div className="grid grid-cols-2 gap-4 opacity-70">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2">
                  <TagIcon className="h-3 w-3" /> Product ID
                </label>
                <div className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-black text-slate-400">
                  #{batch ? batch.productId : productId}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2">
                  <CalendarIcon className="h-3 w-3" /> Hạn dùng
                </label>
                <div className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold text-slate-400">
                  {batch?.expiryDate ? batch.expiryDate.split("T")[0] : "N/A"}
                </div>
              </div>
            </div>

            {/* EDITABLE FIELDS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
                  Số lượng hiện tại
                </label>
                <input
                  type="number"
                  {...register("initialQuantity", { valueAsNumber: true })}
                  className={`w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm ${errors.initialQuantity ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.initialQuantity && (
                  <p className="text-[10px] text-red-500 ml-4">
                    {errors.initialQuantity.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
                  Trạng thái lô hàng
                </label>
                <select
                  {...register("status")}
                  className={`w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-black text-slate-900 outline-none appearance-none cursor-pointer focus:bg-white transition-all shadow-sm ${errors.status ? "border-red-500 bg-red-50" : ""}`}
                >
                  <option value={BatchStatus.PENDING}>PENDING</option>
                  <option value={BatchStatus.AVAILABLE}>AVAILABLE</option>
                  <option value={BatchStatus.EMPTY}>EMPTY</option>
                  <option value={BatchStatus.EXPIRED}>EXPIRED</option>
                </select>
                {errors.status && (
                  <p className="text-[10px] text-red-500 ml-4">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* HÌNH ẢNH */}
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Minh chứng hình ảnh thực tế
            </label>
            <div className="flex-1 min-h-[200px]">
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            {errors.imageUrl && (
              <p className="text-[10px] text-red-500 ml-4">
                {errors.imageUrl.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-4 rounded-full py-6 text-xs font-black text-white transition-all shadow-2xl active:scale-[0.98] disabled:bg-slate-200 bg-amber-600 hover:bg-amber-700"
        >
          {isSubmitting ? (
            <CircleStackIcon className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <CheckIcon className="h-5 w-5 stroke-[3px]" /> XÁC NHẬN CẬP NHẬT
              THAY ĐỔI
            </>
          )}
        </button>
      </form>
    </div>
  );
}
