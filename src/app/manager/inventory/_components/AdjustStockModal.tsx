"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInventory } from "@/hooks/useInventory";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { InventoryAdjustBody, InventoryAdjustBodyType } from "@/schemas/inventory";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

export default function AdjustStockModal({ item, isOpen, onClose }: any) {
  const { adjustInventory } = useInventory();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InventoryAdjustBodyType>({
    resolver: zodResolver(InventoryAdjustBody) as any,
    defaultValues: {
      adjustmentQuantity: 0,
      reason: "Stock Count",
      note: "",
    },
  });

  useEffect(() => {
    if (isOpen && item) {
      reset({
        warehouseId: Number(item.warehouseId),
        batchId: 0,
        adjustmentQuantity: 0,
        reason: "Stock Count",
        note: "",
      });
    }
  }, [isOpen, item, reset]);

  const onSubmit = async (data: any) => {
    try {
      await adjustInventory.mutateAsync(data);
      onClose();
    } catch (error: any) {
      handleErrorApi({
        error,
        setError,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2.5rem] border-none max-w-md p-10 bg-white shadow-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-black">
            LỆNH ĐIỀU CHỈNH
          </DialogTitle>
          <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mt-2">
            PRODUCT: {item?.productName}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-black ml-2">
              Số lượng (+/-)
            </label>
            <input
              type="number"
              {...register("adjustmentQuantity")}
              className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black text-black focus:border-black outline-none transition-all ${errors.adjustmentQuantity ? "border-red-500 bg-red-50" : ""}`}
            />
            {errors.adjustmentQuantity && <p className="text-[10px] text-red-500 ml-2">{errors.adjustmentQuantity.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-black ml-2">
              Lý do
            </label>
            <select
              {...register("reason")}
              className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black uppercase text-[10px] text-black focus:border-black outline-none ${errors.reason ? "border-red-500 bg-red-50" : ""}`}
            >
              <option value="Stock Count">Kiểm kho</option>
              <option value="Damage">Hư hỏng</option>
              <option value="Expired">Hết hạn</option>
            </select>
            {errors.reason && <p className="text-[10px] text-red-500 ml-2">{errors.reason.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? "ĐANG XỬ LÝ..." : "XÁC NHẬN CẬP NHẬT"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

