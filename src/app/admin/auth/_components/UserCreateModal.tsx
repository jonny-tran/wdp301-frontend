"use client";

<<<<<<< HEAD
import { useState, useMemo } from "react"; // Loại bỏ useEffect
import { useAuth } from "@/hooks/useAuth";
import { extractStoreOptions, extractRoleOptions } from "./user.mapper";
=======
import { useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
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

<<<<<<< HEAD
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
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
=======
const HARDCODED_ROLES: { value: Role; label: string }[] = [
  { value: Role.MANAGER, label: "Quản lý khu vực" },
  { value: Role.SUPPLY_COORDINATOR, label: "Điều phối viên nguồn cung" },
  { value: Role.CENTRAL_KITCHEN_STAFF, label: "Nhân viên bếp trung tâm" },
  { value: Role.FRANCHISE_STORE_STAFF, label: "Nhân viên cửa hàng nhượng quyền" },
];
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

export default function UserCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
<<<<<<< HEAD
  const { createUser, getStores, getRoles } = useAuth();

  const { data: rolesData, isLoading: isLoadingRoles } = getRoles();
  const { data: storesData } = getStores({ limit: 100, sortOrder: "DESC" });

  const roleOptions = useMemo(() => extractRoleOptions(rolesData), [rolesData]);
  const storeOptions = useMemo(
    () => extractStoreOptions(storesData),
    [storesData],
  );

  // 1. Khởi tạo state với giá trị mặc định ngay từ đầu
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    storeId: "",
  });

  // 2. GIẢI PHÁP: Thay vì useEffect, ta dùng hàm handleClose để reset
  const resetAndClose = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: roleOptions[0]?.value || "",
      storeId: "",
    });
    onClose();
  };

  // 3. Logic lấy role hiện tại (Derived State) để tránh loop render
  const activeRole = formData.role || roleOptions[0]?.value || "";
  const isStoreStaff = activeRole === "franchise_store_staff";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = { ...formData, role: activeRole };

    if (isStoreStaff && !submitData.storeId) {
      toast.error("Vui lòng liên kết chi nhánh cho nhân viên!");
      return;
    }

    if (!isStoreStaff) delete (submitData as any).storeId;
=======
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
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

  const onSubmit = async (data: CreateUserBodyType) => {
    try {
      const submitData = { ...data };
      if (submitData.role !== Role.FRANCHISE_STORE_STAFF) {
        delete submitData.storeId;
      }
      await createUser.mutateAsync(submitData);
<<<<<<< HEAD
      resetAndClose(); // Thành công thì reset và đóng
    } catch (err) {
      /* Hook handled */
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
      <DialogOverlay className="z-100 bg-slate-900/60 backdrop-blur-md" />
      <DialogContent className="z-110 max-w-xl bg-white rounded-[3rem]p-0 border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* HEADER SECTION */}
        <DialogHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              Cấp tài khoản <span className="text-indigo-600">Nhân sự</span>
            </DialogTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
              SECURITY AUTHORIZATION
            </p>
          </div>
          <Button
=======
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
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
            onClick={onClose}
            className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100 shadow-sm"
          >
            <XMarkIcon className="h-6 w-6 stroke-[3px]" />
          </Button>
        </DialogHeader>

<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="space-y-5">
            {/* TÊN ĐĂNG NHẬP */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <UserIcon className="h-3.5 w-3.5" /> Tên đăng nhập
              </label>
              <Input
                required
                placeholder="Ví dụ: manager"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-8 py-5 text-sm font-bold focus:bg-white transition-all italic shadow-sm"
              />
=======
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
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
            </div>

<<<<<<< HEAD
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <EnvelopeIcon className="h-3.5 w-3.5" /> Email hệ thống
              </label>
              <Input
                required
                type="email"
                placeholder="@gmail.vn"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-8 py-7 text-sm font-bold focus:bg-white transition-all italic shadow-sm"
              />
            </div>

            {/* PHÂN QUYỀN VAI TRÒ */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <ShieldCheckIcon className="h-3.5 w-3.5" /> Quyền hạn truy cập
              </label>
              <Select
                value={formData.role}
                onValueChange={(val) =>
                  setFormData({ ...formData, role: val, storeId: "" })
                }
              >
                <SelectTrigger className="w-full rounded-full bg-white border-2 border-slate-100 px-8 py-7 text-sm font-black text-slate-900 focus:border-indigo-600 uppercase italic transition-all">
                  <SelectValue
                    placeholder={
                      isLoadingRoles ? "Đang tải..." : "Chọn vai trò"
                    }
                  />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={8}
                  className="z-[120] min-w-[var(--radix-select-trigger-width)] rounded-[2rem] border-slate-100 bg-slate-900 shadow-2xl p-2 font-bold uppercase italic text-[10px]"
                >
                  {roleOptions.map((role) => (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                      className="py-4 px-6 text-slate-300 focus:bg-indigo-600 focus:text-white rounded-2xl cursor-pointer transition-all tracking-widest"
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* LIÊN KẾT CỬA HÀNG (HIỆN KHI CẦN) */}
            {isStoreStaff && (
              <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
                <label className="text-[10px] font-black uppercase text-indigo-500 ml-5 flex items-center gap-2 italic">
                  <BuildingStorefrontIcon className="h-4 w-4" /> Liên kết cơ sở
                  nhượng quyền
                </label>
                <Select
                  value={formData.storeId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, storeId: val })
                  }
                >
                  <SelectTrigger className="w-full rounded-full bg-indigo-50/50 border-2 border-indigo-100 px-8 py-7 text-sm font-black text-indigo-900 focus:border-indigo-600 uppercase italic">
                    <SelectValue placeholder="Chọn chi nhánh..." />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    sideOffset={8}
                    className="z-[120] min-w-[var(--radix-select-trigger-width)] rounded-[2rem] border-slate-100 bg-white shadow-2xl p-2 font-bold uppercase italic text-[10px]"
                  >
                    {storeOptions.map((s) => (
                      <SelectItem
                        key={s.value}
                        value={s.value}
                        className="py-4 px-6 focus:bg-indigo-50 text-slate-600"
                      >
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* MẬT KHẨU */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <LockClosedIcon className="h-3.5 w-3.5" /> Mật khẩu khởi tạo
              </label>
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-8 py-7 text-sm font-bold focus:bg-white transition-all shadow-sm"
              />
            </div>
=======
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
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
          </div>

<<<<<<< HEAD
          {/* NÚT XÁC NHẬN */}
          <Button
            type="submit"
            disabled={createUser.isPending}
            className="w-full rounded-full bg-slate-900 py-8 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-slate-200 mt-4 italic"
          >
            {createUser.isPending ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Xác nhận ghi danh nhân sự"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
=======
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-slate-900 py-5 text-xs font-black text-white hover:bg-black transition-all shadow-xl disabled:bg-slate-200"
        >
          {isSubmitting ? "Đang ghi danh..." : "XÁC NHẬN TẠO MỚI"}
        </button>
      </form>
    </div>
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
  );
}

