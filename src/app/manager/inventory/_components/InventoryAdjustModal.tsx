"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InventoryAdjustBody,
  InventoryAdjustBodyType,
} from "@/schemas/inventory";
import { useInventory } from "@/hooks/useInventory";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function InventoryAdjustModal({ isOpen, onClose }: Props) {
  const { adjustInventory } = useInventory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventoryAdjustBodyType>({
    resolver: zodResolver(InventoryAdjustBody) as any,
  });

  const onSubmit = (data: InventoryAdjustBodyType) => {
    adjustInventory.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black font-display tracking-wider uppercase">
              Điều chỉnh <span className="text-primary">Kho</span>
            </h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Cập nhật số lượng tồn kho thủ công
            </p>
          </div>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 stroke-[2.5px]" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">
                ID Kho
              </label>
              <input
                {...register("warehouseId", { valueAsNumber: true })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold focus:ring-2 ring-primary/20 outline-none"
                placeholder="Nhập ID"
              />
              {errors.warehouseId && (
                <p className="text-[9px] font-bold text-red-500 ml-1 uppercase">
                  {errors.warehouseId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">
                ID Lô hàng
              </label>
              <input
                {...register("batchId", { valueAsNumber: true })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold focus:ring-2 ring-primary/20 outline-none"
                placeholder="Nhập ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">
              Số lượng điều chỉnh (+/-)
            </label>
            <input
              {...register("adjustmentQuantity", { valueAsNumber: true })}
              type="number"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold focus:ring-2 ring-primary/20 outline-none"
              placeholder="Ví dụ: 10 hoặc -5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">
              Lý do điều chỉnh
            </label>
            <select
              {...register("reason")}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 font-bold focus:ring-2 ring-primary/20 outline-none appearance-none"
            >
              <option value="DAMAGED">Hàng hư hỏng</option>
              <option value="EXPIRED">Hàng hết hạn</option>
              <option value="LOST">Thất thoát</option>
              <option value="INVENTORY_COUNT">Kiểm kê định kỳ</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-5 rounded-full border border-slate-200 text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={adjustInventory.isPending}
              className="flex-[2] py-5 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
            >
              {adjustInventory.isPending
                ? "ĐANG XỬ LÝ..."
                : "XÁC NHẬN CẬP NHẬT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
