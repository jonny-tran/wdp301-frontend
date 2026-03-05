"use client";

<<<<<<< HEAD
import { useState, useMemo, useEffect } from "react";
=======
import { useEffect } from "react";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  XMarkIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Role } from "@/utils/enum";
import { handleErrorApi } from "@/lib/errors";
import { useForm } from "react-hook-form";
import { UpdateUserBody, UpdateUserBodyType } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

<<<<<<< HEAD
// Import UI Components chuẩn
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
=======
// Danh sách vai trò cấp cứng đồng bộ với Create
const HARDCODED_ROLES: { value: Role; label: string }[] = [
  { value: Role.MANAGER, label: "Quản lý khu vực" },
  { value: Role.SUPPLY_COORDINATOR, label: "Điều phối viên nguồn cung" },
  { value: Role.CENTRAL_KITCHEN_STAFF, label: "Nhân viên bếp trung tâm" },
  { value: Role.FRANCHISE_STORE_STAFF, label: "Nhân viên cửa hàng nhượng quyền" },
];
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

import { User } from "@/types/user";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
<<<<<<< HEAD
  user: any;
  roleOptions: any[];
=======
  user: User | null; // Dữ liệu user từ dòng được chọn trong bảng
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
}

export default function UserEditModal({
  isOpen,
  onClose,
  user,
  roleOptions,
}: UserEditModalProps) {
  const { updateUser } = useAuth();

<<<<<<< HEAD
  // 1. GIẢI PHÁP: Khởi tạo state rỗng và dùng useEffect một cách cẩn trọng
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    phone: "",
    status: "",
=======
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserBodyType>({
    resolver: zodResolver(UpdateUserBody),
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
  });

  // 2. Đồng bộ dữ liệu: Chỉ chạy khi user thay đổi hoặc modal được mở
  // Để tránh cảnh báo "cascading", ta đảm bảo logic này chỉ chạy để "sync" dữ liệu cũ
  useEffect(() => {
    if (isOpen && user) {
<<<<<<< HEAD
      setFormData({
        role: user.role || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.isActive ? "active" : "inactive",
      });
    }
  }, [isOpen, user]); // Phụ thuộc vào instance của user được chọn

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitPayload = {
      status: formData.status.toUpperCase(),
      role: formData.role,
      email: formData.email,
      phone: formData.phone || "",
    };
=======
      reset({
        role: user.role,
        email: user.email,
        phone: user.phone || "",
        status: user.isActive ? "ACTIVE" : "INACTIVE",
      });
    }
  }, [isOpen, user, reset]);
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

  const onSubmit = async (data: UpdateUserBodyType) => {
    if (!user) return;
    try {
      await updateUser.mutateAsync({
        id: user.id,
        payload: data,
      });
<<<<<<< HEAD

      onClose();
    } catch (err) {
      /* Handled in hook */
=======
      onClose();
    } catch (err) {
      handleErrorApi({
        error: err,
        setError,
      });
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
    }
  };

  return (
<<<<<<< HEAD
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white rounded-[3rem] p-0 border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* HEADER SECTION */}
        <DialogHeader className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              Cập nhật <span className="text-indigo-600">Tài khoản</span>
            </DialogTitle>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic truncate max-w-[200px]">
              ID: {user?.id}
            </p>
=======
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 space-y-6 shadow-2xl border border-slate-100 animate-in zoom-in duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-50 pb-5">
          <div className="flex flex-col">
            <h3 className="text-xl font-black uppercase italic text-slate-900 tracking-tighter">
              Cập nhật tài khoản
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic truncate max-w-[250px]">
              ID: {user.id}
            </span>
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
          </div>
          <Button
            onClick={onClose}
            className="p-2.5 bg-white text-slate-400 hover:text-red-500 rounded-xl transition-all border border-slate-100 shadow-sm"
          >
            <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
          </Button>
        </DialogHeader>

<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-4">
            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <EnvelopeIcon className="h-3 w-3" /> Email định danh
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-6 py-5 text-sm font-bold focus:bg-white transition-all shadow-sm"
              />
            </div>

            {/* PHONE FIELD */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <PhoneIcon className="h-3 w-3" /> Số điện thoại
              </label>
              <Input
                placeholder="09xx xxx xxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-6 py-5 text-sm font-bold focus:bg-white transition-all shadow-sm"
              />
            </div>

            {/* ROLE SELECT (DYNAMIC) */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <ShieldCheckIcon className="h-3 w-3" /> Quyền hạn hệ thống
              </label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
=======
        <div className="space-y-4">
          {/* TRƯỜNG: EMAIL */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-1">
              <EnvelopeIcon className="h-3 w-3" /> Email định danh
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white transition-all ${errors.email ? "border-red-500 bg-red-50" : ""
                }`}
            />
            {errors.email && <p className="text-[10px] text-red-500 ml-4">{errors.email.message}</p>}
          </div>

          {/* TRƯỜNG: SỐ ĐIỆN THOẠI */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-1">
              <PhoneIcon className="h-3 w-3" /> Số điện thoại
            </label>
            <input
              placeholder="09xx xxx xxx"
              {...register("phone")}
              className={`w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white transition-all ${errors.phone ? "border-red-500 bg-red-50" : ""
                }`}
            />
            {errors.phone && <p className="text-[10px] text-red-500 ml-4">{errors.phone.message}</p>}
          </div>

          {/* TRƯỜNG: VAI TRÒ */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Phân quyền hệ thống
            </label>
            <div className="relative">
              <select
                {...register("role")}
                className="w-full rounded-full bg-slate-50 border border-indigo-600 px-6 py-4 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer focus:bg-white transition-all"
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
              >
                <SelectTrigger className="w-full rounded-full bg-white border-2 border-slate-100 px-6 py-6 text-sm font-black text-slate-900 uppercase italic">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={8}
                  className="z-[130] min-w-[var(--radix-select-trigger-width)] rounded-[2rem] border-slate-100 bg-slate-900 shadow-2xl p-2"
                >
                  {roleOptions.map((role: any) => (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                      className="py-4 px-6 text-slate-300 focus:bg-indigo-600 focus:text-white rounded-2xl italic font-black uppercase text-[10px]"
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
<<<<<<< HEAD

            {/* STATUS SELECT */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <CheckCircleIcon className="h-3 w-3" /> Tình trạng hoạt động
              </label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-6 text-sm font-black text-slate-900">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl font-bold uppercase italic text-[10px]">
                  <SelectItem value="active" className="py-3 text-emerald-600">
                    Hoạt động (Active)
                  </SelectItem>
                  <SelectItem value="inactive" className="py-3 text-red-600">
                    Tạm khóa (Inactive)
                  </SelectItem>
                </SelectContent>
              </Select>
=======
            {errors.role && <p className="text-[10px] text-red-500 ml-4">{errors.role.message}</p>}
          </div>

          {/* TRƯỜNG: TRẠNG THÁI (ACTIVE/INACTIVE) */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Tình trạng tài khoản
            </label>
            <div className="relative">
              <select
                {...register("status")}
                className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer focus:bg-white transition-all"
              >
                <option value="ACTIVE">Hoạt động (Active)</option>
                <option value="INACTIVE">Tạm khóa (Inactive)</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
            </div>
            {errors.status && <p className="text-[10px] text-red-500 ml-4">{errors.status.message}</p>}
          </div>

<<<<<<< HEAD
          <Button
            type="submit"
            disabled={updateUser.isPending}
            className="w-full rounded-full bg-slate-900 py-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-slate-200 mt-2 italic"
          >
            {updateUser.isPending
              ? "Đang cập nhật..."
              : "LƯU THAY ĐỔI HỆ THỐNG"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
=======
        {/* Nút lưu thay đổi */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-slate-900 py-5 text-xs font-black text-white hover:bg-black transition-all active:scale-95 shadow-xl disabled:bg-slate-200"
        >
          {isSubmitting ? "Hệ thống đang lưu..." : "LƯU THAY ĐỔI"}
        </button>
      </form>
    </div>
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
  );
}

