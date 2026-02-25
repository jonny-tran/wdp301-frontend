"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { extractStoreOptions } from "./user.mapper";
import { toast } from "sonner";
import {
  XMarkIcon,
  CheckIcon,
  ShieldCheckIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

const HARDCODED_ROLES = [
  { value: "manager", label: "Quản lý khu vực" },
  { value: "supply_coordinator", label: "Điều phối viên nguồn cung" },
  { value: "central_kitchen_staff", label: "Nhân viên bếp trung tâm" },
  { value: "franchise_store_staff", label: "Nhân viên cửa hàng nhượng quyền" },
];

export default function UserCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createUser, getStores } = useAuth();

  const storesQuery = getStores({ limit: 100 });
  const storeOptions = useMemo(
    () => extractStoreOptions(storesQuery.data),
    [storesQuery.data],
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: HARDCODED_ROLES[0].value,
    storeId: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: "",
        email: "",
        password: "",
        role: HARDCODED_ROLES[0].value,
        storeId: "",
      });
    }
  }, [isOpen]);

  const isStoreStaff = formData.role === "franchise_store_staff";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isStoreStaff && !formData.storeId) {
      toast.error("Vui lòng liên kết cửa hàng cho nhân viên này!");
      return;
    }

    // --- XỬ LÝ DỮ LIỆU TRƯỚC KHI GỬI (FIX LỖI 400 UUID) ---
    const submitData = { ...formData };

    // Nếu không phải nhân viên store, loại bỏ hoàn toàn trường storeId
    // Việc gửi "" sẽ bị Backend báo lỗi không đúng định dạng UUID v4
    if (!isStoreStaff) {
      delete (submitData as any).storeId;
    }

    try {
      await createUser.mutateAsync(submitData);
      toast.success("Tạo tài khoản thành công!");
      onClose();
    } catch (err) {
      // Đã handle qua handleErrorApi trong hook
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit}
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
              required
              placeholder="nguyenvan_a"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-1">
              <EnvelopeIcon className="h-3 w-3" /> Email định danh
            </label>
            <input
              required
              type="email"
              placeholder="email@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Phân quyền vai trò
            </label>
            <div className="relative">
              <select
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                    storeId: "",
                  })
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

          {isStoreStaff && (
            <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase text-indigo-500 ml-4 flex items-center gap-2">
                <BuildingStorefrontIcon className="h-3.5 w-3.5" /> Liên kết cửa
                hàng
              </label>
              <select
                required
                value={formData.storeId}
                onChange={(e) =>
                  setFormData({ ...formData, storeId: e.target.value })
                }
                className="w-full rounded-full bg-indigo-50/50 border border-indigo-100 px-6 py-4 text-sm font-bold text-indigo-900 outline-none"
              >
                <option value="">--- Chọn cửa hàng cụ thể ---</option>
                {storeOptions.map((s: any) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4 flex items-center gap-1">
              <LockClosedIcon className="h-3 w-3" /> Mật khẩu khởi tạo
            </label>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createUser.isPending}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-slate-900 py-5 text-xs font-black text-white hover:bg-black transition-all shadow-xl disabled:bg-slate-200"
        >
          {createUser.isPending ? "Đang ghi danh..." : "XÁC NHẬN TẠO MỚI"}
        </button>
      </form>
    </div>
  );
}
