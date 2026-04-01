/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductBody, CreateProductBodyType } from "@/schemas/product";
import { useProduct } from "@/hooks/useProduct";
import { useBaseUnit } from "@/hooks/useBaseUnit";
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

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dmhjgnymn/image/upload/v1770135560/OIP_j6j4gz.webp";

// Định nghĩa quy tắc hạn dùng theo đơn vị tính (Mengo Logic)
const SHELF_LIFE_RULES: Record<string, { max: number; hint: string }> = {
  Miếng: { max: 7, hint: "Thực phẩm tươi (Tối đa 7 ngày)" },
  Gói: { max: 30, hint: "Hàng đóng gói (Tối đa 30 ngày)" },
  Thùng: { max: 180, hint: "Hàng lưu kho (Tối đa 6 tháng)" },
  Lít: { max: 14, hint: "Chất lỏng (Tối đa 14 ngày)" },
  default: { max: 3650, hint: "Hạn dùng tiêu chuẩn hệ thống" },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductCreateModal({ isOpen, onClose }: Props) {
  const { createProduct } = useProduct();
  const { useBaseUnitList } = useBaseUnit();

  // Gọi danh sách đơn vị tính (isActive=true)
  const { data: rawBaseUnits, isLoading: isUnitsLoading } = useBaseUnitList(
    BASE_UNITS_QUERY_ACTIVE_LIST,
  );

  // Mapper bóc tách dữ liệu 3 lớp (data.data.items)
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

  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(
      CreateProductBody,
    ) as unknown as Resolver<CreateProductBodyType>,
    defaultValues: {
      name: "",
      type: ProductType.FINISHED_GOOD,
      baseUnitId: 0,
      shelfLifeDays: 0,
      imageUrl: DEFAULT_IMAGE_URL,
    },
  });

  // Theo dõi đơn vị tính để đưa ra gợi ý hạn dùng
  const watchedUnitId = form.watch("baseUnitId");
  const currentRule = useMemo(() => {
    const selectedUnit = unitOptions.find(
      (opt) => String(opt.value) === String(watchedUnitId),
    );
    return (
      SHELF_LIFE_RULES[selectedUnit?.label || ""] || SHELF_LIFE_RULES["default"]
    );
  }, [watchedUnitId, unitOptions]);

  const onSubmit = async (data: CreateProductBodyType) => {
    try {
      await createProduct.mutateAsync({
        ...data,
        imageUrl: data.imageUrl?.trim() || DEFAULT_IMAGE_URL,
        // Đảm bảo baseUnitId gửi lên server là kiểu Number
        baseUnitId: Number(data.baseUnitId),
      });
      form.reset();
      onClose();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
          <DialogDescription>
            Khởi tạo sản phẩm mới trong hệ thống quản lý kho
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
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
                        value={field.value}
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="z-[150]">
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
                    <FormLabel>
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Gà Rán KFC Original..."
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
                    <FormLabel>
                      Đơn vị tính <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                          <SelectValue placeholder="Chọn đơn vị tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="z-[150]">
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
                      <FormLabel>
                        Hạn bảo quản (ngày){" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      {watchedUnitId !== 0 && (
                        <span className="text-[9px] font-bold text-indigo-500 italic">
                          💡 {currentRule.hint}
                        </span>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={currentRule.max}
                        placeholder="Số ngày bảo quản..."
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
                              message: `Đơn vị này không nên quá ${currentRule.max} ngày`,
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
                  disabled={createProduct.isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={createProduct.isPending}>
                  {createProduct.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Tạo sản phẩm
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
