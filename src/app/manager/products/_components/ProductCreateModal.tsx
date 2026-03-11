"use client";

import { useState, useMemo } from "react";
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  PlusIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useProduct } from "@/hooks/useProduct";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { extractBaseUnitOptions, UnitOption } from "./product.mapper";
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dmhjgnymn/image/upload/v1770135560/OIP_j6j4gz.webp";
const INITIAL_STATE = {
  name: "",
  baseUnitId: 0,
  shelfLifeDays: 0,
  imageUrl: "",
};

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductCreateModal({
  isOpen,
  onClose,
}: ProductCreateModalProps) {
  const { createProduct } = useProduct();
  const { baseUnitList } = useBaseUnit();

  // State quản lý form
  const [formData, setFormData] = useState(INITIAL_STATE);

  // Lấy dữ liệu Đơn vị tính từ API
  const { data: rawBaseUnits, isLoading: isUnitsLoading } = baseUnitList();

  // Map dữ liệu với kiểu UnitOption rõ ràng (Fix lỗi opt: any)
  const unitOptions = useMemo<UnitOption[]>(
    () => extractBaseUnitOptions(rawBaseUnits),
    [rawBaseUnits],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.baseUnitId === 0) {
      toast.error("Vui lòng chọn đơn vị tính hệ thống!");
      return;
    }

    try {
      await createProduct.mutateAsync({
        ...formData,
        imageUrl: formData.imageUrl.trim() || DEFAULT_IMAGE_URL,
      });
      toast.success("Đã thêm sản phẩm mới vào danh mục!");
      onClose();
    } catch {
      // Lỗi được xử lý tại useProduct
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* CỘT TRÁI: Media & Tên */}
          <div className="md:col-span-7 p-10 md:p-14 space-y-10 bg-white border-r border-slate-50">
            <div className="space-y-4">
              <div className="flex items-center gap-2 ml-2">
                <PhotoIcon className="h-4 w-4 text-slate-400" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Hình ảnh sản phẩm
                </label>
              </div>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-3 px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Tên thương mại
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner"
                  placeholder="Ví dụ: Gà Rán KFC..."
                />
              </div>

              <div className="space-y-3 px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Hạn bảo quản (Ngày)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.shelfLifeDays || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shelfLifeDays: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner"
                  placeholder="Nhập số ngày..."
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Logistics & Actions */}
          <div className="md:col-span-5 flex flex-col justify-between p-10 md:p-14 bg-slate-50/50">
            <div className="relative p-10 rounded-[2.5rem] bg-white border border-slate-200 text-center shadow-xl mb-10">
              <div className="h-16 w-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                <PlusIcon className="h-8 w-8 stroke-[3px]" />
              </div>
              <h3 className="text-3xl font-black text-text-main font-display tracking-wider uppercase leading-tight">
                Tạo <span className="text-primary">Sản phẩm</span>
              </h3>
              <Button
                onClick={onClose}
                className="absolute -top-4 -right-4 p-4 bg-white border border-slate-100 text-slate-400 rounded-full hover:bg-primary hover:text-white transition-all shadow-xl active:scale-90"
              >
                <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
              </Button>
            </div>

            <div className="space-y-10">
              <div className="space-y-4 px-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1 tracking-[0.2em]">
                  Đơn vị tính
                </label>

                {/* Sửa lỗi hiển thị: Thêm position="popper" và ép kiểu String */}
                <Select
                  value={
                    formData.baseUnitId === 0 ? "" : String(formData.baseUnitId)
                  }
                  onValueChange={(val) =>
                    setFormData({ ...formData, baseUnitId: Number(val) })
                  }
                >
                  <SelectTrigger className="w-full rounded-2xl bg-white border border-slate-200 px-8 py-5 text-sm font-black text-slate-900 shadow-sm focus:ring-0">
                    <SelectValue placeholder="--- CHỌN ĐƠN VỊ ---" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="z-[150] rounded-2xl border-slate-100 shadow-2xl bg-white overflow-hidden"
                  >
                    {isUnitsLoading ? (
                      <div className="p-4 text-[10px] font-black text-slate-400 animate-pulse text-center">
                        ĐANG TẢI...
                      </div>
                    ) : unitOptions.length === 0 ? (
                      <div className="p-4 text-[10px] font-black text-red-400 text-center">
                        TRỐNG DỮ LIỆU ĐƠN VỊ
                      </div>
                    ) : (
                      unitOptions.map((opt: UnitOption) => (
                        <SelectItem
                          key={opt.value}
                          value={String(opt.value)}
                          className="font-bold uppercase text-[10px] tracking-widest py-4 cursor-pointer focus:bg-primary focus:text-white"
                        >
                          {opt.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={createProduct.isPending}
                  className="flex items-center justify-center gap-4 rounded-full py-6 text-xs font-black text-white transition-all bg-primary hover:bg-primary-dark disabled:bg-slate-300 shadow-lg active:scale-95"
                >
                  {createProduct.isPending ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckIcon className="h-5 w-5 stroke-[3px]" />
                  )}
                  <span className="uppercase tracking-[0.2em]">
                    Lưu vào Danh mục
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-[0.3em] transition-colors"
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
