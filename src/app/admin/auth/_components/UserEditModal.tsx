"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  XMarkIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

// UI Components
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
  user: UserRow | null; // Dữ liệu user được chọn từ bảng
  roleOptions: RoleOption[]; // Nhận từ Client để tránh fetch lặp lại
}

export default function UserEditModal({
  isOpen,
  onClose,
  user,
  roleOptions,
}: UserEditModalProps) {
  const { updateUser } = useAuth();

  // 1. Khởi tạo State sạch
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    phone: "",
    status: "ACTIVE",
  });

  // 2. Đồng bộ dữ liệu khi mở Modal
  /* eslint-disable react-hooks/set-state-in-effect -- Safe: syncs props to local state for modal form */
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        role: user.role || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.isActive ? "ACTIVE" : "INACTIVE",
      });
    }
  }, [isOpen, user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // CHUẨN HÓA DỮ LIỆU GỬI ĐI (FIX LỖI 400)
    const submitPayload = {
      status: formData.status.toUpperCase(), // Backend yêu cầu viết hoa
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
      <DialogContent className="max-w-xl bg-white rounded-[3rem] p-0 border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 z-[120]">
        {/* HEADER SECTION */}
        <DialogHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 text-left">
          <div className="space-y-0.5">
            <DialogTitle className="text-xl font-black font-display tracking-wider uppercase text-text-main leading-none">
              Cập nhật <span className="text-primary">Hồ sơ nhân sự</span>
            </DialogTitle>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic truncate max-w-[200px]">
              Tài khoản: {user.username}
            </p>
          </div>
          <Button
            onClick={onClose}
            className="p-2.5 bg-white text-slate-400 hover:text-red-500 rounded-xl transition-all border border-slate-100 shadow-sm"
          >
            <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="space-y-4">
            {/* EMAIL ĐỊNH DANH */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <EnvelopeIcon className="h-3 w-3" /> Email hệ thống
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-6 py-5 text-sm font-bold shadow-sm italic"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* SỐ ĐIỆN THOẠI */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                  <PhoneIcon className="h-3 w-3" /> Liên lạc
                </label>
                <Input
                  placeholder="09xx xxx xxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="rounded-full bg-slate-50 border-slate-100 px-6 py-5 text-sm font-bold shadow-sm"
                />
              </div>

              {/* TRẠNG THÁI TÀI KHOẢN */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                  <CheckCircleIcon className="h-3 w-3" /> Tình trạng
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="w-full rounded-full bg-white border border-slate-100 px-6 py-5 text-sm font-black text-slate-900">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-xl font-bold uppercase italic text-[10px]">
                    <SelectItem
                      value="ACTIVE"
                      className="py-3 text-emerald-600"
                    >
                      Đang hoạt động
                    </SelectItem>
                    <SelectItem value="INACTIVE" className="py-3 text-red-600">
                      Đang tạm khóa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* PHÂN QUYỀN VAI TRÒ (DYNAMIC) */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <ShieldCheckIcon className="h-3 w-3" /> Quyền hạn truy cập
              </label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger className="w-full rounded-full bg-white border-2 border-slate-100 px-6 py-6 text-sm font-black text-slate-900 uppercase italic">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={8}
                  className="z-[130] min-w-[var(--radix-select-trigger-width)] rounded-[2rem] border-slate-100 bg-slate-900 shadow-2xl p-2"
                >
                  {roleOptions.map((role) => (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                      className="py-4 px-6 text-slate-300 focus:bg-primary rounded-2xl italic font-black uppercase text-[10px]"
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
            className="w-full rounded-full bg-primary py-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-dark transition-all active:scale-95 disabled:bg-slate-200 mt-2 italic"
          >
            {updateUser.isPending
              ? "Đang lưu hệ thống..."
              : "LƯU THAY ĐỔI NHÂN SỰ"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
