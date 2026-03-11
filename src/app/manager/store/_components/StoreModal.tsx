"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateStoreBody, CreateStoreBodyType, UpdateStoreBodyType } from "@/schemas/store";
import { Store } from "@/types/store";
import { useStore } from "@/hooks/useStore";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  editingStore: Store | null;
  onClose: () => void;
}

export default function StoreModal({ isOpen, editingStore, onClose }: Props) {
  const isEdit = !!editingStore;
  const { createStore, updateStore } = useStore();
  const isPending = createStore.isPending || updateStore.isPending;

  const form = useForm<CreateStoreBodyType>({
    resolver: zodResolver(CreateStoreBody),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      managerName: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: editingStore?.name ?? "",
        address: editingStore?.address ?? "",
        phone: editingStore?.phone ?? "",
        managerName:
          editingStore?.managerName === "Chưa bổ nhiệm"
            ? ""
            : (editingStore?.managerName ?? ""),
      });
    }
  }, [isOpen, editingStore, form]);

  const onSubmit = async (data: CreateStoreBodyType) => {
    try {
      if (isEdit && editingStore) {
        await updateStore.mutateAsync({
          id: editingStore.id,
          data: data as UpdateStoreBodyType,
        });
      } else {
        await createStore.mutateAsync(data);
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
            {isEdit ? "Chỉnh sửa cửa hàng" : "Thêm cửa hàng mới"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `ID: ${editingStore.id}`
              : "Đăng ký chi nhánh mới trong hệ thống"}
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
                      Tên chi nhánh <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: KFC Quận 1..."
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Manager Name */}
              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người quản lý</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Họ và tên..."
                        className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotline</FormLabel>
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
                          placeholder="Quận, TP..."
                          className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
