"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateBatchBody, UpdateBatchBodyType } from "@/schemas/product";
import { Batch } from "@/types/product";
import { BatchStatus } from "@/utils/enum";
import { useProduct } from "@/hooks/useProduct";
import { handleErrorApi } from "@/lib/errors";
import ImageUpload from "@/components/shared/ImageUpload";
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
import { format } from "date-fns";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  batch: Batch | null;
  productId?: number;
  productName?: string;
}

export default function BatchFormModal({
  isOpen,
  onClose,
  batch,
  productId,
  productName,
}: Props) {
  const { updateBatch } = useProduct();

  const form = useForm<UpdateBatchBodyType>({
    resolver: zodResolver(UpdateBatchBody) as any,
    defaultValues: {
      initialQuantity: 0,
      imageUrl: "",
      status: BatchStatus.PENDING,
    },
  });

  useEffect(() => {
    if (isOpen && batch) {
      form.reset({
        initialQuantity: Math.floor(Number(batch.currentQuantity)),
        imageUrl: batch.imageUrl || "",
        status: (batch.status as BatchStatus) || BatchStatus.PENDING,
      });
    }
  }, [isOpen, batch, form]);

  const onSubmit = async (data: UpdateBatchBodyType) => {
    try {
      if (!batch?.id) return;
      await updateBatch.mutateAsync({
        id: batch.id,
        data: {
          initialQuantity: data.initialQuantity,
          imageUrl: data.imageUrl || undefined,
          status: data.status,
        },
      });
      onClose();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {batch ? `Cập nhật lô: ${batch.batchCode}` : `Thêm lô mới: ${productName}`}
          </DialogTitle>
          <DialogDescription>
            {batch ? "Cập nhật thông tin bổ sung và trạng thái lô hàng" : "Nhập thông tin lô hàng mới"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Read-only info (Product ID & Expiry) */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Product ID</p>
                  <p className="font-bold text-slate-900">
                    #{batch ? batch.productId : productId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Hạn dùng</p>
                  <p className="font-bold text-slate-900">
                    {batch?.expiryDate ? format(new Date(batch.expiryDate), "dd/MM/yyyy") : "N/A"}
                  </p>
                </div>
              </div>

              {/* Grid: Quantity & Status */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="initialQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng hiện tại</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái lô hàng</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[150]">
                          <SelectItem value={BatchStatus.PENDING}>PENDING</SelectItem>
                          <SelectItem value={BatchStatus.AVAILABLE}>AVAILABLE</SelectItem>
                          <SelectItem value={BatchStatus.EMPTY}>EMPTY</SelectItem>
                          <SelectItem value={BatchStatus.EXPIRED}>EXPIRED</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minh chứng hình ảnh thực tế</FormLabel>
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

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={form.formState.isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cập nhật thay đổi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
