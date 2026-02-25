"use client";

import { useState, useEffect, useMemo } from "react";
import { useProduct } from "@/hooks/useProduct";
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import {
  XMarkIcon,
  CheckIcon,
  PencilSquareIcon,
  PlusIcon,
  TagIcon,
  CircleStackIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { BatchRow } from "./batch.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  batch: BatchRow | null; // Nếu null là Create, nếu có data là Edit
}

export default function BatchFormModal({ isOpen, onClose, batch }: Props) {
  const isEdit = !!batch;
  const { createProduct, updateBatch, productList } = useProduct();

  // Lấy danh sách sản phẩm (chỉ dùng cho Create hoặc hiển thị thông tin)
  const { data: rawProductData } = productList({ page: 1, limit: 100 });
  const products = useMemo(
    () => rawProductData?.data?.items || rawProductData?.items || [],
    [rawProductData],
  );

  const [formData, setFormData] = useState({
    productId: "",
    batchCode: "",
    initialQuantity: 0,
    expiryDate: "",
    status: "pending",
    imageUrl: "",
  });

  // Sync dữ liệu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      if (batch) {
        // Chế độ EDIT: Fill dữ liệu cũ
        setFormData({
          productId: String(batch.productId),
          batchCode: batch.batchCode,
          initialQuantity: Math.floor(Number(batch.currentQuantity)),
          expiryDate: batch.expiryDate ? batch.expiryDate.split("T")[0] : "",
          status: batch.status,
          imageUrl: batch.imageUrl || "",
        });
      } else {
        // Chế độ CREATE: Reset form
        setFormData({
          productId: "",
          batchCode: "",
          initialQuantity: 0,
          expiryDate: "",
          status: "pending",
          imageUrl: "",
        });
      }
    }
  }, [isOpen, batch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit) {
        // Gọi API PATCH
        await updateBatch.mutateAsync({
          id: batch.id,
          data: {
            initialQuantity: formData.initialQuantity,
            imageUrl: formData.imageUrl || undefined,
            status: formData.status,
          },
        });
        toast.success("Cập nhật lô hàng thành công!");
      } else {
        // Gọi API POST
        if (!formData.productId) return toast.error("Vui lòng chọn sản phẩm!");
        await createProduct.mutateAsync({
          ...formData,
          productId: Number(formData.productId),
          initialQuantity: Number(formData.initialQuantity),
        } as any);
        toast.success("Khởi tạo lô hàng mới thành công!");
      }
      onClose();
    } catch (error) {
      // Lỗi đã được hook useProduct xử lý
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-[3rem] p-12 space-y-8 shadow-2xl animate-in zoom-in border border-slate-100"
      >
        {/* Dynamic Header */}
        <div className="flex justify-between items-center border-b border-slate-50 pb-6">
          <div className="flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${isEdit ? "bg-amber-500" : "bg-indigo-600"}`}
            >
              {isEdit ? (
                <PencilSquareIcon className="h-6 w-6 stroke-[2.5px]" />
              ) : (
                <PlusIcon className="h-6 w-6 stroke-[3px]" />
              )}
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-black uppercase italic text-slate-900 tracking-tighter">
                {isEdit
                  ? `Cập nhật Lô: ${batch.batchCode}`
                  : "Khởi tạo Lô hàng mới"}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                {isEdit
                  ? "Batch Modification Mode"
                  : "New Entry Inventory System"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-3 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          <div className="space-y-6">
            {/* SELECT SẢN PHẨM: Disable khi Edit vì thường không được đổi SP của Lô */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2">
                <TagIcon className="h-3 w-3" /> Sản phẩm định danh
              </label>
              <select
                disabled={isEdit}
                required
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-black text-slate-900 outline-none focus:bg-white disabled:opacity-60 transition-all shadow-sm"
              >
                <option value="">--- Chọn sản phẩm ---</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            {/* BATCH CODE: Disable khi Edit */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
                Mã số Lô (Batch Code)
              </label>
              <input
                disabled={isEdit}
                required
                value={formData.batchCode}
                onChange={(e) =>
                  setFormData({ ...formData, batchCode: e.target.value })
                }
                className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white disabled:opacity-60 transition-all shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
                  Số lượng khởi tạo
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={formData.initialQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initialQuantity: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-black text-slate-900 outline-none focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-black text-slate-900 outline-none appearance-none cursor-pointer focus:bg-white transition-all shadow-sm"
                >
                  <option value="pending">PENDING</option>
                  <option value="available">AVAILABLE</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2">
                <CalendarIcon className="h-3 w-3" /> Hạn sử dụng (Expiry Date)
              </label>
              <input
                disabled={isEdit} // Thường không sửa hạn dùng sau khi nhập lô
                required
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white disabled:opacity-60 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* CỘT 2: HÌNH ẢNH */}
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Minh chứng hình ảnh thực tế
            </label>
            <div className="flex-1 min-h-[250px]">
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={createProduct.isPending || updateBatch.isPending}
          className={`w-full flex items-center justify-center gap-4 rounded-full py-6 text-xs font-black text-white transition-all shadow-2xl active:scale-[0.98] disabled:bg-slate-200 ${isEdit ? "bg-amber-600 hover:bg-amber-700" : "bg-slate-900 hover:bg-black"}`}
        >
          {createProduct.isPending || updateBatch.isPending ? (
            <CircleStackIcon className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <CheckIcon className="h-5 w-5 stroke-[3px]" />{" "}
              {isEdit
                ? "XÁC NHẬN CẬP NHẬT THAY ĐỔI"
                : "XÁC NHẬN GHI DANH LÔ HÀNG"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
