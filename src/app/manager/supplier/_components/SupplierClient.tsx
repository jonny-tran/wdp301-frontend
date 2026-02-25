"use client";

import { useState, useMemo } from "react";
import { useSupplier } from "@/hooks/useSupplier";
import { extractSupplierItems } from "./supplier.mapper";
import SupplierTable from "./SupplierTable";
import SupplierCreateModal from "./SupplierCreateModal";
import SupplierEditModal from "./SupplierEditModal"; // Import component mới
import { toast } from "sonner";

export default function SupplierClient() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null); // Quản lý đối tác đang được sửa

  const { supplierList, deleteSupplier } = useSupplier();
  const { data: rawData, isLoading, isError } = supplierList();

  // Mapping dữ liệu an toàn
  const items = useMemo(() => extractSupplierItems(rawData), [rawData]);

  const handleDelete = async (id: number) => {
    if (confirm("Xác nhận xóa nhà cung cấp này?")) {
      try {
        await deleteSupplier.mutateAsync(id);
        toast.success("Đã xóa nhà cung cấp thành công!");
      } catch (e) {
        console.error("Lỗi xóa:", e);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header tinh giản */}
      <div className="flex justify-between items-end px-1">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">
            Suppliers
          </h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {isLoading
              ? "Đang tải dữ liệu..."
              : `${items.length} Đối tác hiện có`}
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-6 py-3 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          + Add Supplier
        </button>
      </div>

      {/* Container chứa Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isError ? (
          <div className="p-10 text-center text-red-500 font-bold text-xs uppercase italic">
            Lỗi kết nối API
          </div>
        ) : items.length === 0 && !isLoading ? (
          <div className="p-16 text-center text-slate-300 italic text-xs uppercase tracking-widest">
            Không có dữ liệu đối tác
          </div>
        ) : (
          <SupplierTable
            items={items}
            isLoading={isLoading}
            onEdit={(item) => setEditingSupplier(item)} // Mở modal edit
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Modals */}
      <SupplierCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <SupplierEditModal
        isOpen={!!editingSupplier}
        onClose={() => setEditingSupplier(null)}
        data={editingSupplier}
      />
    </div>
  );
}
