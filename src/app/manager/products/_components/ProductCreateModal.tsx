"use client";

import { useMemo } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductBody, CreateProductBodyType } from "@/schemas/product";
import { useProduct } from "@/hooks/useProduct";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { BaseUnit } from "@/types/base-unit";
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

const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/dmhjgnymn/image/upload/v1770135560/OIP_j6j4gz.webp";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductCreateModal({ isOpen, onClose }: Props) {
  const { createProduct } = useProduct();
  const { useBaseUnitList } = useBaseUnit();
  const { data: rawBaseUnits, isLoading: isUnitsLoading } = useBaseUnitList();

  // Extract base unit options
  const unitOptions = useMemo(() => {
    const rawData = (rawBaseUnits as { data?: unknown })?.data || rawBaseUnits;
    const items: BaseUnit[] = Array.isArray(rawData) ? rawData : (rawData as { items?: BaseUnit[] })?.items || [];
    return items
      .filter((u) => u.isActive)
      .map((u) => ({ label: u.name, value: u.id }));
  }, [rawBaseUnits]);

  const form = useForm<CreateProductBodyType>({
    resolver: zodResolver(CreateProductBody) as unknown as Resolver<CreateProductBodyType>,
    defaultValues: {
      name: "",
      baseUnitId: 0,
      shelfLifeDays: 0,
      imageUrl: DEFAULT_IMAGE_URL,
    },
  });

  const onSubmit = async (data: CreateProductBodyType) => {
    try {
      await createProduct.mutateAsync({
        ...data,
        imageUrl: data.imageUrl?.trim() || DEFAULT_IMAGE_URL,
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

        <div className="max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Image Upload */}
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

              {/* Name */}
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
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Base Unit Select */}
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
                          <div className="p-3 text-sm text-slate-400 text-center">
                            Đang tải...
                          </div>
                        ) : unitOptions.length === 0 ? (
                          <div className="p-3 text-sm text-red-400 text-center">
                            Không có đơn vị nào
                          </div>
                        ) : (
                          unitOptions.map((opt) => (
                            <SelectItem key={opt.value} value={String(opt.value)}>
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

              {/* Shelf Life */}
              <FormField
                control={form.control}
                name="shelfLifeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Hạn bảo quản (ngày) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Nhập số ngày..."
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
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
