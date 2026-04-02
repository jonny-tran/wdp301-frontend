"use client";

import { Input } from "@/components/ui/input";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface RequestProductionModalProps {
  productId: number;
  productName: string;
  shortageQty: number;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (productId: number, plannedQuantity: number) => void;
}

export default function RequestProductionModal({
  productId,
  productName,
  shortageQty,
  isPending,
  onClose,
  onSubmit,
}: RequestProductionModalProps) {
  const [quantity, setQuantity] = useState(shortageQty > 0 ? shortageQty : 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    onSubmit(productId, quantity);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Yêu cầu sản xuất
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Tạo lệnh sản xuất gửi tới bếp
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Đóng"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Product info */}
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Sản phẩm cần sản xuất
            </p>
            <p className="mt-1 text-sm font-bold text-gray-900">
              {productName}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">Mã SP: #{productId}</p>
          </div>

          {/* Shortage info */}
          {shortageQty > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs text-orange-700">
              <span className="text-base">⚠️</span>
              <span>
                Tồn kho hiện tại <span className="font-bold">không đủ</span>.
                Cần sản xuất thêm ít nhất{" "}
                <span className="font-black text-orange-900">
                  {shortageQty}
                </span>{" "}
                đơn vị.
              </span>
            </div>
          )}

          {/* Quantity input */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Số lượng kế hoạch sản xuất
            </label>
            <Input
              type="number"
              min={1}
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="h-14 w-full rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-2xl font-black tabular-nums text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-400">
              Gợi ý: Nhập số lượng ≥ {shortageQty > 0 ? shortageQty : 1} để đủ
              đáp ứng đơn hàng.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending || quantity <= 0}
              className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60 transition"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang gửi...
                </span>
              ) : (
                "🏭 Gửi lệnh sản xuất"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
