"use client";

import { useState, useEffect } from "react";
import { useSupplier } from "@/hooks/useSupplier";
import { toast } from "sonner";
import {
  XMarkIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// UI Components chuẩn
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

interface SupplierEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: any; // Dữ liệu nhà cung cấp từ bảng
}

export default function SupplierEditModal({
  isOpen,
  onClose,
  supplier,
}: SupplierEditModalProps) {
  const { updateSupplier } = useSupplier();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contactPerson: "",
    status: "ACTIVE",
  });

  // 1. Đồng bộ dữ liệu khi mở Modal (Sửa lỗi cascading bằng cách sync trực tiếp)
  useEffect(() => {
    if (isOpen && supplier) {
      setFormData({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        contactPerson: supplier.contactPerson || "",
        status: supplier.isActive ? "ACTIVE" : "INACTIVE",
      });
    }
  }, [isOpen, supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitPayload = {
      ...formData,
      isActive: formData.status === "ACTIVE",
    };

    try {
      await updateSupplier.mutateAsync({
        id: supplier.id,
        data: submitPayload as any,
      });

      toast.success("Cập nhật thông tin đối tác thành công!");
      onClose();
    } catch {
      // Error handled in hook
    }
  };

  if (!isOpen || !supplier) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-white rounded-[3rem] p-0 border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 z-[110]">
        {/* HEADER SECTION */}
        <DialogHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 text-left">
          <div className="space-y-0.5">
            <DialogTitle className="text-xl font-black font-display tracking-wider uppercase text-text-main leading-none">
              Cập nhật <span className="text-primary">Đối tác</span>
            </DialogTitle>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic truncate max-w-[200px]">
              ID: {supplier.id}
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
            {/* TÊN CÔNG TY */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <BuildingOfficeIcon className="h-3 w-3" /> Tên đơn vị cung ứng
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-6 py-5 text-sm font-bold shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* SỐ ĐIỆN THOẠI */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                  <PhoneIcon className="h-3 w-3" /> Số điện thoại
                </label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="rounded-full bg-slate-50 border-slate-100 px-6 py-5 text-sm font-bold shadow-sm"
                />
              </div>

              {/* TRẠNG THÁI HỢP TÁC */}
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
                      Đang cung ứng
                    </SelectItem>
                    <SelectItem value="INACTIVE" className="py-3 text-red-600">
                      Ngừng hợp tác
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <EnvelopeIcon className="h-3 w-3" /> Email liên hệ
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-6 py-5 text-sm font-bold shadow-sm"
              />
            </div>

            {/* NGƯỜI ĐẠI DIỆN */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <UserIcon className="h-3 w-3" /> Pháp nhân đại diện
              </label>
              <Input
                required
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-6 py-5 text-sm font-bold shadow-sm"
              />
            </div>

            {/* ĐỊA CHỈ */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-4 flex items-center gap-2 italic">
                <MapPinIcon className="h-3 w-3" /> Trụ sở chính
              </label>
              <Input
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="rounded-full bg-slate-50 border-slate-100 px-6 py-5 text-sm font-bold shadow-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={updateSupplier.isPending}
            className="w-full rounded-full bg-primary py-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary-dark transition-all active:scale-95 disabled:bg-slate-200 mt-2 italic"
          >
            {updateSupplier.isPending
              ? "Hệ thống đang lưu..."
              : "LƯU THÔNG TIN ĐỐI TÁC"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
