"use client";

import { useEffect, useMemo } from "react";
import {
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { useProduct } from "@/hooks/useProduct";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { Product } from "@/types/product";
import { BaseUnit } from "@/types/base-unit";
import { BaseResponsePagination } from "@/types/base";
import ImageUpload from "@/components/shared/ImageUpload";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { UpdateProductBody, UpdateProductBodyType } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
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

  const onSubmit = async (formData: UpdateProductBodyType) => {
    if (!product?.id) return;
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: formData,
      });
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
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
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  Tên sản phẩm
                </label>
                <input
                  {...register("name")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner ${errors.name ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 ml-4">{errors.name.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                  Hạn dùng (Ngày)
                </label>
                <input
                  type="number"
                  {...register("shelfLifeDays")}
                  className={`w-full rounded-full border border-slate-200 bg-slate-50 px-8 py-5 text-sm font-bold text-slate-900 focus:bg-white outline-none transition-all shadow-inner ${errors.shelfLifeDays ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.shelfLifeDays && <p className="text-[10px] text-red-500 ml-4">{errors.shelfLifeDays.message}</p>}
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
                type="button"
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
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-3 rounded-full py-5 text-xs font-black text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-lg active:scale-95 disabled:bg-slate-300"
                >
                  {isSubmitting ? (
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
        </form>
      </div>
    </div>
  );
}

