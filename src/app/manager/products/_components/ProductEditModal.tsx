"use client";

<<<<<<< HEAD
import { useState, useMemo } from "react";
=======
import { useEffect, useMemo } from "react";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useProduct } from "@/hooks/useProduct";
import { useBaseUnit } from "@/hooks/useBaseUnit";
<<<<<<< HEAD
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
=======
import { Product } from "@/types/product";
import { BaseUnit } from "@/types/base-unit";
import { BaseResponsePagination } from "@/types/base";
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { UpdateProductBody, UpdateProductBodyType } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

interface ProductEditModalProps {
  product: ProductRow | null;
  isOpen: boolean;
  onClose: () => void;
<<<<<<< HEAD
=======
  product: Product | null;
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
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

<<<<<<< HEAD
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
=======
  const unitOptions = useMemo(
    () => {
      const source = (rawBaseUnits as any)?.items || rawBaseUnits || [];
      return (Array.isArray(source) ? source : []).map((u: BaseUnit) => ({
        value: u.id,
        label: u.name || `Đơn vị ${u.id}`
      }));
    },
    [rawBaseUnits],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProductBodyType>({
    resolver: zodResolver(UpdateProductBody) as any,
  });

  // 2. KHỞI TẠO DỮ LIỆU CŨ
  useEffect(() => {
    if (isOpen && product) {
      reset({
        name: product.name || "",
        baseUnitId: Number(product.baseUnitId) || 0,
        shelfLifeDays: Number(product.shelfLifeDays || 1),
        imageUrl: product.imageUrl || "",
      });
    }
  }, [isOpen, product, reset]);
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

  const onSubmit = async (formData: UpdateProductBodyType) => {
    if (!product?.id) return;
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: formData,
      });
      onClose();
    } catch (error) {
<<<<<<< HEAD
      console.error(error);
=======
      handleErrorApi({
        error,
        setError,
      });
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
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
<<<<<<< HEAD
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
=======
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12">
          {/* CỘT TRÁI: Nhập liệu chính */}
          <div className="md:col-span-8 p-10 space-y-8 bg-white border-r border-slate-50">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                Hình ảnh sản phẩm (Cloudinary)
              </label>
              <div className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50/50 p-1 shadow-sm">
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.imageUrl && <p className="text-[10px] text-red-500 ml-2">{errors.imageUrl.message}</p>}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
            </div>

            <div className="space-y-8">
              <div className="space-y-3 px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Tên sản phẩm
                </label>
<<<<<<< HEAD
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-black focus:bg-white h-auto"
=======
                <input
                  {...register("name")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner ${errors.name ? "border-red-500 bg-red-50" : ""}`}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-4">{errors.name.message}</p>}
              </div>
              <div className="space-y-3 px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Hạn bảo quản (Ngày)
                </label>
                <Input
                  type="number"
<<<<<<< HEAD
                  value={formData.shelfLifeDays || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shelfLifeDays: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-black focus:bg-white h-auto"
=======
                  {...register("shelfLifeDays")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner ${errors.shelfLifeDays ? "border-red-500 bg-red-50" : ""}`}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
                />
                {errors.shelfLifeDays && <p className="text-[10px] text-red-500 ml-4">{errors.shelfLifeDays.message}</p>}
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
<<<<<<< HEAD
              <Button
                variant="ghost"
=======
              <button
                type="button"
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
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
<<<<<<< HEAD
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
=======
                <div className="relative">
                  <select
                    {...register("baseUnitId")}
                    disabled={isUnitsLoading}
                    className={`w-full rounded-[1.5rem] bg-white border border-slate-200 px-6 py-5 text-sm font-bold text-slate-900 outline-none cursor-pointer appearance-none shadow-sm disabled:opacity-50 ${errors.baseUnitId ? "border-red-500 bg-red-50" : ""}`}
                  >
                    <option value={0} disabled>
                      Chọn đơn vị...
                    </option>
                    {unitOptions.map((opt: { value: number, label: string }) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ArchiveBoxIcon className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
                {errors.baseUnitId && <p className="text-[10px] text-red-500 ml-4">{errors.baseUnitId.message}</p>}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
<<<<<<< HEAD
                  onClick={handleSubmit}
                  disabled={updateProduct.isPending}
                  className="w-full flex items-center justify-center gap-4 rounded-full py-8 text-xs font-black text-white bg-black hover:bg-slate-800 shadow-2xl h-auto border-none"
                >
                  {updateProduct.isPending ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
=======
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-3 rounded-full py-5 text-xs font-black text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-lg active:scale-95 disabled:bg-slate-300"
                >
                  {isSubmitting ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
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
        </form>
      </div>
    </div>
  );
}

