"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  XMarkIcon,
  CheckIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

// Danh sách vai trò cấp cứng đồng bộ với Create
const HARDCODED_ROLES = [
  { value: "manager", label: "Quản lý khu vực" },
  { value: "supply_coordinator", label: "Điều phối viên nguồn cung" },
  { value: "central_kitchen_staff", label: "Nhân viên bếp trung tâm" },
  { value: "franchise_store_staff", label: "Nhân viên cửa hàng nhượng quyền" },
];

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Dữ liệu user từ dòng được chọn trong bảng
}

export default function UserEditModal({
  isOpen,
  onClose,
  user,
}: UserEditModalProps) {
  const { updateUser } = useAuth(); // Lấy từ hook đã bổ sung updateUser

  const [formData, setFormData] = useState({
    role: "",
    email: "",
    phone: "",
    status: "active",
  });

  // Đồng bộ dữ liệu từ User được chọn vào Form khi mở Modal
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        role: user.role || HARDCODED_ROLES[0].value,
        email: user.email || "",
        phone: user.phone || "",
        status: user.isActive ? "active" : "inactive", // Map boolean sang chuỗi ACTIVE/INACTIVE
      });
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // CHUẨN HÓA DỮ LIỆU GỬI ĐI (FIX LỖI 400)
    // 1. Loại bỏ isActive và storeId vì server báo "should not exist"
    // 2. Gửi đúng format: { status, role, email, phone }
    const submitPayload = {
      status: formData.status.toUpperCase(), // Đảm bảo viết hoa
      role: formData.role,
      email: formData.email,
      phone: formData.phone || "",
    };

    try {
      await updateUser.mutateAsync({
        id: user.id,
        payload: submitPayload,
      });

      toast.success("Cập nhật thông tin thành công!");
      onClose();
    } catch (err) {
      // Lỗi đã được xử lý tự động trong hook qua handleErrorApi
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit}
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
          {/* TRƯỜNG: EMAIL (Có thể cho phép sửa hoặc readonly tùy Backend) */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-1">
              <EnvelopeIcon className="h-3 w-3" /> Email định danh
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white transition-all"
            />
          </div>

          {/* TRƯỜNG: SỐ ĐIỆN THOẠI */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-1">
              <PhoneIcon className="h-3 w-3" /> Số điện thoại
            </label>
            <input
              placeholder="09xx xxx xxx"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white transition-all"
            />
          </div>

          {/* TRƯỜNG: VAI TRÒ (CẤP CỨNG) */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Phân quyền hệ thống
            </label>
            <div className="relative">
              <select
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
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
          </div>

          {/* TRƯỜNG: TRẠNG THÁI (ACTIVE/INACTIVE) */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Tình trạng tài khoản
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer focus:bg-white transition-all"
              >
                <option value="active">Hoạt động (Active)</option>
                <option value="inactive">Tạm khóa (Inactive)</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Nút lưu thay đổi */}
        <button
          type="submit"
          disabled={updateUser.isPending}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-slate-900 py-5 text-xs font-black text-white hover:bg-black transition-all active:scale-95 shadow-xl disabled:bg-slate-200"
        >
          {updateUser.isPending ? "Hệ thống đang lưu..." : "LƯU THAY ĐỔI"}
        </button>
      </form>
    </div>
  );
}
