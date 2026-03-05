"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Store } from "@/types/store";
import { CreateStoreBody, CreateStoreBodyType, UpdateStoreBodyType } from "@/schemas/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingStore: Store | null;
}

export default function StoreModal({ isOpen, onClose, editingStore }: StoreModalProps) {
  const { createStore, updateStore } = useStore();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateStoreBodyType>({
    resolver: zodResolver(CreateStoreBody),
  });

  // Đổ dữ liệu vào form khi chế độ Edit được kích hoạt
  useEffect(() => {
    if (editingStore && isOpen) {
      reset({
        name: editingStore.name || "",
        address: editingStore.address || "",
        phone: editingStore.phone || "",
        managerName:
          editingStore.managerName === "Chưa bổ nhiệm"
            ? ""
            : editingStore.managerName,
      });
    } else if (isOpen) {
      reset({ name: "", address: "", phone: "", managerName: "" });
    }
  }, [editingStore, isOpen, reset]);

  const onSubmit = async (data: CreateStoreBodyType) => {
    try {
      if (editingStore) {
        await updateStore.mutateAsync({
          id: editingStore.id,
          data: data as UpdateStoreBodyType,
        });
      } else {
        await createStore.mutateAsync(data);
      }
      onClose();
    } catch (e: any) {
      handleErrorApi({
        error: e,
        setError,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[2.5rem] p-10 bg-white border-none shadow-2xl outline-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic text-black tracking-tighter">
            {editingStore ? "Chỉnh sửa Store" : "Thêm Store mới"}
          </DialogTitle>
          <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest italic">
            {editingStore
              ? `ID: ${editingStore.id}`
              : "Nhập thông tin hệ thống"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Tên Store */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em] ml-2">
              Tên chi nhánh
            </label>
            <input
              {...register("name")}
              className={`w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-black focus:border-black focus:bg-white transition-all outline-none ${errors.name ? "border-red-500 bg-red-50" : ""}`}
              placeholder="VD: KFC Quận 1..."
            />
            {errors.name && <p className="text-[10px] text-red-500 ml-2">{errors.name.message}</p>}
          </div>

          {/* Quản lý */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em] ml-2">
              Người quản lý
            </label>
            <input
              {...register("managerName")}
              className={`w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-black focus:border-black focus:bg-white transition-all outline-none ${errors.managerName ? "border-red-500 bg-red-50" : ""}`}
              placeholder="Họ và tên..."
            />
            {errors.managerName && <p className="text-[10px] text-red-500 ml-2">{errors.managerName.message}</p>}
          </div>

          {/* Phone & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em] ml-2">
                Hotline
              </label>
              <input
                {...register("phone")}
                className={`w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-black focus:border-black focus:bg-white transition-all outline-none ${errors.phone ? "border-red-500 bg-red-50" : ""}`}
              />
              {errors.phone && <p className="text-[10px] text-red-500 ml-2">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em] ml-2">
                Địa chỉ
              </label>
              <input
                {...register("address")}
                className={`w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-black focus:border-black focus:bg-white transition-all outline-none ${errors.address ? "border-red-500 bg-red-50" : ""}`}
              />
              {errors.address && <p className="text-[10px] text-red-500 ml-2">{errors.address.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:bg-slate-200"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : editingStore
                ? "Cập nhật ngay"
                : "Xác nhận tạo"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

