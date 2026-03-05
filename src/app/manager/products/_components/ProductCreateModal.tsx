"use client";

import { useEffect, useMemo } from "react";
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  PlusIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { useProduct } from "@/hooks/useProduct";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { BaseUnit } from "@/types/base-unit";
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { CreateProductBody, CreateProductBodyType } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

// Ảnh mặc định hệ thống
const DEFAULT_IMAGE_URL = "https://cdn.com/image1.jpg";

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

  // 1. Fetch và Map đơn vị tính
  const { data: rawBaseUnits, isLoading: isUnitsLoading } = baseUnitList();

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
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
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
              />
              {errors.imageUrl && <p className="text-[10px] text-red-500 ml-2">{errors.imageUrl.message}</p>}
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner ${errors.name ? "border-red-500 bg-red-50" : ""}`}
                  placeholder="Nhập tên sản phẩm..."
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-4">{errors.name.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Hạn dùng (Ngày)
                </label>
                <input
                  type="number"
                  {...register("shelfLifeDays")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner ${errors.shelfLifeDays ? "border-red-500 bg-red-50" : ""}`}
                  placeholder="Hạn sử dụng..."
                />
                {errors.shelfLifeDays && <p className="text-[10px] text-red-500 ml-4">{errors.shelfLifeDays.message}</p>}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Select đơn vị & Actions */}
          <div className="md:col-span-4 flex flex-col justify-between p-10 bg-slate-50/50">
            <div className="relative p-8 rounded-[2rem] bg-white border border-slate-200 text-center shadow-sm">
              <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic leading-tight">
                Tạo sản phẩm
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="absolute -top-3 -right-3 p-3 bg-white border border-slate-200 text-slate-400 rounded-full hover:bg-slate-50 shadow-md"
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
                    {...register("baseUnitId")}
                    disabled={isUnitsLoading}
                    className={`w-full rounded-[1.5rem] bg-white border border-slate-200 px-6 py-5 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer disabled:opacity-50 shadow-sm ${errors.baseUnitId ? "border-red-500 bg-red-50" : ""}`}
                  >
                    {isUnitsLoading ? (
                      <option>Đang tải...</option>
                    ) : (
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
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-3 rounded-full py-5 text-xs font-black text-white transition-all bg-green-600 hover:bg-green-700 disabled:bg-slate-300 shadow-lg active:scale-95"
                >
                  {isSubmitting ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckIcon className="h-4 w-4" />
                  )}
                  <span className="uppercase tracking-widest">
                    Xác nhận lưu
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-xs font-black text-red-500 uppercase tracking-widest"
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

