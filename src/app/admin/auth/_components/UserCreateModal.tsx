"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/hooks/useStore";
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
  SelectPortal,
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
  const { createUser, getRoles } = useAuth();
  const { storeList } = useStore();

  // 1. Fetch dữ liệu - Đảm bảo lấy đủ 100 store để không sót UI
  const { data: rolesData, isLoading: isLoadingRoles } = getRoles();
  const { data: storesData, isLoading: isLoadingStores } = storeList({
    limit: 100,
    sortOrder: "DESC",
  });

  // 2. Mapping dữ liệu (Đã fix logic bóc tách 3 lớp trong mapper)
  const roleOptions = useMemo(() => extractRoleOptions(rolesData), [rolesData]);
  const storeOptions = useMemo(
    () => extractStoreOptions(storesData),
    [storesData],
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    storeId: "",
  });

  // 3. Logic xác định vai trò (Dùng để hiển thị ô chi nhánh)
  const activeRole =
    formData.role || (roleOptions.length > 0 ? roleOptions[0].value : "");

  // Ép kiểu chuỗi và kiểm tra cả trường hợp Backend trả về chữ hoa/thường
  const isStoreStaff =
    activeRole.toString().toLowerCase().trim() === "franchise_store_staff" ||
    activeRole.toString().toUpperCase() === "STORE_STAFF";

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "",
      storeId: "",
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData, role: activeRole };

    if (isStoreStaff && !submitData.storeId) {
      toast.error("Vui lòng chọn chi nhánh nhượng quyền!");
      return;
    }

    if (!isStoreStaff) delete (submitData as any).storeId;

    try {
      await createUser.mutateAsync(submitData);
      toast.success("Tạo tài khoản thành công!");
      handleClose();
    } catch (err) {
      // Lỗi được xử lý tự động trong hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogOverlay className="z-[100] bg-slate-900/60 backdrop-blur-md" />
      <DialogContent className="max-w-xl bg-white rounded-[3rem] p-0 border-none shadow-2xl overflow-hidden z-[110]">
        {/* HEADER */}
        <DialogHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 text-left">
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              Ghi danh <span className="text-indigo-600">Nhân sự</span>
            </DialogTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">
              Account Creation
            </p>
          </div>
          <Button
            onClick={handleClose}
            className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100 shadow-sm"
          >
            <XMarkIcon className="h-6 w-6 stroke-[3.5px]" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            {/* USERNAME */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <UserIcon className="h-3.5 w-3.5" /> Tên đăng nhập
              </label>
              <Input
                required
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-8 py-6 text-sm font-bold text-black italic"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase ml-5 flex text-black items-center gap-2 italic">
                <EnvelopeIcon className="h-3.5 w-3.5" /> Email
              </label>
              <Input
                required
                type="email"
                placeholder="@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-full bg-slate-50 text-black border-slate-100 px-8 py-6 text-sm font-bold"
              />
            </div>

            {/* PHÂN QUYỀN */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <ShieldCheckIcon className="h-3.5 w-3.5" /> Vai trò hệ thống
              </label>
              <Select
                value={activeRole}
                onValueChange={(val) =>
                  setFormData({ ...formData, role: val, storeId: "" })
                }
              >
                <SelectTrigger className="w-full rounded-full bg-white border-2 border-slate-100 px-8 py-6 text-sm font-black text-black uppercase italic">
                  <SelectValue
                    placeholder={
                      isLoadingRoles ? "Đang tải..." : "Chọn vai trò"
                    }
                  />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent
                    position="popper"
                    sideOffset={8}
                    className="z-[160] min-w-[var(--radix-select-trigger-width)] rounded-[2rem] border-slate-100 bg-slate-900 shadow-2xl p-2 font-bold uppercase italic text-[10px]"
                  >
                    {roleOptions.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value}
                        className="py-4 px-6 text-slate-300 focus:bg-indigo-600 focus:text-white rounded-2xl cursor-pointer"
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </div>

            {/* CHỌN CHI NHÁNH (Hiển thị dựa trên logic isStoreStaff) */}
            {isStoreStaff && (
              <div className="space-y-1.5 animate-in slide-in-from-top-4 duration-500">
                <label className="text-[9px] font-black uppercase text-indigo-500 ml-5 flex items-center gap-2 italic">
                  <BuildingStorefrontIcon className="h-4 w-4" /> Chi nhánh liên
                  kết ({storeOptions.length})
                </label>
                <Select
                  value={formData.storeId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, storeId: val })
                  }
                >
                  <SelectTrigger className="w-full rounded-full bg-indigo-50/50 border-2 border-indigo-100 px-8 py-6 text-sm font-black text-indigo-900 focus:border-indigo-600 uppercase italic">
                    <SelectValue
                      placeholder={
                        isLoadingStores
                          ? "Đang lấy danh sách..."
                          : "Chọn cơ sở KFC..."
                      }
                    />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent
                      position="popper"
                      sideOffset={8}
                      className="z-[160] min-w-[var(--radix-select-trigger-width)] rounded-[2rem] border-slate-100 bg-white shadow-2xl p-2 font-bold uppercase italic text-[10px]"
                    >
                      {storeOptions.map((s) => (
                        <SelectItem
                          key={s.value}
                          value={s.value}
                          className="py-4 px-6 text-slate-700 font-bold uppercase italic text-[10px] 
               focus:bg-indigo-600 focus:text-white rounded-2xl cursor-pointer 
               data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-900"
                        >
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </div>
            )}

            {/* MẬT KHẨU */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <LockClosedIcon className="h-3.5 w-3.5" /> Mật khẩu
              </label>
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="rounded-full bg-slate-50 text-black border-slate-100 px-8 py-6 text-sm font-bold"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={createUser.isPending}
            className="w-full rounded-full bg-slate-900 py-7 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95 italic mt-4"
          >
            {createUser.isPending
              ? "Hệ thống đang lưu..."
              : "Xác nhận tạo tài khoản"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
