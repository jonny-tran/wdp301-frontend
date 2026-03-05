"use client";

import { useState, useMemo } from "react";
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  PencilSquareIcon,
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
import { ProductRow } from "./product.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductEditModalProps {
  product: ProductRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductEditModal({
  product,
  isOpen,
  onClose,
}: ProductEditModalProps) {
  const { updateProduct } = useProduct();
  const { baseUnitList } = useBaseUnit();

  // 1. Gọi API và lấy biến isLoading
  const { data: rawBaseUnits, isLoading: isUnitsLoading } = baseUnitList();

  const unitOptions = useMemo<UnitOption[]>(
    () => extractBaseUnitOptions(rawBaseUnits),
    [rawBaseUnits],
  );

  // 2. Khởi tạo State trực tiếp (Xóa bỏ hoàn toàn useEffect để tránh lỗi render lặp)
  const [formData, setFormData] = useState(() => {
    // Tìm ID từ tên đơn vị (ví dụ: "Miếng" -> ID 5)
    const matchedUnit = unitOptions.find(
      (opt) => opt.label === product?.baseUnitName,
    );
    return {
      name: product?.name || "",
      baseUnitId: matchedUnit ? matchedUnit.value : product?.baseUnitId || 0,
      shelfLifeDays: product?.shelfLifeDays || 0,
      imageUrl: product?.imageUrl || "",
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (formData.baseUnitId === 0)
      return toast.error("Vui lòng chọn đơn vị tính!");

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: formData,
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* CỘT TRÁI: Hình ảnh & Thông tin */}
          <div className="md:col-span-7 p-10 md:p-14 space-y-10 bg-white border-r border-slate-50">
            <div className="space-y-4 px-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                Hình ảnh sản phẩm
              </label>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-3 px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Tên sản phẩm
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-black focus:bg-white h-auto"
                />
              </div>
              <div className="space-y-3 px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Hạn bảo quản (Ngày)
                </label>
                <Input
                  type="number"
                  value={formData.shelfLifeDays || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shelfLifeDays: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-black focus:bg-white h-auto"
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Logistics */}
          <div className="md:col-span-5 flex flex-col justify-between p-10 md:p-14 bg-slate-50/80">
            <div className="relative p-10 rounded-[2.5rem] bg-white border border-slate-200 text-center shadow-xl mb-6">
              <div className="h-16 w-16 bg-black text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg -rotate-3">
                <PencilSquareIcon className="h-8 w-8 stroke-[3px]" />
              </div>
              <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter leading-tight">
                Chỉnh <span className="text-indigo-600">Sửa</span>
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                SKU: {product.sku}
              </p>
              <Button
                variant="ghost"
                onClick={onClose}
                className="absolute -top-4 -right-4 h-12 w-12 bg-white border border-slate-200 text-black rounded-full hover:bg-black hover:text-white shadow-xl p-0"
              >
                <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
              </Button>
            </div>

            <div className="space-y-10">
              <div className="space-y-4 px-2">
                <label className="text-[10px] font-black uppercase text-black tracking-[0.2em]">
                  Đơn vị tính
                </label>
                <Select
                  value={
                    formData.baseUnitId > 0 ? String(formData.baseUnitId) : ""
                  }
                  onValueChange={(val) =>
                    setFormData({ ...formData, baseUnitId: Number(val) })
                  }
                >
                  <SelectTrigger className="w-full rounded-2xl bg-white border border-slate-200 px-8 py-5 text-sm font-black text-black h-auto">
                    <SelectValue placeholder="CHỌN ĐƠN VỊ" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="z-150 rounded-2xl border-slate-200 shadow-2xl bg-white"
                  >
                    {isUnitsLoading ? (
                      <div className="p-4 text-[10px] font-black text-black animate-pulse text-center uppercase">
                        Đang tải...
                      </div>
                    ) : (
                      unitOptions.map((opt: UnitOption) => (
                        <SelectItem
                          key={opt.value}
                          value={String(opt.value)}
                          className="font-black uppercase text-[10px] py-4 text-black cursor-pointer"
                        >
                          {opt.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={updateProduct.isPending}
                  className="w-full flex items-center justify-center gap-4 rounded-full py-8 text-xs font-black text-white bg-black hover:bg-slate-800 shadow-2xl h-auto border-none"
                >
                  {updateProduct.isPending ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckIcon className="h-5 w-5 stroke-[3px]" />
                  )}
                  <span className="uppercase tracking-[0.2em]">
                    Cập nhật dữ liệu
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={onClose}
                  className="w-full text-[10px] font-black text-black hover:text-red-600 uppercase tracking-[0.3em] h-auto"
                >
                  Hủy bỏ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
