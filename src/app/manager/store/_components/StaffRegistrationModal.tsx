/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Plus, Trash2, UserPlus, Loader2, AlertCircle } from "lucide-react";
import { CreateStaffListBody, CreateStaffListBodyType } from "@/schemas/store";

interface Props {
  isOpen: boolean;
  storeId: string | null;
  onClose: () => void;
  onSubmit: (data: CreateStaffListBodyType) => void;
  isSubmitting: boolean;
}

export default function StaffRegistrationModal({
  isOpen,
  storeId,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) {
  const form = useForm<CreateStaffListBodyType>({
    resolver: zodResolver(CreateStaffListBody),
    defaultValues: {
      staff: [{ storeId: storeId || "", fullName: "", phone: "", note: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "staff",
  });

  // Quan trọng: Cập nhật storeId vào form mỗi khi Modal mở hoặc storeId từ Table truyền xuống thay đổi
  useEffect(() => {
    if (isOpen && storeId) {
      form.reset({
        staff: [{ storeId: storeId, fullName: "", phone: "", note: "" }],
      });
    }
  }, [isOpen, storeId, form]);

  const handleInternalSubmit = async (data: CreateStaffListBodyType) => {
    await onSubmit(data);
    form.reset(); // Xóa trắng form sau khi gửi thành công
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-8">
        <DialogHeader className="relative">
          <div className="absolute -top-12 -left-4 bg-indigo-600 text-white p-3 rounded-2xl -rotate-3 shadow-xl">
            <UserPlus className="h-6 w-6 stroke-[2.5px]" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-wider text-slate-900 mt-4">
            Ghi danh nhân sự
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
            Đăng ký nhân viên mới cho chi nhánh hệ thống
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleInternalSubmit)}
            className="space-y-6 mt-4"
          >
            {/* Debug Helper: Hiển thị lỗi nếu có trường nào bị kẹt Validation (ví dụ storeId trống) */}
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase italic">
                <AlertCircle className="h-4 w-4" />
                Vui lòng kiểm tra lại thông tin các trường đỏ bên dưới
              </div>
            )}

            <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4 scrollbar-hide">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group animate-in fade-in zoom-in-95 duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tên nhân viên */}
                    <FormField
                      control={form.control}
                      name={`staff.${index}.fullName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2">
                            Họ và Tên <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nguyễn Văn A..."
                              className="rounded-full bg-white border-slate-200 h-11 px-5 font-black italic text-slate-900 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[9px] font-bold italic text-red-500 ml-2" />
                        </FormItem>
                      )}
                    />

                    {/* Số điện thoại */}
                    <FormField
                      control={form.control}
                      name={`staff.${index}.phone`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2">
                            Số điện thoại{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="09xx xxx xxx"
                              className="rounded-full bg-white border-slate-200 h-11 px-5 font-black italic text-slate-900 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[9px] font-bold italic text-red-500 ml-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Ghi chú */}
                  <FormField
                    control={form.control}
                    name={`staff.${index}.note`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2">
                          Ghi chú công việc
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="VD: Làm ca sáng, hỗ trợ sơ chế..."
                            className="rounded-full bg-white border-slate-200 h-11 px-5 font-black italic text-slate-900 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Nút xóa dòng nhân sự */}
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 bg-white shadow-lg rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 stroke-[2.5px]" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Nút thêm dòng mới */}
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full border-dashed border-2 border-slate-200 py-7 font-black uppercase italic text-[10px] tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
              onClick={() =>
                append({
                  storeId: storeId || "",
                  fullName: "",
                  phone: "",
                  note: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Thêm nhân sự mới vào danh sách
            </Button>

            <DialogFooter className="pt-4 gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="font-black uppercase italic text-[10px] tracking-widest text-slate-400 hover:text-slate-900"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-slate-900 hover:bg-black text-white font-black uppercase italic text-[10px] tracking-[0.2em] px-10 h-12 shadow-xl shadow-slate-200 active:scale-95 transition-all"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Xác nhận ghi danh ({fields.length})
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
