"use client";

import { useState, useMemo } from "react";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { BaseUnit } from "@/types/base-unit";
import BaseUnitTable from "./BaseUnitTable";
import BaseUnitCreateModal from "./BaseUnitCreateModal";
import BaseUnitEditModal from "./BaseUnitEditModal";
import { toast } from "sonner";

export default function BaseUnitClient() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<BaseUnit | null>(null);

  const { baseUnitList, deleteBaseUnit } = useBaseUnit(); // Gọi GET và DELETE endpoints
  const { data: rawData, isLoading, isError } = baseUnitList();

  const items: BaseUnit[] = useMemo(() => (rawData as any)?.items || rawData || [], [rawData]);

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Xóa đơn vị này có thể ảnh hưởng đến sản phẩm liên quan. Tiếp tục?",
      )
    ) {
      try {
        await deleteBaseUnit.mutateAsync(id); // Gọi DELETE /base-units/:id
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Base Units
          </h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
            Manager Portal • Measurement Settings
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-3 rounded-full bg-slate-900 px-10 py-5 text-xs font-black text-white hover:bg-black shadow-2xl active:scale-95"
        >
          + TẠO ĐƠN VỊ MỚI
        </button>
      </div>

      <div className="rounded-[3rem] border border-slate-100 bg-white shadow-2xl overflow-hidden">
        <BaseUnitTable
          items={items}
          isLoading={isLoading}
          isError={isError}
          onEdit={setEditingUnit}
          onDelete={handleDelete}
        />
      </div>

      <BaseUnitCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {editingUnit && (
        <BaseUnitEditModal
          isOpen={!!editingUnit}
          onClose={() => setEditingUnit(null)}
          data={editingUnit}
        />
      )}
    </div>
  );
}
