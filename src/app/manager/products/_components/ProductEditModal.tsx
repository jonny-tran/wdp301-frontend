/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProductBody, UpdateProductBodyType } from "@/schemas/product";
import { useProduct } from "@/hooks/useProduct";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { Product } from "@/types/product";
import { BaseUnit, BASE_UNITS_QUERY_ACTIVE_LIST } from "@/types/base-unit";
import ImageUpload from "@/components/shared/ImageUpload";
import { handleErrorApi } from "@/lib/errors";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProductType, PRODUCT_TYPE_OPTIONS } from "./product.types";

// Định nghĩa quy tắc hạn dùng (Mengo Business Logic)
const SHELF_LIFE_RULES: Record<string, { max: number; hint: string }> = {
  Miếng: { max: 7, hint: "Hàng tươi (Tối đa 7 ngày)" },
  Gói: { max: 30, hint: "Hàng đóng gói (Tối đa 30 ngày)" },
  Thùng: { max: 180, hint: "Hàng lưu kho (Tối đa 6 tháng)" },
  Lít: { max: 14, hint: "Chất lỏng (Tối đa 14 ngày)" },
  default: { max: 3650, hint: "Hạn dùng tiêu chuẩn" },
};

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductEditModal({ product, isOpen, onClose }: Props) {
  const { updateProduct } = useProduct();
  const { useBaseUnitList } = useBaseUnit();
  const { data: rawBaseUnits, isLoading: isUnitsLoading } = useBaseUnitList(
    BASE_UNITS_QUERY_ACTIVE_LIST,
  );

  // Mapper xử lý dữ liệu đơn vị tính từ API (unwrap data/items)
  const unitOptions = useMemo(() => {
    const res = rawBaseUnits as any;
    const items =
      res?.data?.items ||
      res?.data ||
      res?.items ||
      (Array.isArray(res) ? res : []);

    if (!Array.isArray(items)) return [];

    return items
      .map((u: any) => ({
        label: String(u.name || "N/A"),
        value: String(u.id || ""),
      }))
      .filter((opt) => opt.value !== "");
  }, [rawBaseUnits]);

  const form = useForm<UpdateProductBodyType>({
    resolver: zodResolver(
      UpdateProductBody,
    ) as unknown as Resolver<UpdateProductBodyType>,
    defaultValues: {
      name: "",
      type: ProductType.FINISHED_GOOD,
      baseUnitId: 0,
      shelfLifeDays: 0,
      imageUrl: "",
    },
  });

  // Theo dõi đơn vị tính để áp dụng logic hạn dùng thông minh
  const watchedUnitId = form.watch("baseUnitId");
  const currentRule = useMemo(() => {
    const selectedUnit = unitOptions.find(
      (opt) => String(opt.value) === String(watchedUnitId),
    );
    return (
      SHELF_LIFE_RULES[selectedUnit?.label || ""] || SHELF_LIFE_RULES["default"]
    );
  }, [watchedUnitId, unitOptions]);

  // Sync form values khi product hoặc modal mở
  useEffect(() => {
    if (product && isOpen) {
      form.reset({
        name: product.name,
        type: product.type ?? ProductType.FINISHED_GOOD,
        baseUnitId: product.baseUnitId ?? 0,
        shelfLifeDays: product.shelfLifeDays,
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product, isOpen, form]);

  const onSubmit = async (data: UpdateProductBodyType) => {
    if (!product) return;
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: {
          ...data,
          baseUnitId: Number(data.baseUnitId), // Đảm bảo ID gửi đi là Number
        },
      });
      onClose();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
          <DialogDescription>
            ID: #{product.id} • SKU: {product.sku}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* 1. Hình ảnh */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh sản phẩm</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 2. Loại sản phẩm */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Loại sản phẩm <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) =>
                        field.onChange(val as ProductType)
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="z-150">
                        {PRODUCT_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 3. Tên sản phẩm */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tên sản phẩm"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 4. Đơn vị tính */}
              <FormField
                control={form.control}
                name="baseUnitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn vị tính</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                          <SelectValue placeholder="Chọn đơn vị tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="z-150">
                        {isUnitsLoading ? (
                          <div className="p-3 text-sm text-slate-400 text-center animate-pulse">
                            Đang tải...
                          </div>
                        ) : (
                          unitOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 5. Hạn bảo quản (Smart Constraint) */}
              <FormField
                control={form.control}
                name="shelfLifeDays"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-end mb-1">
                      <FormLabel>Hạn bảo quản (ngày)</FormLabel>
                      {watchedUnitId !== 0 && (
                        <span className="text-[10px] font-bold text-indigo-600 italic">
                          💡 {currentRule.hint}
                        </span>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={currentRule.max}
                        placeholder="Số ngày"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                        onChange={(e) => {
                          const val =
                            e.target.value === "" ? 0 : Number(e.target.value);
                          field.onChange(val);
                          if (val > currentRule.max) {
                            form.setError("shelfLifeDays", {
                              message: `Đơn vị này thường không quá ${currentRule.max} ngày`,
                            });
                          } else {
                            form.clearErrors("shelfLifeDays");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={updateProduct.isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={updateProduct.isPending}>
                  {updateProduct.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cập nhật
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
