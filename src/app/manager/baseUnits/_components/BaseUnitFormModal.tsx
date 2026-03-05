/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateBaseUnitBody,
  CreateBaseUnitBodyType,
} from "@/schemas/base-unit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  unit: any | null; // Nếu null là POST, nếu có data là PATCH
  onClose: () => void;
  onSubmit: (data: CreateBaseUnitBodyType) => void;
}

export default function BaseUnitFormModal({
  isOpen,
  unit,
  onClose,
  onSubmit,
}: Props) {
  // 1. Khởi tạo Form với Zod validation
  const form = useForm<CreateBaseUnitBodyType>({
    resolver: zodResolver(CreateBaseUnitBody),
    defaultValues: {
      name: unit?.name || "",
      description: unit?.description || "",
    },
  });

  const isEdit = !!unit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
        {/* HEADER MODAL */}
        <DialogHeader className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
              {isEdit ? "Cập nhật" : "Thêm mới"}{" "}
              <span className="text-indigo-600">Đơn vị</span>
            </DialogTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
              {isEdit
                ? `Chỉnh sửa mã ID: #${unit.id}`
                : "Khởi tạo đơn vị tính mới cho hệ thống"}
            </p>
          </div>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
          >
            <XMarkIcon className="w-5 h-5 text-slate-400 stroke-[3px]" />
          </Button>
        </DialogHeader>

        {/* FORM BODY */}
        <div className="p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Field: Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest ml-1">
                      Tên đơn vị tính <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Kg, Bao, Miếng, Lít..."
                        className="rounded-[1.2rem] py-6 px-6 font-bold text-slate-900 border-slate-200 focus:ring-4 ring-indigo-500/10 transition-all placeholder:text-slate-300 placeholder:italic"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold italic text-red-500 ml-1" />
                  </FormItem>
                )}
              />

              {/* Field: Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest ml-1">
                      Mô tả chi tiết
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả định lượng hoặc cách sử dụng đơn vị này..."
                        className="rounded-[1.5rem] p-6 font-bold text-slate-900 border-slate-200 focus:ring-4 ring-indigo-500/10 transition-all min-h-120px placeholder:text-slate-300 placeholder:italic"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold italic text-red-500 ml-1" />
                  </FormItem>
                )}
              />

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-5 rounded-full border border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all italic"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-2 px-12 py-5 rounded-full bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 shadow-xl transition-all group"
                >
                  <CheckIcon className="w-4 h-4 stroke-[4px] group-hover:scale-110 transition-transform" />
                  {isEdit ? "Cập nhật dữ liệu" : "Tạo đơn vị mới"}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
