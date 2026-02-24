"use client";

import { useEffect, useState, useMemo } from "react";
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { useProduct } from "@/hooks/useProduct";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { extractBaseUnitOptions } from "./product.mapper";
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any; // Dữ liệu sản phẩm từ Table truyền sang
}

export default function ProductEditModal({
  isOpen,
  onClose,
  product,
}: ProductEditModalProps) {
  const { updateProduct } = useProduct();
  const { baseUnitList } = useBaseUnit();

  // 1. Fetch và Map danh sách đơn vị tính
  const { data: rawBaseUnits, isLoading: isUnitsLoading } = baseUnitList();
  const unitOptions = useMemo(
    () => extractBaseUnitOptions(rawBaseUnits),
    [rawBaseUnits],
  );

  const [formData, setFormData] = useState({
    name: "",
    baseUnitId: 0,
    shelfLifeDays: 0,
    imageUrl: "",
  });

  // 2. KHỞI TẠO DỮ LIỆU CŨ (Fix lỗi UI không đổi)
  // Lắng nghe sự thay đổi của 'product' để cập nhật Form state ngay lập tức
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        name: product.name || "",
        // Đảm bảo baseUnitId là số để khớp với Select
        baseUnitId: Number(product.baseUnitId) || 0,
        // Map linh hoạt giữa các tên trường shelfLife
        shelfLifeDays: Number(product.shelfLife || product.shelfLifeDays || 0),
        imageUrl: product.imageUrl || "",
      });
    }
  }, [isOpen, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.baseUnitId === 0) {
      toast.error("Vui lòng chọn đơn vị tính");
      return;
    }

    try {
      // 3. Gửi PATCH request với ID và body mới
      await updateProduct.mutateAsync({
        id: product.id,
        ...formData,
      });
      // Logic invalidateQueries trong useProduct hook sẽ tự động làm mới UI
      toast.success("Cập nhật catalog thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* CỘT TRÁI: Nhập liệu chính */}
          <div className="md:col-span-8 p-10 space-y-8 bg-white border-r border-slate-50">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                Hình ảnh sản phẩm (Cloudinary)
              </label>
              <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50/50 p-1 shadow-sm">
                <ImageUpload
                  value={formData.imageUrl}
                  onChange={(url) =>
                    setFormData({ ...formData, imageUrl: url })
                  }
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  Tên sản phẩm
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  Hạn dùng (Ngày)
                </label>
                <input
                  type="number"
                  required
                  value={formData.shelfLifeDays || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shelfLifeDays: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Select & Actions */}
          <div className="md:col-span-4 flex flex-col justify-between p-10 bg-slate-50/50">
            <div className="relative p-8 rounded-[2rem] bg-white border border-slate-200 text-center shadow-sm">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PencilSquareIcon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic leading-tight">
                Chỉnh sửa <br /> Catalog
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">
                SKU: {product?.sku || "N/A"}
              </p>
              <button
                onClick={onClose}
                className="absolute -top-3 -right-3 p-3 bg-white border border-slate-200 text-slate-400 rounded-full hover:bg-slate-50 shadow-md transition-all active:scale-90"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-slate-500 ml-2 tracking-widest">
                  Đơn vị tính
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.baseUnitId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        baseUnitId: Number(e.target.value),
                      })
                    }
                    disabled={isUnitsLoading}
                    className="w-full rounded-[1.5rem] bg-white border border-slate-200 px-6 py-5 text-sm font-bold text-slate-900 outline-none cursor-pointer appearance-none shadow-sm disabled:opacity-50"
                  >
                    <option value={0} disabled>
                      Chọn đơn vị...
                    </option>
                    {unitOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ArchiveBoxIcon className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={updateProduct.isPending}
                  className="flex items-center justify-center gap-3 rounded-full py-5 text-xs font-black text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-lg active:scale-95 disabled:bg-slate-300"
                >
                  {updateProduct.isPending ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckIcon className="h-4 w-4 stroke-[3px]" />
                  )}
                  <span className="uppercase tracking-widest text-[10px]">
                    Lưu thay đổi
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-xs font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-[0.3em]"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
