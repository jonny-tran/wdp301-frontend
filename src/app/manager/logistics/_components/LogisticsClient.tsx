/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useLogistics } from "@/hooks/useLogistics";
import { Truck, Map, Plus, Globe2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import VehicleTable from "./VehicleTable";
import RouteTable from "./RouteTable";
import LogisticsModal from "./LogisticsModal";
// Import các Detail View đã viết
import VehicleDetailView from "./VehicleDetailView";
import RouteDetailView from "./RouteDetailView";
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

  // State quản lý xem chi tiết
  const [viewingItem, setViewingItem] = useState<any>(null);

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
    useDeleteRoute, 
  } = useLogistics();

  const { data: vehicles, isLoading: loadingVehicles } = useGetVehicles();
  const { data: routes, isLoading: loadingRoutes } = useGetRoutes();

  // --- HANDLERS ---
  const handleEdit = (item: any) => {
    setEditingData(item);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      if (activeTab === "vehicles") {
        useDeleteVehicle.mutate(deleteTarget.id);
      } else {
        useDeleteRoute.mutate(deleteTarget.id);
      }
      setDeleteTarget(null);
    }
  };

  const handleFormSubmit = (data: any) => {
    // Thêm logic cập nhật nếu có editingData
    const action = activeTab === "vehicles" ? useCreateVehicle : useCreateRoute;
    action.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  // --- LOGIC HIỂN THỊ CHI TIẾT ---
  if (viewingItem) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <Button
          variant="ghost"
          onClick={() => setViewingItem(null)}
          className="rounded-full hover:bg-slate-100 gap-2 font-black uppercase italic text-[10px] tracking-widest text-slate-400"
        >
          <ChevronLeft className="h-4 w-4 stroke-[3px]" /> Quay lại danh sách
        </Button>

        {activeTab === "vehicles" ? (
          <VehicleDetailView vehicle={{ data: viewingItem }} />
        ) : (
          <RouteDetailView route={{ data: viewingItem }} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
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
                ? `${vehicles?.length || 0} Phương tiện vận tải`
                : `${routes?.length || 0} Tuyến đường Logistics`}
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

      {/* TABS SELECTOR */}
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

      {/* TABLES AREA */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[450px]">
        {activeTab === "vehicles" ? (
          <VehicleTable
            data={vehicles || []}
            isLoading={loadingVehicles}
            onEdit={handleEdit}
            onDelete={(v) =>
              setDeleteTarget({ id: v.id, name: v.licensePlate })
            }
            onViewDetail={(v) => setViewingItem(v)} // Cập nhật state xem chi tiết
          />
        ) : (
          <RouteTable
            data={routes || []}
            isLoading={loadingRoutes}
            onEdit={handleEdit}
            onDelete={(r) => setDeleteTarget({ id: r.id, name: r.routeName })}
            onViewDetail={(r) => setViewingItem(r)} // Cập nhật state xem chi tiết
          />
        )}
      </div>

      {/* MODAL & ALERT DIALOG GIỮ NGUYÊN */}
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

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-[2.5rem] border-none p-10 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black uppercase italic text-slate-900">
              Xác nhận xóa
            </AlertDialogTitle>
            <AlertDialogDescription className="font-bold italic text-slate-400">
              Bạn có chắc chắn muốn gỡ bỏ &quot;{deleteTarget?.name}&quot; khỏi
              hệ thống vận hành? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="rounded-full font-black uppercase italic text-[10px] tracking-widest">
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-full bg-red-600 hover:bg-red-700 font-black uppercase italic text-[10px] tracking-widest"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
