"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSupplierBody, CreateSupplierBodyType } from "@/schemas/supplier";
import { Supplier } from "@/types/supplier";
import { useSupplier } from "@/hooks/useSupplier";
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
  isOpen: boolean;
  supplier: Supplier | null;
  onClose: () => void;
}

export default function SupplierFormModal({ isOpen, supplier, onClose }: Props) {
  const isEdit = !!supplier;
  const { createSupplier, updateSupplier } = useSupplier();
  const isPending = createSupplier.isPending || updateSupplier.isPending;

  const form = useForm<CreateSupplierBodyType>({
    resolver: zodResolver(CreateSupplierBody),
    defaultValues: {
      name: "",
      contactName: "",
      phone: "",
      address: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: supplier?.name ?? "",
        contactName: supplier?.contactName ?? "",
        phone: supplier?.phone ?? "",
        address: supplier?.address ?? "",
        isActive: supplier?.isActive ?? true,
      });
    }
  }, [isOpen, supplier, form]);

  const onSubmit = async (data: CreateSupplierBodyType) => {
    try {
      if (isEdit && supplier) {
        await updateSupplier.mutateAsync({
          id: String(supplier.id),
          data,
        });
      } else {
        await createSupplier.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Chỉnh sửa thông tin đối tác #${supplier.id}`
              : "Đăng ký đối tác cung ứng mới"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên nhà cung cấp <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Công ty Thực phẩm sạch ABC"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Name */}
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người liên hệ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Họ và tên"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="09xx xxx xxx"
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Số nhà, tên đường, quận/huyện..."
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status (Edit only) */}
              {isEdit && (
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select
                        value={field.value === true ? "true" : "false"}
                        onValueChange={(val) => field.onChange(val === "true")}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                            <SelectValue placeholder="Trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Đang cung ứng</SelectItem>
                          <SelectItem value="false">Ngừng hợp tác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEdit ? "Cập nhật" : "Tạo mới"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
