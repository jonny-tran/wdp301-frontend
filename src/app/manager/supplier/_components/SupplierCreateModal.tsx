"use client";

import { useState } from "react";
import { useSupplier } from "@/hooks/useSupplier"; // Giả định hook của bạn
import { toast } from "sonner";
import {
  XMarkIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SupplierCreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createSupplier } = useSupplier();

  // 1. Quản lý State sạch (Thay thế cho reset của react-hook-form nếu gặp lỗi)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
  });

  // 2. Logic Reset và Đóng Modal an toàn
  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      contactPerson: "",
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSupplier.mutateAsync(formData);
      toast.success("Khởi tạo nhà cung cấp thành công!");
      handleClose();
    } catch (err) {
      // Error đã được handle trong hook qua handleErrorApi
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-xl bg-white rounded-[3rem] p-0 border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 z-[110]">
        {/* HEADER SECTION */}
        <DialogHeader className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              Đăng ký <span className="text-indigo-600">Nhà cung cấp</span>
            </DialogTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-1">
              SUPPLY CHAIN PARTNER
            </p>
          </div>
          <Button
            onClick={handleClose}
            className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100 shadow-sm"
          >
            <XMarkIcon className="h-6 w-6 stroke-[3px]" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-10 space-y-5">
          <div className="space-y-4">
            {/* TÊN NHÀ CUNG CẤP */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <BuildingOfficeIcon className="h-3.5 w-3.5" /> Tên công ty / Đơn
                vị
              </label>
              <Input
                required
                placeholder="Ví dụ: Công ty Thực phẩm sạch ABC"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-8 py-6 text-sm font-bold focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                  <EnvelopeIcon className="h-3.5 w-3.5" /> Email liên hệ
                </label>
                <Input
                  required
                  type="email"
                  placeholder="ncc@gmail.vn"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="rounded-full bg-slate-50 border-slate-100 px-8 py-6 text-sm font-bold shadow-sm"
                />
              </div>

              {/* PHONE */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                  <PhoneIcon className="h-3.5 w-3.5" /> Số điện thoại
                </label>
                <Input
                  required
                  placeholder="09xx xxx xxx"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="rounded-full bg-slate-50 border-slate-100 px-8 py-6 text-sm font-bold shadow-sm"
                />
              </div>
            </div>

            {/* NGƯỜI ĐẠI DIỆN */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <UserIcon className="h-3.5 w-3.5" /> Người đại diện / Pháp nhân
              </label>
              <Input
                required
                placeholder="Họ và tên người liên hệ trực tiếp"
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-8 py-6 text-sm font-bold shadow-sm"
              />
            </div>

            {/* ĐỊA CHỈ */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-5 flex items-center gap-2 italic">
                <MapPinIcon className="h-3.5 w-3.5" /> Địa chỉ trụ sở
              </label>
              <Input
                required
                placeholder="Số nhà, tên đường, quận/huyện..."
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-8 py-6 text-sm font-bold shadow-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={createSupplier.isPending}
            className="w-full rounded-full bg-slate-900 py-7 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-slate-200 mt-4 italic"
          >
            {createSupplier.isPending
              ? "Đang xử lý hồ sơ..."
              : "Xác nhận đối tác cung ứng"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
