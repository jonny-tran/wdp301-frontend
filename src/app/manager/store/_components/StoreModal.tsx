/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useMemo } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateStoreBody,
  CreateStoreBodyType,
  UpdateStoreBodyType,
} from "@/schemas/store";
import { Store } from "@/types/store";
import { useStore } from "@/hooks/useStore";
import { handleErrorApi } from "@/lib/errors";
import { cn } from "@/lib/utils";
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
import { Loader2, Store as StoreIcon } from "lucide-react";

interface Props {
  isOpen: boolean;
  editingStore: Store | null;
  onClose: () => void;
}

// Hàm format số điện thoại: 0901 234 567
const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const len = phoneNumber.length;
  if (len < 5) return phoneNumber;
  if (len < 8) return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
  return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 11)}`;
};

export default function StoreModal({ isOpen, editingStore, onClose }: Props) {
  const isEdit = !!editingStore;
  const { createStore, updateStore } = useStore();
  const isPending = createStore.isPending || updateStore.isPending;

  const form = useForm<CreateStoreBodyType>({
    resolver: zodResolver(
      CreateStoreBody,
    ) as unknown as Resolver<CreateStoreBodyType>,
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      managerName: "",
    },
  });

  // Reset form khi đóng/mở hoặc đổi store edit
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: editingStore?.name ?? "",
        address: editingStore?.address ?? "",
        phone: editingStore?.phone ? formatPhoneNumber(editingStore.phone) : "",
        managerName:
          editingStore?.managerName === "Chưa bổ nhiệm"
            ? ""
            : (editingStore?.managerName ?? ""),
      });
    }
  }, [isOpen, editingStore, form]);

  const onSubmit = async (data: CreateStoreBodyType) => {
    try {
      // 1. Kiểm tra và làm sạch dữ liệu an toàn
      const cleanData = {
        ...data,
        // Sử dụng ?? "" để đảm bảo luôn là string trước khi replace
        phone: (data.phone ?? "").replace(/\s/g, ""),
      };

      if (isEdit && editingStore) {
        await updateStore.mutateAsync({
          id: editingStore.id,
          data: cleanData as UpdateStoreBodyType,
        });
      } else {
        await createStore.mutateAsync(cleanData);
      }
      form.reset();
      onClose();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-[2.5rem] border-none shadow-2xl p-8">
        <DialogHeader className="relative">
          <div className="absolute -top-12 -left-4 bg-slate-900 text-white p-3 rounded-2xl rotate-3 shadow-xl">
            <StoreIcon className="h-6 w-6 stroke-[2.5px]" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-wider text-slate-900 mt-4">
            {isEdit ? "Cập nhật Chi nhánh" : "Mở Chi nhánh mới"}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
            {isEdit
              ? `Mã hệ thống: ${editingStore.id}`
              : "Đăng ký điểm kinh doanh mới vào mạng lưới"}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto pr-2 scrollbar-hide py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 1. Tên Chi nhánh */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2 tracking-widest">
                      Tên chi nhánh <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: KFC Nguyễn Thái Học..."
                        className="rounded-full bg-slate-50 border-slate-100 h-12 px-6 font-black italic text-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold italic ml-4 text-red-500" />
                  </FormItem>
                )}
              />

              {/* 2. Quản lý chi nhánh */}
              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2 tracking-widest">
                      Người quản lý vận hành
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Họ và tên Quản lý..."
                        className="rounded-full bg-slate-50 border-slate-100 h-12 px-6 font-black italic text-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold italic ml-4 text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 3. Số điện thoại (Formatting) */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2 tracking-widest">
                        Hotline liên hệ
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="09xx xxx xxx"
                          className="rounded-full bg-slate-50 border-slate-100 h-12 px-6 font-black italic text-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
                          {...field}
                          onKeyDown={(e) =>
                            ["e", "E", "+", "-"].includes(e.key) &&
                            e.preventDefault()
                          }
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            if (formatted.length <= 13)
                              field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold italic ml-4 text-red-500" />
                    </FormItem>
                  )}
                />

                {/* 4. Địa chỉ */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2 tracking-widest">
                        Khu vực / Địa chỉ
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Quận, TP..."
                          className="rounded-full bg-slate-50 border-slate-100 h-12 px-6 font-black italic text-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold italic ml-4 text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-6 gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isPending}
                  className="rounded-full font-black uppercase italic text-[10px] tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-slate-900 hover:bg-black text-white font-black uppercase italic text-[10px] tracking-[0.2em] px-10 h-12 shadow-xl shadow-slate-200 active:scale-95 transition-all"
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEdit ? "Cập nhật dữ liệu" : "Kích hoạt Store"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
