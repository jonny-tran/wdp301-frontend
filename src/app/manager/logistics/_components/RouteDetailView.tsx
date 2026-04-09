/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapPin, Navigation, Clock, Banknote, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  route: any;
}

export default function RouteDetailView({ route }: Props) {
  const data = route?.data;
  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Tuyến đường chính */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <Navigation className="absolute -bottom-6 -right-6 h-32 w-32 text-white/5 -rotate-12" />

        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase italic text-primary tracking-[0.3em] mb-4">
            Chi tiết lộ trình vận hành
          </p>
          <h2 className="text-3xl font-black uppercase italic text-white leading-tight tracking-tighter">
            {data.routeName}
          </h2>
          <div className="flex items-center gap-2 mt-4 text-slate-400">
            <MapPin className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-bold uppercase italic tracking-widest">
              VFC Logistics Network Core
            </span>
          </div>
        </div>
      </div>

      {/* 2. Grid thông số kỹ thuật */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cự ly */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Navigation className="h-7 w-7 stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-wider">
              Cự ly vận chuyển
            </p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black italic text-slate-900">
                {parseFloat(data.distanceKm)}
              </span>
              <span className="text-[10px] font-black italic text-slate-400 mb-1">
                KM
              </span>
            </div>
          </div>
        </div>

        {/* Thời gian */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="h-7 w-7 stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-wider">
              Thời gian dự kiến
            </p>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black italic text-slate-900">
                {parseFloat(data.estimatedHours)}
              </span>
              <span className="text-[10px] font-black italic text-slate-400 mb-1">
                GIỜ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Khối Tài chính (Lì nhất) */}
      <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-900 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-white">
            <Banknote className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-[0.2em]">
              Định mức chi phí cơ sở
            </p>
            <p className="text-xs font-bold text-slate-500 italic">
              Áp dụng cho mọi loại xe tải tiêu chuẩn
            </p>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-4xl font-black italic tracking-tighter text-slate-900">
            {Number(data.baseTransportCost).toLocaleString()}
          </span>
          <span className="text-xs font-black italic text-slate-400 mb-2 uppercase">
            VND
          </span>
        </div>
      </div>

      {/* 4. Footer Verification */}
      <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-50">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <p className="text-[10px] font-bold uppercase italic text-slate-300 tracking-[0.1em]">
          Dữ liệu đã được xác thực bởi hệ thống Logistics VFC
        </p>
      </div>
    </div>
  );
}
