"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ShieldCheckIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  PhoneIcon,
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
  DialogTitle,
} from "@/components/ui/dialog";
import { UserRow, RoleOption } from "./user.types";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserRow | null;
  roleOptions: RoleOption[];
}

export default function UserEditModal({
  isOpen,
  onClose,
  user,
  roleOptions,
}: UserEditModalProps) {
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    role: "",
    email: "",
    phone: "",
    status: "ACTIVE",
  });

  // Đồng bộ dữ liệu khi mở Modal
  /* eslint-disable react-hooks/set-state-in-effect -- Safe: syncs props to local state for modal form */
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        role: user.role || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      });
    }
  }, [isOpen, user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitPayload = {
      status: formData.status.toUpperCase(),
      role: formData.role,
      email: formData.email,
      phone: formData.phone || "",
    };

    try {
      if (!user?.id) return;
      await updateUser.mutateAsync({
        id: user.id,
        payload: submitPayload,
      });

      toast.success("Cập nhật thông tin thành công!");
      onClose();
    } catch {
      // Error đã được handle tự động trong hook
    }
  };

  if (!isOpen || !user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-white rounded-2xl p-0 border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 z-[120]">
        {/* HEADER */}
        <DialogHeader className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 text-left">
          <div className="space-y-0.5">
            <DialogTitle className="text-xl font-bold text-slate-900 leading-none">
              Cập nhật <span className="text-primary">hồ sơ nhân sự</span>
            </DialogTitle>
            <p
              className="text-xs text-slate-400 truncate max-w-[250px]"
              title={user.username}
            >
              Tài khoản: {user.username}
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                <EnvelopeIcon className="h-3.5 w-3.5" /> Email hệ thống
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-xl bg-slate-50 border-slate-100 px-4 py-3 text-sm font-medium text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* SỐ ĐIỆN THOẠI */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                  <PhoneIcon className="h-3.5 w-3.5" /> Liên lạc
                </label>
                <Input
                  placeholder="09xx xxx xxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="rounded-xl bg-slate-50 border-slate-100 px-4 py-3 text-sm font-medium text-slate-900"
                />
              </div>

              {/* TRẠNG THÁI TÀI KHOẢN */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                  <CheckCircleIcon className="h-3.5 w-3.5" /> Trạng thái
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm font-bold text-slate-900">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-lg">
                    <SelectItem
                      value="ACTIVE"
                      className="py-2.5 text-emerald-600 font-medium"
                    >
                      Đang hoạt động
                    </SelectItem>
                    <SelectItem
                      value="INACTIVE"
                      className="py-2.5 text-red-600 font-medium"
                    >
                      Tạm khóa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* PHÂN QUYỀN VAI TRÒ */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                <ShieldCheckIcon className="h-3.5 w-3.5" /> Vai trò
              </label>
              <Select
                value={formData.role}
                onValueChange={(val) =>
                  setFormData({ ...formData, role: val })
                }
              >
                <SelectTrigger className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm font-bold text-slate-900">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={4}
                  className="z-[130] min-w-[var(--radix-select-trigger-width)] rounded-xl border-slate-100 bg-white shadow-xl p-1"
                >
                  {roleOptions.map((role) => (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                      className="py-3 px-4 text-sm text-slate-700 font-medium focus:bg-primary/10 focus:text-primary rounded-lg"
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={updateUser.isPending}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:bg-slate-200 mt-2"
          >
            {updateUser.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
