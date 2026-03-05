"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  XMarkIcon,
  ShieldCheckIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { useStore } from "@/hooks/useStore";
import { Role } from "@/utils/enum";
import { useForm } from "react-hook-form";
import { CreateUserBody, CreateUserBodyType } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

const HARDCODED_ROLES: { value: Role; label: string }[] = [
  { value: Role.MANAGER, label: "Quản lý khu vực" },
  { value: Role.SUPPLY_COORDINATOR, label: "Điều phối viên nguồn cung" },
  { value: Role.CENTRAL_KITCHEN_STAFF, label: "Nhân viên bếp trung tâm" },
  { value: Role.FRANCHISE_STORE_STAFF, label: "Nhân viên cửa hàng nhượng quyền" },
];

export default function UserCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createUser } = useAuth();
  const { storeList } = useStore();

  const storesQuery = storeList({ page: 1, limit: 100, sortOrder: "DESC" });
  const storeOptions = useMemo(
    () => {
      const stores: any = (storesQuery.data as any)?.items || (storesQuery.data as any)?.data?.items || [];
      return Array.isArray(stores) ? stores.map((s: any) => ({
        value: s.id ?? "",
        label: s.name ?? "",
      })) : [];
    },
    [storesQuery.data],
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserBodyType>({
    resolver: zodResolver(CreateUserBody),
    defaultValues: {
      role: Role.MANAGER,
    },
  });

  const selectedRole = watch("role");
  const isStoreStaff = selectedRole === Role.FRANCHISE_STORE_STAFF;

  useEffect(() => {
    if (isOpen) {
      reset({
        username: "",
        email: "",
        password: "",
        role: Role.MANAGER,
        storeId: undefined,
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateUserBodyType) => {
    try {
      const submitData = { ...data };
      if (submitData.role !== Role.FRANCHISE_STORE_STAFF) {
        delete submitData.storeId;
      }
      await createUser.mutateAsync(submitData);
      onClose();
    } catch (err) {
      handleErrorApi({
        error: err,
        setError,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 space-y-6 border border-slate-100 shadow-2xl animate-in zoom-in duration-300"
      >
        <div className="flex justify-between items-center border-b border-slate-50 pb-5">
          <h3 className="text-xl font-black uppercase italic text-slate-900 tracking-tighter">
            Cấp tài khoản mới
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-1">
              <UserIcon className="h-3 w-3" /> Tên đăng nhập
            </label>
            <input
              placeholder="nguyenvan_a"
              {...register("username")}
              className={`w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all ${errors.username ? "border-red-500 bg-red-50" : ""
                }`}
            />
            {errors.username && <p className="text-[10px] text-red-500 ml-4">{errors.username.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-1">
              <EnvelopeIcon className="h-3 w-3" /> Email định danh
            </label>
            <input
              type="email"
              placeholder="email@gmail.com"
              {...register("email")}
              className={`w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all ${errors.email ? "border-red-500 bg-red-50" : ""
                }`}
            />
            {errors.email && <p className="text-[10px] text-red-500 ml-4">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Phân quyền vai trò
            </label>
            <div className="relative">
              <select
                {...register("role")}
                onChange={(e) => {
                  const role = e.target.value as Role;
                  setValue("role", role);
                  if (role !== Role.FRANCHISE_STORE_STAFF) {
                    setValue("storeId", undefined);
                  }
                }}
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

          {isStoreStaff && (
            <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase text-indigo-500 ml-4 flex items-center gap-2">
                <BuildingStorefrontIcon className="h-3.5 w-3.5" /> Liên kết cửa
                hàng
              </label>
              <select
                {...register("storeId")}
                className={`w-full rounded-full bg-indigo-50/50 border border-indigo-100 px-6 py-4 text-sm font-bold text-indigo-900 outline-none ${errors.storeId ? "border-red-500" : ""
                  }`}
              >
                <option value="">--- Chọn cửa hàng cụ thể ---</option>
                {storeOptions.map((s: any) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.storeId && <p className="text-[10px] text-red-500 ml-4">{errors.storeId.message}</p>}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-1">
              <LockClosedIcon className="h-3 w-3" /> Mật khẩu khởi tạo
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all ${errors.password ? "border-red-500 bg-red-50" : ""
                }`}
            />
            {errors.password && <p className="text-[10px] text-red-500 ml-4">{errors.password.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-slate-900 py-5 text-xs font-black text-white hover:bg-black transition-all shadow-xl disabled:bg-slate-200"
        >
          {isSubmitting ? "Đang ghi danh..." : "XÁC NHẬN TẠO MỚI"}
        </button>
      </form>
    </div>
  );
}

