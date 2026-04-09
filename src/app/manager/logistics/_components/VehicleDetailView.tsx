/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Truck, Fuel, Weight, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  vehicle: any;
}

export default function VehicleDetailView({ vehicle }: Props) {
  const data = vehicle?.data;
  if (!data) return null;

  // Logic màu sắc trạng thái chuẩn VFC
  const statusConfig =
    data.status === "available"
      ? {
          bg: "bg-emerald-500",
          text: "text-emerald-500",
          label: "Sẵn sàng vận hành",
        }
      : { bg: "bg-amber-500", text: "text-amber-500", label: "Đang bảo trì" };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Card chính: Biển số & Trạng thái */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <Truck className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 -rotate-12" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={cn(
                "h-3 w-3 rounded-full animate-pulse",
                statusConfig.bg,
              )}
            />
            <p
              className={cn(
                "text-[10px] font-black uppercase italic tracking-[0.3em]",
                statusConfig.text,
              )}
            >
              {statusConfig.label}
            </p>
          </div>

          <h2 className="text-4xl font-black uppercase italic text-white leading-tight tracking-tighter">
            {data.licensePlate}
          </h2>

          <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase italic tracking-widest">
            VFC Fleet Management • ID: #{data.id}
          </p>
        </div>
      </div>

      {/* 2. Grid Thông số Vận hành */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tải trọng */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Weight className="h-7 w-7 stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-wider">
              Tải trọng tối đa
            </p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black italic text-slate-900">
                {Math.floor(data.payloadCapacity)}
              </span>
              <span className="text-[10px] font-black italic text-slate-400 mb-1">
                KG
              </span>
            </div>
          </div>
        </div>

        {/* Định mức nhiên liệu */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Fuel className="h-7 w-7 stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-wider">
              Định mức nhiên liệu
            </p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black italic text-slate-900">
                {parseFloat(data.fuelRatePerKm)}
              </span>
              <span className="text-[10px] font-black italic text-slate-400 mb-1">
                L/KM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Phân tích hiệu suất (Logic cộng thêm) */}
      <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-slate-900" />
          <h4 className="text-[10px] font-black uppercase italic text-slate-900 tracking-widest">
            Chỉ số vận hành dự kiến
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">
              Khả năng cung ứng
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1 italic">
              ~ {Math.floor(data.payloadCapacity / 20)} thùng hàng tiêu chuẩn
              (20kg)
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase">
              Chi phí nhiên liệu/100km
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1 italic">
              ~ {(parseFloat(data.fuelRatePerKm) * 100).toFixed(1)} Lít dầu
            </p>
          </div>
        </div>
      </div>

      {/* 4. Footer Validation */}
      <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-50">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <p className="text-[10px] font-bold uppercase italic text-slate-300 tracking-[0.1em]">
          Dữ liệu xe tải được đồng bộ thời gian thực từ Fleet API
        </p>
      </div>
    </div>
  );
}
