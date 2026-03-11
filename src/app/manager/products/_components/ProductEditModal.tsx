"use client";

import { useEffect, useMemo } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProductBody, UpdateProductBodyType } from "@/schemas/product";
import { useProduct } from "@/hooks/useProduct";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { Product } from "@/types/product";
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

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductEditModal({ product, isOpen, onClose }: Props) {
  const { updateProduct } = useProduct();
  const { useBaseUnitList } = useBaseUnit();
  const { data: rawBaseUnits, isLoading: isUnitsLoading } = useBaseUnitList();

  const unitOptions = useMemo(() => {
    const rawData = (rawBaseUnits as { data?: unknown })?.data || rawBaseUnits;
    const items: BaseUnit[] = Array.isArray(rawData) ? rawData : (rawData as { items?: BaseUnit[] })?.items || [];
    return items
      .filter((u) => u.isActive)
      .map((u) => ({ label: u.name, value: u.id }));
  }, [rawBaseUnits]);

  const form = useForm<UpdateProductBodyType>({
    resolver: zodResolver(UpdateProductBody) as unknown as Resolver<UpdateProductBodyType>,
    defaultValues: {
      name: "",
      baseUnitId: 0,
      shelfLifeDays: 0,
      imageUrl: "",
    },
  });

  // Sync form values when product changes
  useEffect(() => {
    if (product && isOpen) {
      form.reset({
        name: product.name,
        baseUnitId: product.baseUnitId ?? 0,
        shelfLifeDays: product.shelfLifeDays,
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product, isOpen, form]);

  const onSubmit = async (data: UpdateProductBodyType) => {
    if (!product) return;
    try {
      await updateProduct.mutateAsync({ id: product.id, data });
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
                        value={field.value || ""}
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

              {/* Base Unit Select */}
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
                      <SelectContent position="popper" className="z-[150]">
                        {isUnitsLoading ? (
                          <div className="p-3 text-sm text-slate-400 text-center">
                            Đang tải...
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
                    <FormLabel>Hạn bảo quản (ngày)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Số ngày"
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
