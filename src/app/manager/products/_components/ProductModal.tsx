"use client";

import { useEffect, useState, useRef } from "react";
import { useProduct } from "@/hooks/useProduct";
import { useUpload } from "@/hooks/useUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function ProductModal({ isOpen, onClose, editingProduct }: any) {
  const { createProduct, updateProduct } = useProduct();
  const { uploadImage } = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    baseUnitId: 1,
    shelfLifeDays: 3,
    imageUrl: "",
  });

  useEffect(() => {
    if (editingProduct) setFormData(editingProduct);
    else
      setFormData({ name: "", baseUnitId: 1, shelfLifeDays: 3, imageUrl: "" });
  }, [editingProduct, isOpen]);

  // Xử lý Upload ảnh
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const res = await uploadImage.mutateAsync(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.url })); // Lấy URL từ Cloudinary
    }
  };

  const handleSubmit = async () => {
    if (editingProduct) {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        data: formData,
      });
    } else {
      await createProduct.mutateAsync(formData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[2.5rem] p-10 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic">
            {editingProduct ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-8 space-y-6">
          {/* Khu vực Upload Ảnh */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase opacity-40 ml-2">
              Ảnh sản phẩm
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center cursor-pointer hover:border-black transition-all"
            >
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center opacity-20">
                  <PhotoIcon className="h-10 w-10" />
                  <span className="text-[9px] font-black uppercase">
                    Chọn ảnh tải lên
                  </span>
                </div>
              )}
              {uploadImage.isPending && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-pulse">
                  <ArrowUpTrayIcon className="h-6 w-6 animate-bounce" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handleUpload}
              accept="image/*"
            />
          </div>

          <div className="space-y-4">
            <input
              placeholder="Tên sản phẩm..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Hạn sử dụng (ngày)..."
                value={formData.shelfLifeDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shelfLifeDays: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold"
              />
              <select
                value={formData.baseUnitId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    baseUnitId: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold"
              >
                <option value={1}>Cái/Chiếc</option>
                <option value={2}>Kg</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={uploadImage.isPending}
            className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
          >
            {uploadImage.isPending
              ? "Đang xử lý ảnh..."
              : editingProduct
                ? "Lưu thay đổi"
                : "Xác nhận tạo"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
