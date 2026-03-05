/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useBaseUnit } from "@/hooks/useBaseUnit";
import { extractBaseUnits } from "./base-unit.mapper";
import BaseUnitTable from "./BaseUnitTable";
import {
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import BaseUnitFormModal from "./BaseUnitFormModal";

export default function BaseUnitClient() {
  const { baseUnitList, deleteBaseUnit, createBaseUnit, updateBaseUnit } =
    useBaseUnit();
  const { data: response, isLoading, refetch } = baseUnitList();

  const [searchTerm, setSearchTerm] = useState("");
  // Quản lý trạng thái Modal (Add/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);

  const allActiveUnits = extractBaseUnits(response);
  const filteredData = allActiveUnits.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenAdd = () => {
    setEditingUnit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: number) => {
    const unit = allActiveUnits.find((u) => u.id === id);
    setEditingUnit(unit);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER: Title & Button Trigger POST */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Đơn vị <span className="text-indigo-600">Đo lường</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-3 italic"></p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="rounded-full bg-slate-900 px-10 py-5 text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 hover:scale-105 transition-all shadow-xl group"
        >
          <PlusIcon className="w-5 h-5 stroke-[3px] group-hover:rotate-90 transition-transform" />
          Thêm đơn vị mới
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative mx-4">
        {/* FILTER BAR */}
        <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 stroke-[2.5px]" />
            <input
              type="text"
              placeholder="Tìm tên đơn vị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-14 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 ring-indigo-500/10 transition-all shadow-sm"
            />
          </div>
          <Button
            onClick={() => refetch()}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm"
          >
            <ArrowPathIcon
              className={clsx(
                "w-5 h-5 text-slate-500 stroke-[2.5px]",
                isLoading && "animate-spin",
              )}
            />
          </Button>
        </div>

        {/* TABLE: Truyền sự kiện Edit */}
        {isLoading ? (
          <div className="py-40 text-center font-black text-slate-200 italic uppercase text-[10px] tracking-[0.4em] animate-pulse">
            Đang tải dữ liệu đơn vị...
          </div>
        ) : (
          <BaseUnitTable
            data={filteredData}
            onEdit={handleOpenEdit}
            onDelete={(id) => deleteBaseUnit.mutate(id)}
          />
        )}

        <div className="bg-slate-50/50 px-10 py-6 border-t border-slate-50 flex justify-between items-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
            Hiển thị {filteredData.length} đơn vị hoạt động
          </p>
        </div>
      </div>

      {/* MODAL: Xử lý cả POST và PATCH */}
      {isModalOpen && (
        <BaseUnitFormModal
          isOpen={isModalOpen}
          unit={editingUnit}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data) => {
            if (editingUnit) {
              updateBaseUnit.mutate({ id: editingUnit.id, data });
            } else {
              createBaseUnit.mutate(data);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
