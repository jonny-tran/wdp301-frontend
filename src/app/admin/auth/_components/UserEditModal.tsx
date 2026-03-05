"use client";

import { useEffect } from "react";
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

// Danh sách vai trò cấp cứng đồng bộ với Create
const HARDCODED_ROLES: { value: Role; label: string }[] = [
  { value: Role.MANAGER, label: "Quản lý khu vực" },
  { value: Role.SUPPLY_COORDINATOR, label: "Điều phối viên nguồn cung" },
  { value: Role.CENTRAL_KITCHEN_STAFF, label: "Nhân viên bếp trung tâm" },
  { value: Role.FRANCHISE_STORE_STAFF, label: "Nhân viên cửa hàng nhượng quyền" },
];

import { User } from "@/types/user";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null; // Dữ liệu user từ dòng được chọn trong bảng
}

export default function UserEditModal({
  isOpen,
  onClose,
  user,
}: UserEditModalProps) {
  const { updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserBodyType>({
    resolver: zodResolver(UpdateUserBody),
  });

  // Đồng bộ dữ liệu từ User được chọn vào Form khi mở Modal
  useEffect(() => {
    if (isOpen && user) {
      reset({
        role: user.role,
        email: user.email,
        phone: user.phone || "",
        status: user.isActive ? "ACTIVE" : "INACTIVE",
      });
    }
  }, [isOpen, user, reset]);

  const onSubmit = async (data: UpdateUserBodyType) => {
    if (!user) return;
    try {
      await updateUser.mutateAsync({
        id: user.id,
        payload: data,
      });
      onClose();
    } catch (err) {
      handleErrorApi({
        error: err,
        setError,
      });
    }
  };

  if (!isOpen || !user) return null;

  return (
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
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

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
              >
                {HARDCODED_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-600">
                <ShieldCheckIcon className="h-5 w-5" />
              </div>
            </div>
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
            </div>
            {errors.status && <p className="text-[10px] text-red-500 ml-4">{errors.status.message}</p>}
          </div>
        </div>

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
  );
}

