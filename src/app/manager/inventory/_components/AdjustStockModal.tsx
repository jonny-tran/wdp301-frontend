"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInventory } from "@/hooks/useInventory";
import { toast } from "sonner";

export default function AdjustStockModal({ item, isOpen, onClose }: any) {
  const { adjustInventory } = useInventory();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    adjustmentQuantity: 0,
    reason: "Stock Count",
    note: "",
  });

  const handleSubmit = async () => {
    if (!item) return;
    if (formData.adjustmentQuantity === 0) {
      toast.error("Vui lòng nhập số lượng khác 0");
      return;
    }

    setLoading(true);
    try {
      /**
       * THỬ THAY ĐỔI:
       * Nếu Backend báo "should not exist" trong Body, có thể họ muốn nhận qua Query Params.
       * Hàn hãy kiểm tra lại file `apiRequest/inventory.ts` xem hàm `adjustInventory` gọi như thế nào.
       */
      await adjustInventory.mutateAsync({
        warehouseId: Number(item.warehouseId),
        batchId: 0,
        adjustmentQuantity: Number(formData.adjustmentQuantity),
        reason: formData.reason,
        note: formData.note,
      });

      toast.success("Điều chỉnh thành công!");
      onClose();
    } catch (error: any) {
      // Log lỗi chi tiết để Hàn soi
      console.error("Lỗi gửi API:", error);
      toast.error("Lỗi: Kiểm tra lại cấu trúc dữ liệu gửi đi");
    } finally {
      setLoading(false);
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

        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-black ml-2">
              Số lượng (+/-)
            </label>
            <input
              type="number"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black text-black focus:border-black outline-none transition-all"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  adjustmentQuantity: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-black ml-2">
              Lý do
            </label>
            <select
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black uppercase text-[10px] text-black focus:border-black outline-none"
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            >
              <option value="Stock Count">Kiểm kho</option>
              <option value="Damage">Hư hỏng</option>
              <option value="Expired">Hết hạn</option>
            </select>
          </div>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN CẬP NHẬT"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
