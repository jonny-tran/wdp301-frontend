"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/hooks/useStore";
import { toast } from "sonner";

export default function StoreModal({ isOpen, onClose, editingStore }: any) {
  const { createStore, updateStore } = useStore();

  // Khởi tạo state với giá trị mặc định phòng thủ
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    managerName: "",
  });

  // Đổ dữ liệu vào form khi chế độ Edit được kích hoạt
  useEffect(() => {
    if (editingStore) {
      setFormData({
        name: editingStore.name || "",
        address: editingStore.address || "",
        phone: editingStore.phone || "",
        managerName:
          editingStore.managerName === "Chưa bổ nhiệm"
            ? ""
            : editingStore.managerName,
      });
    } else {
      setFormData({ name: "", address: "", phone: "", managerName: "" });
    }
  }, [editingStore, isOpen]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast.error("Vui lòng nhập tên và số điện thoại!");
      return;
    }

    try {
      if (editingStore) {
        // Gọi PATCH /wdp301-api/v1/stores/{id}
        await updateStore.mutateAsync({
          id: editingStore.id,
          data: formData,
        });
        toast.success("Cập nhật cửa hàng thành công!");
      } else {
        // Gọi POST /wdp301-api/v1/stores
        await createStore.mutateAsync(formData);
        toast.success("Thêm cửa hàng mới thành công!");
      }
      onClose();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[2.5rem] p-10 bg-white border-none shadow-2xl outline-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic text-black tracking-tighter">
            {editingStore ? "Chỉnh sửa Store" : "Thêm Store mới"}
          </DialogTitle>
          <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest italic">
            {editingStore
              ? `ID: ${editingStore.id}`
              : "Nhập thông tin hệ thống"}
          </p>
        </DialogHeader>

        <div className="mt-8 space-y-5">
          {/* Tên Store */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em] ml-2">
              Tên chi nhánh
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-black focus:border-black focus:bg-white transition-all outline-none"
              placeholder="VD: KFC Quận 1..."
            />
          </div>

          {/* Quản lý */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em] ml-2">
              Người quản lý
            </label>
            <input
              value={formData.managerName}
              onChange={(e) =>
                setFormData({ ...formData, managerName: e.target.value })
              }
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-black focus:border-black focus:bg-white transition-all outline-none"
              placeholder="Họ và tên..."
            />
          </div>

          {/* Phone & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em] ml-2">
                Hotline
              </label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-black focus:border-black focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em] ml-2">
                Địa chỉ
              </label>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-black focus:border-black focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={createStore.isPending || updateStore.isPending}
            className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:bg-slate-200"
          >
            {createStore.isPending || updateStore.isPending
              ? "Đang xử lý..."
              : editingStore
                ? "Cập nhật ngay"
                : "Xác nhận tạo"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
