"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateBaseUnitBody,
  CreateBaseUnitBodyType,
} from "@/schemas/base-unit";
import { BaseUnit } from "@/types/base-unit";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  unit: BaseUnit | null;
  onClose: () => void;
  onSubmit: (data: CreateBaseUnitBodyType) => void;
  isSubmitting?: boolean;
}

export default function BaseUnitFormModal({
  isOpen,
  unit,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const isEdit = !!unit;

  const form = useForm<CreateBaseUnitBodyType>({
    resolver: zodResolver(CreateBaseUnitBody),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Sync form when opening in edit mode
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: unit?.name ?? "",
        description: unit?.description ?? "",
      });
    }
  }, [isOpen, unit, form]);

  const handleSubmit = (data: CreateBaseUnitBodyType) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {/* DialogHeader inherits pr-12 from component definition — safe from [X] overlap */}
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Cập nhật đơn vị" : "Thêm đơn vị mới"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Chỉnh sửa thông tin đơn vị #${unit.id}`
              : "Tạo đơn vị tính mới cho hệ thống sản phẩm"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              {/* Field: Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tên đơn vị <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Kg, Bao, Miếng, Lít..."
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Field: Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả đơn vị tính..."
                        rows={3}
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50 resize-none"
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
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
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
