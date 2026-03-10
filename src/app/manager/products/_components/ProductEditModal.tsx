"use client";

import { useState, useMemo, useEffect } from "react";
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
  product: ProductRow | null; // Nhận dữ liệu sản phẩm cần sửa
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

  // Khởi tạo state từ dữ liệu product truyền vào
  const [formData, setFormData] = useState({
    name: "",
    baseUnitId: 0,
    shelfLifeDays: 0,
    imageUrl: "",
    isActive: true,
  });

  // Cập nhật form khi product thay đổi hoặc modal mở
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name,
        baseUnitId: 0, // Lưu ý: Cần tìm ID từ tên hoặc API nếu ProductRow chỉ có name
        shelfLifeDays: product.shelfLifeDays,
        imageUrl: product.imageUrl || "",
        isActive: product.isActive,
      });
    }
  }, [product, isOpen]);

  const { data: rawBaseUnits, isLoading: isUnitsLoading } = baseUnitList();

  // Chỉ lấy đơn vị tính isActive: true
  const unitOptions = useMemo<UnitOption[]>(
    () => extractBaseUnitOptions(rawBaseUnits),
    [rawBaseUnits],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: formData,
      });
      toast.success("Cập nhật thông tin sản phẩm thành công!");
      onClose();
    } catch {
      // Lỗi được xử lý trong useProduct hook
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* CỘT TRÁI: Thông tin cơ bản */}
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-black focus:bg-white outline-none transition-all shadow-inner"
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-black focus:bg-white outline-none transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Đơn vị & Trạng thái */}
          <div className="md:col-span-5 flex flex-col justify-between p-10 md:p-14 bg-slate-50/80">
            <div className="relative p-10 rounded-[2.5rem] bg-white border border-slate-200 text-center shadow-xl mb-6">
              <div className="h-16 w-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg -rotate-3">
                <PencilSquareIcon className="h-8 w-8 stroke-[3px]" />
              </div>
              <h3 className="text-3xl font-black text-text-main font-display tracking-wider uppercase">
                Chỉnh <span className="text-primary">Sửa</span>
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                ID: #{product.id} • {product.sku}
              </p>
              <Button
                onClick={onClose}
                className="absolute -top-4 -right-4 p-4 bg-white border border-slate-200 text-black rounded-full hover:bg-primary-dark hover:text-white shadow-xl active:scale-90"
              >
                <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
              </Button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4 px-2">
                <label className="text-[10px] font-black uppercase text-black tracking-[0.2em]">
                  Đơn vị đo lường
                </label>
                <Select
                  value={String(formData.baseUnitId)}
                  onValueChange={(val) =>
                    setFormData({ ...formData, baseUnitId: Number(val) })
                  }
                >
                  <SelectTrigger className="w-full rounded-2xl bg-white border border-slate-200 px-8 py-5 text-sm font-black text-black shadow-sm focus:ring-0">
                    <SelectValue placeholder="CHỌN ĐƠN VỊ" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="z-[150] rounded-2xl border-slate-200 shadow-2xl bg-white"
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
                          className="font-black uppercase text-[10px] tracking-widest py-4 focus:bg-primary focus:text-white text-black"
                        >
                          {opt.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Chế độ hiển thị (Switch giả lập bằng nút) */}
              <div className="px-2 flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <span className="text-[10px] font-black uppercase text-black tracking-widest">
                  Trạng thái
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                  className={`px-6 py-2 rounded-full text-[9px] font-black uppercase transition-all ${formData.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {formData.isActive ? "Đang hoạt động" : "Đã ẩn"}
                </button>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={updateProduct.isPending}
                  className="flex items-center justify-center gap-4 rounded-full py-6 text-xs font-black text-white transition-all bg-primary hover:bg-primary-dark disabled:bg-slate-300 shadow-2xl active:scale-95"
                >
                  {updateProduct.isPending ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckIcon className="h-5 w-5 stroke-[3px]" />
                  )}
                  <span className="uppercase tracking-[0.2em]">
                    Cập nhật thay đổi
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
