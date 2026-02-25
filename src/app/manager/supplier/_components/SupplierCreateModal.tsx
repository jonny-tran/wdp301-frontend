"use client";

import { useState } from "react";
import { XMarkIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useSupplier } from "@/hooks/useSupplier";
import { toast } from "sonner";

export default function SupplierCreateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createSupplier } = useSupplier();
  const [formData, setFormData] = useState({
    name: "", contactName: "", phone: "", address: "", isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSupplier.mutateAsync(formData);
      toast.success("Thêm đối tác thành công!");
      onClose();
    } catch (error) { console.error(error); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 p-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Tên công ty / Đối tác</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Người đại diện</label>
                <input required value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Số điện thoại</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:border-blue-500" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-4">Địa chỉ văn phòng</label>
                <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full rounded-full border border-slate-100 bg-slate-50/50 px-6 py-4 text-xs font-bold outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
          <div className="md:col-span-4 bg-slate-50/50 p-10 flex flex-col justify-between border-l border-slate-100">
            <div className="text-center relative">
               <button onClick={onClose} className="absolute -top-6 -right-6 p-2 text-slate-400"><XMarkIcon className="h-5 w-5"/></button>
               <PlusIcon className="h-10 w-10 mx-auto text-slate-900 mb-4" />
               <h3 className="text-xl font-black uppercase italic italic leading-tight">Đối tác <br/> Mới</h3>
            </div>
            <div className="space-y-3">
              <button onClick={handleSubmit} disabled={createSupplier.isPending} className="w-full py-4 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Lưu hệ thống</button>
              <button onClick={onClose} className="w-full text-[9px] font-black text-red-500 uppercase tracking-widest">Hủy thao tác</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}