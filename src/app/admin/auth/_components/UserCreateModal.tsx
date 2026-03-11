"use client";

import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/hooks/useStore";
import { Role } from "@/utils/enum";
import {
  BuildingStorefrontIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleOption } from "./user.types";

interface StoreOption {
  value: string;
  label: string;
}

export default function UserCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createUser, getRoles } = useAuth();
  const { storeList } = useStore();

  // 1. Fetch dữ liệu
  const { data: rolesData, isLoading: isLoadingRoles } = getRoles();
  const { data: storesData, isLoading: isLoadingStores } = storeList({
    page: 1,
    limit: 100,
    sortOrder: "DESC",
  });

  // 2. Mapping dữ liệu — trực tiếp từ typed response
  const roleOptions: RoleOption[] = useMemo(() => {
    if (!rolesData) return [];
    const roles = Array.isArray(rolesData)
      ? rolesData
      : Array.isArray((rolesData as { data?: RoleOption[] })?.data)
        ? (rolesData as { data: RoleOption[] }).data
        : [];
    return roles
      .filter((r) => r.value && r.label)
      .map((r) => ({ value: String(r.value), label: String(r.label) }));
  }, [rolesData]);

  const storeOptions: StoreOption[] = useMemo(() => {
    if (!storesData) return [];
    const response = storesData as {
      items?: { id: string; name: string }[];
      data?: { items?: { id: string; name: string }[] };
    };
    const rawItems = response?.items ?? response?.data?.items ?? [];
    if (!Array.isArray(rawItems)) return [];
    return rawItems.map((s) => ({ value: s.id, label: s.name }));
  }, [storesData]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    storeId: "",
  });

  // 3. Logic xác định vai trò
  const activeRole =
    formData.role || (roleOptions.length > 0 ? roleOptions[0].value : "");

  const isStoreStaff =
    activeRole.toLowerCase().trim() === "franchise_store_staff";

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
    const submitData: {
      username: string;
      email: string;
      password: string;
      role: Role;
      storeId?: string;
    } = {
      ...formData,
      role: activeRole as Role,
    };

    if (isStoreStaff && !submitData.storeId) {
      toast.error("Vui lòng chọn chi nhánh nhượng quyền!");
      return;
    }

    if (!isStoreStaff) delete submitData.storeId;

    try {
      await createUser.mutateAsync(submitData);
      toast.success("Tạo tài khoản thành công!");
      handleClose();
    } catch {
      // Lỗi được xử lý tự động trong hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogOverlay className="z-[100] bg-black/40 backdrop-blur-sm" />
      <DialogContent className="max-w-xl bg-white rounded-2xl p-0 border-none shadow-2xl overflow-hidden z-[110]">
        {/* HEADER */}
        <DialogHeader className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 text-left">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-900 leading-none">
              Tạo tài khoản <span className="text-primary">nhân viên</span>
            </DialogTitle>
            <p className="text-xs text-slate-400 mt-1">
              Ghi danh tài khoản mới vào hệ thống
            </p>
          </div>
          <Button
            onClick={handleClose}
            className="p-2.5 bg-white text-slate-400 hover:text-red-500 rounded-xl transition-all border border-slate-100"
          >
            <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            {/* USERNAME */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5" /> Tên người dùng
              </label>
              <Input
                required
                placeholder="Nhập tên người dùng"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="rounded-xl bg-slate-50 border-slate-100 px-4 py-3 text-sm font-medium text-slate-900"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                <EnvelopeIcon className="h-3.5 w-3.5" /> Email
              </label>
              <Input
                required
                type="email"
                placeholder="user@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-xl bg-slate-50 border-slate-100 px-4 py-3 text-sm font-medium text-slate-900"
              />
            </div>

            {/* PHÂN QUYỀN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                <ShieldCheckIcon className="h-3.5 w-3.5" /> Vai trò
              </label>
              <Select
                value={activeRole}
                onValueChange={(val) =>
                  setFormData({ ...formData, role: val, storeId: "" })
                }
              >
                <SelectTrigger className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm font-bold text-slate-900">
                  <SelectValue
                    placeholder={
                      isLoadingRoles ? "Đang tải..." : "Chọn vai trò"
                    }
                  />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent
                    position="popper"
                    sideOffset={4}
                    className="z-[160] min-w-[var(--radix-select-trigger-width)] rounded-xl border-slate-100 bg-white shadow-xl p-1"
                  >
                    {roleOptions.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value}
                        className="py-3 px-4 text-sm text-slate-700 font-medium focus:bg-primary/10 focus:text-primary rounded-lg cursor-pointer"
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </div>

            {/* CHỌN CHI NHÁNH */}
            {isStoreStaff && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-primary ml-1 flex items-center gap-1.5">
                  <BuildingStorefrontIcon className="h-3.5 w-3.5" /> Chi nhánh
                  liên kết ({storeOptions.length})
                </label>
                <Select
                  value={formData.storeId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, storeId: val })
                  }
                >
                  <SelectTrigger className="w-full rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-sm font-bold text-slate-900">
                    <SelectValue
                      placeholder={
                        isLoadingStores
                          ? "Đang tải danh sách..."
                          : "Chọn cơ sở KFC..."
                      }
                    />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent
                      position="popper"
                      sideOffset={4}
                      className="z-[160] min-w-[var(--radix-select-trigger-width)] rounded-xl border-slate-100 bg-white shadow-xl p-1"
                    >
                      {storeOptions.map((s) => (
                        <SelectItem
                          key={s.value}
                          value={s.value}
                          className="py-3 px-4 text-sm text-slate-700 font-medium focus:bg-primary/10 focus:text-primary rounded-lg cursor-pointer"
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
              <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                <LockClosedIcon className="h-3.5 w-3.5" /> Mật khẩu
              </label>
              <Input
                required
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="rounded-xl bg-slate-50 border-slate-100 px-4 py-3 text-sm font-medium text-slate-900"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={createUser.isPending}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] mt-4"
          >
            {createUser.isPending ? "Đang tạo..." : "Tạo tài khoản"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
