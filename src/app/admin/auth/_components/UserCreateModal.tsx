"use client";

import { useState, useMemo } from "react"; // Loại bỏ useEffect
import { useAuth } from "@/hooks/useAuth";
import { extractStoreOptions, extractRoleOptions } from "./user.mapper";
import { toast } from "sonner";
import {
  XMarkIcon,
  ShieldCheckIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

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

export default function UserCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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

    try {
      await createUser.mutateAsync(submitData);
      resetAndClose(); // Thành công thì reset và đóng
    } catch (err) {
      /* Hook handled */
    }
  };
  return (
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
            onClick={onClose}
            className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100 shadow-sm"
          >
            <XMarkIcon className="h-6 w-6 stroke-[3px]" />
          </Button>
        </DialogHeader>

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
            </div>

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
          </div>

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
  );
}
