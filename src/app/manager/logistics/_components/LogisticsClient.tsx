/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useLogistics } from "@/hooks/useLogistics";
import { Truck, Map, Plus, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VehicleTable from "./VehicleTable";
import RouteTable from "./RouteTable";
import LogisticsModal from "./LogisticsModal";
import { Vehicle, Route } from "@/types/logistics";
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

export default function LogisticsClient() {
  const [activeTab, setActiveTab] = useState<"vehicles" | "routes">("vehicles");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Vehicle | Route | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    useGetVehicles,
    useGetRoutes,
    useCreateVehicle,
    useCreateRoute,
    useDeleteVehicle,
  } = useLogistics();

  const { data: vehicles, isLoading: loadingVehicles } = useGetVehicles();
  const { data: routes, isLoading: loadingRoutes } = useGetRoutes();

  // --- HANDLERS CHO TABLE ---
  const handleEdit = (item: any) => {
    setEditingData(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setDeleteTarget({
      id: item.id,
      name: item.licensePlate || item.routeName,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      // Hiện tại mới có useDeleteVehicle trong hook, bạn có thể bổ sung useDeleteRoute sau
      if (activeTab === "vehicles") {
        useDeleteVehicle.mutate(deleteTarget.id);
      }
      setDeleteTarget(null);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (activeTab === "vehicles") {
      useCreateVehicle.mutate(data, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      useCreateRoute.mutate(data, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200 rotate-3 transition-transform hover:rotate-0">
            <Globe2 className="h-7 w-7 text-white stroke-[2.5px]" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-wider text-slate-900 leading-none">
              Vận hành <span className="text-primary">Hậu Cần</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5 italic">
              {activeTab === "vehicles"
                ? `${vehicles?.length || 0} Phương tiện trong đội xe`
                : `${routes?.length || 0} Tuyến đường đang khai thác`}
            </p>
          </div>
        </div>

        <Button
          onClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          className="rounded-full bg-slate-900 h-12 px-8 hover:bg-black shadow-xl shadow-slate-200 active:scale-95 transition-all gap-2"
        >
          <Plus className="h-4 w-4 stroke-[3px]" />
          <span className="text-[11px] font-black uppercase italic tracking-widest text-white">
            {activeTab === "vehicles" ? "Khai báo xe" : "Thêm tuyến đường"}
          </span>
        </Button>
      </div>

      {/* TABS */}
      <div className="flex bg-slate-100/80 p-1.5 rounded-[2rem] w-fit border border-slate-200">
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-[10px] font-black uppercase italic tracking-widest transition-all ${
            activeTab === "vehicles"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Truck className="h-4 w-4" /> Đội xe
        </button>
        <button
          onClick={() => setActiveTab("routes")}
          className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-[10px] font-black uppercase italic tracking-widest transition-all ${
            activeTab === "routes"
              ? "bg-white text-slate-900 shadow-md"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Map className="h-4 w-4" /> Tuyến đường
        </button>
      </div>

      {/* MAIN TABLE AREA */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[450px]">
        {activeTab === "vehicles" ? (
          <VehicleTable
            data={vehicles || []}
            isLoading={loadingVehicles}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onViewDetail={(v) => console.log("View vehicle", v)}
          />
        ) : (
          <RouteTable
            data={routes || []}
            isLoading={loadingRoutes}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onViewDetail={(r) => console.log("View route", r)}
          />
        )}
      </div>

      {/* MODAL */}
      <LogisticsModal
        isOpen={isModalOpen}
        type={activeTab}
        editingData={editingData}
        onClose={() => {
          setIsModalOpen(false);
          setEditingData(null);
        }}
        onSubmit={handleFormSubmit}
        isPending={useCreateVehicle.isPending || useCreateRoute.isPending}
      />

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-[2rem] border-none p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black uppercase italic">
              Xác nhận gỡ bỏ
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-slate-500">
              Bạn có chắc chắn muốn xóa &quot;{deleteTarget?.name}&quot; khỏi hệ
              thống vận hành?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-full font-black uppercase italic text-[10px]">
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-full bg-red-600 hover:bg-red-700 font-black uppercase italic text-[10px]"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
