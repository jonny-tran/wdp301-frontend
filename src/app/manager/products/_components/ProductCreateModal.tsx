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
  PlusIcon,
  ArchiveBoxIcon,
  PhotoIcon,
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
import { Button } from "@/components/ui/button";
=======
import { BaseUnit } from "@/types/base-unit";
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { CreateProductBody, CreateProductBodyType } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

// Ảnh mặc định hệ thống
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
  const [formData, setFormData] = useState(INITIAL_STATE);

  // Lấy dữ liệu Đơn vị tính (JSON: data.items)
  const { data: rawBaseUnits, isLoading: isUnitsLoading } = baseUnitList();

<<<<<<< HEAD
  // Mapping dữ liệu với kiểu UnitOption rõ ràng để tránh lỗi 'opt' any
  const unitOptions = useMemo<UnitOption[]>(
    () => extractBaseUnitOptions(rawBaseUnits),
    [rawBaseUnits],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.baseUnitId === 0) {
      toast.error("Vui lòng chọn đơn vị tính!");
      return;
    }

    try {
      await createProduct.mutateAsync({
        ...formData,
        imageUrl: formData.imageUrl.trim() || DEFAULT_IMAGE_URL,
      });
      toast.success("Đã thêm sản phẩm mới vào hệ thống!");
      onClose();
    } catch (error) {
      // Lỗi được xử lý tự động trong mutation
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
  } = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody) as any,
    defaultValues: {
      name: "",
      baseUnitId: 0,
      shelfLifeDays: 0,
      imageUrl: DEFAULT_IMAGE_URL,
    },
  });

  // Reset form khi mở modal
  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        baseUnitId: 0,
        shelfLifeDays: 0,
        imageUrl: DEFAULT_IMAGE_URL,
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: any) => {
    try {
      await createProduct.mutateAsync(data);
      onClose();
    } catch (error) {
      handleErrorApi({
        error,
        setError,
      });
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
<<<<<<< HEAD
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* CỘT TRÁI: Media & Tên sản phẩm */}
          <div className="md:col-span-7 p-10 md:p-14 space-y-10 bg-white border-r border-slate-50">
            <div className="space-y-4">
              <div className="flex items-center gap-2 ml-2">
                <PhotoIcon className="h-4 w-4 text-black font-bold" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Hình ảnh minh họa
                </label>
              </div>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
=======
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12">
          {/* CỘT TRÁI: Form nhập liệu */}
          <div className="md:col-span-8 p-10 space-y-8 bg-white border-r border-slate-50">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                Hình ảnh (Cloudinary)
              </label>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                )}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
              />
              {errors.imageUrl && <p className="text-[10px] text-red-500 ml-2">{errors.imageUrl.message}</p>}
            </div>

            <div className="space-y-8">
              <div className="space-y-3 px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black ml-1">
                  Tên thương mại sản phẩm
                </label>
                <input
                  type="text"
<<<<<<< HEAD
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-black focus:bg-white outline-none transition-all shadow-inner"
=======
                  {...register("name")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner ${errors.name ? "border-red-500 bg-red-50" : ""}`}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
                  placeholder="Nhập tên sản phẩm..."
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-4">{errors.name.message}</p>}
              </div>

              <div className="space-y-3 px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black ml-1">
                  Hạn bảo quản (Số ngày)
                </label>
                <input
                  type="number"
<<<<<<< HEAD
                  required
                  min={1}
                  value={formData.shelfLifeDays || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shelfLifeDays: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-black focus:bg-white outline-none transition-all shadow-inner"
                  placeholder="Ví dụ: 30"
=======
                  {...register("shelfLifeDays")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner ${errors.shelfLifeDays ? "border-red-500 bg-red-50" : ""}`}
                  placeholder="Hạn sử dụng..."
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
                />
                {errors.shelfLifeDays && <p className="text-[10px] text-red-500 ml-4">{errors.shelfLifeDays.message}</p>}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Đơn vị tính & Nút bấm */}
          <div className="md:col-span-5 flex flex-col justify-between p-10 md:p-14 bg-slate-50/80">
            <div className="relative p-10 rounded-[2.5rem] bg-white border border-slate-200 text-center shadow-xl mb-10">
              <div className="h-16 w-16 bg-black text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                <PlusIcon className="h-8 w-8 stroke-[3px]" />
              </div>
              <h3 className="text-3xl font-black text-black uppercase italic tracking-tighter leading-tight">
                Tạo <span className="text-indigo-600">Sản phẩm</span>
              </h3>
<<<<<<< HEAD
              <Button
=======
              <button
                type="button"
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
                onClick={onClose}
                className="absolute -top-4 -right-4 p-4 bg-white border border-slate-200 text-black rounded-full hover:bg-black hover:text-white transition-all shadow-xl active:scale-90"
              >
                <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
              </Button>
            </div>

            <div className="space-y-10">
              <div className="space-y-4 px-2">
                <label className="text-[10px] font-black uppercase text-black ml-1 tracking-[0.2em]">
                  Đơn vị tính hệ thống
                </label>
<<<<<<< HEAD

                <Select
                  value={
                    formData.baseUnitId === 0 ? "" : String(formData.baseUnitId)
                  }
                  onValueChange={(val) =>
                    setFormData({ ...formData, baseUnitId: Number(val) })
                  }
                >
                  <SelectTrigger className="w-full rounded-2xl bg-white border border-slate-200 px-8 py-5 text-sm font-black text-black shadow-sm focus:ring-0">
                    <SelectValue placeholder="--- CHỌN ĐƠN VỊ ---" />
                  </SelectTrigger>

                  {/* position="popper" giúp menu hiện đúng chỗ trong Modal */}
                  <SelectContent
                    position="popper"
                    className="z-[150] rounded-2xl border-slate-200 shadow-2xl bg-white overflow-hidden"
=======
                <div className="relative">
                  <select
                    {...register("baseUnitId")}
                    disabled={isUnitsLoading}
                    className={`w-full rounded-[1.5rem] bg-white border border-slate-200 px-6 py-5 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer disabled:opacity-50 shadow-sm ${errors.baseUnitId ? "border-red-500 bg-red-50" : ""}`}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
                  >
                    {isUnitsLoading ? (
                      <div className="p-4 text-[10px] font-black text-black animate-pulse text-center">
                        ĐANG TẢI...
                      </div>
                    ) : unitOptions.length === 0 ? (
                      <div className="p-4 text-[10px] font-black text-red-600 text-center uppercase">
                        Trống dữ liệu đơn vị
                      </div>
                    ) : (
<<<<<<< HEAD
                      unitOptions.map((opt: UnitOption) => (
                        <SelectItem
                          key={opt.value}
                          value={String(opt.value)}
                          className="font-black uppercase text-[10px] tracking-widest py-4 cursor-pointer focus:bg-black focus:text-white text-black"
                        >
                          {opt.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
=======
                      <>
                        <option value={0} disabled>
                          Chọn đơn vị...
                        </option>
                        {unitOptions.map((opt: { value: number, label: string }) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <ArchiveBoxIcon className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
                {errors.baseUnitId && <p className="text-[10px] text-red-500 ml-4">{errors.baseUnitId.message}</p>}
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
<<<<<<< HEAD
                  onClick={handleSubmit}
                  disabled={createProduct.isPending}
                  className="flex items-center justify-center gap-4 rounded-full py-6 text-xs font-black text-white transition-all bg-black hover:bg-slate-800 disabled:bg-slate-300 shadow-2xl active:scale-95"
                >
                  {createProduct.isPending ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
=======
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-3 rounded-full py-5 text-xs font-black text-white transition-all bg-green-600 hover:bg-green-700 disabled:bg-slate-300 shadow-lg active:scale-95"
                >
                  {isSubmitting ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
                  ) : (
                    <CheckIcon className="h-5 w-5 stroke-[3px]" />
                  )}
                  <span className="uppercase tracking-[0.2em]">
                    Lưu vào Database
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-[10px] font-black text-black hover:text-red-600 uppercase tracking-[0.3em] transition-colors"
                >
                  Hủy bỏ thao tác
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

