"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { BaseUnit } from "@/types/base-unit";
import { Plus, RotateCw, Search } from "lucide-react";
import { useState } from "react";
import BaseUnitFormModal from "./BaseUnitFormModal";
import BaseUnitTable from "./BaseUnitTable";

export default function BaseUnitClient() {
  const { useBaseUnitList, deleteBaseUnit, createBaseUnit, updateBaseUnit } =
    useBaseUnit();
  const { data: response, isLoading, refetch } = useBaseUnitList();

  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<BaseUnit | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<BaseUnit | null>(null);

  // Unwrap data — backend returns items array directly for base-units
  const rawData = response?.data || response;
  const allUnits: BaseUnit[] = Array.isArray(rawData) ? rawData : (rawData as { items?: BaseUnit[] })?.items || [];

  // Client-side search (base-units API has no pagination/search param)
  const filteredData = allUnits.filter(
    (unit) =>
      unit.isActive &&
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenAdd = () => {
    setEditingUnit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit: BaseUnit) => {
    setEditingUnit(unit);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteBaseUnit.mutate(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Đơn vị đo lường
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý các đơn vị tính sử dụng trong hệ thống
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Thêm đơn vị
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm tên đơn vị..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-400/50"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
          className="shrink-0"
        >
          <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <BaseUnitTable
          data={filteredData}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={(unit) => setDeleteTarget(unit)}
        />

        {/* Footer */}
        {!isLoading && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Hiển thị{" "}
              <span className="font-semibold text-slate-700">
                {filteredData.length}
              </span>{" "}
              đơn vị hoạt động
            </p>
          </div>
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      <BaseUnitFormModal
        isOpen={isModalOpen}
        unit={editingUnit}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => {
          if (editingUnit) {
            updateBaseUnit.mutate(
              { id: editingUnit.id, data },
              { onSuccess: () => setIsModalOpen(false) },
            );
          } else {
            createBaseUnit.mutate(data, {
              onSuccess: () => setIsModalOpen(false),
            });
          }
        }}
        isSubmitting={createBaseUnit.isPending || updateBaseUnit.isPending}
      />

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đơn vị</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn vị &quot;{deleteTarget?.name}&quot;?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
