/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Package,
  Truck,
  Calendar,
  MapPin,
  CreditCard,
  ChevronLeft,
  Weight,
  BoxSelect,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/app/supply/_components/format";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  order: any;
  onBack: () => void;
}

export default function OrderDetailView({ order, onBack }: Props) {
  const data = order?.data;
  if (!data) return null;

  // Tính toán tổng trọng tải và thể tích thực tế
  const totalWeight = data.items.reduce(
    (acc: number, item: any) =>
      acc + Number(item.product.weightKg || 0) * Number(item.quantityApproved),
    0,
  );

  const totalVolume = data.items.reduce(
    (acc: number, item: any) =>
      acc + Number(item.product.volumeM3 || 0) * Number(item.quantityApproved),
    0,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* 1. TOP NAVIGATION & STATUS */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full hover:bg-slate-100 gap-2 font-black uppercase italic text-[10px] tracking-widest text-slate-400"
        >
          <ChevronLeft className="h-4 w-4 stroke-[3px]" /> Quay lại
        </Button>
        <Badge
          className={cn(
            "rounded-full px-6 py-1.5 font-black uppercase italic tracking-widest text-[10px]",
            data.status === "approved"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-slate-100 text-slate-600",
          )}
        >
          {data.status}
        </Badge>
      </div>

      {/* 2. HEADER INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Điểm đến */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <MapPin className="absolute -top-2 -right-2 h-20 w-20 text-slate-50 group-hover:text-indigo-50 transition-colors" />
          <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-[0.2em] mb-3">
            Cửa hàng nhận
          </p>
          <h3 className="text-xl font-black uppercase italic text-slate-900 leading-tight mb-1">
            {data.store.name}
          </h3>
          <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
            {data.store.address}
          </p>
        </div>

        {/* Logistics & Route */}
        <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl shadow-slate-200 relative overflow-hidden">
          <Truck className="absolute -bottom-4 -right-4 h-24 w-24 text-white/5 -rotate-12" />
          <p className="text-[10px] font-black uppercase italic text-slate-500 tracking-[0.2em] mb-3">
            Thông tin lộ trình
          </p>
          <h3 className="text-sm font-black uppercase italic text-white mb-2 leading-tight">
            {data.store.route.routeName}
          </h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black italic text-primary uppercase">
                Cự ly:
              </span>
              <span className="text-xs font-black italic text-white">
                {data.store.route.distanceKm} KM
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black italic text-primary uppercase">
                Time:
              </span>
              <span className="text-xs font-black italic text-white">
                {data.store.route.estimatedHours}H
              </span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-[0.2em]">
            Tổng thanh toán
          </p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black italic tracking-tighter text-slate-900">
              {Number(data.totalAmount).toLocaleString()}
            </span>
            <span className="text-xs font-black italic text-slate-400 mb-1.5 uppercase">
              VND
            </span>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT LIST TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h4 className="text-xs font-black uppercase italic tracking-widest text-slate-900 flex items-center gap-2">
            <Package className="h-4 w-4" /> Danh mục sản phẩm
          </h4>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Weight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-black italic text-slate-600 uppercase">
                Tải: {totalWeight.toFixed(1)} KG
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BoxSelect className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[10px] font-black italic text-slate-600 uppercase">
                Khối: {totalVolume.toFixed(3)} M³
              </span>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-50">
              <th className="pl-8 py-4 text-[10px] font-black uppercase italic tracking-widest text-slate-400">
                Sản phẩm
              </th>
              <th className="py-4 text-[10px] font-black uppercase italic tracking-widest text-slate-400 text-center">
                Đơn vị
              </th>
              <th className="py-4 text-[10px] font-black uppercase italic tracking-widest text-slate-400 text-center">
                Số lượng
              </th>
              <th className="pr-8 py-4 text-[10px] font-black uppercase italic tracking-widest text-slate-400 text-right">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item: any) => (
              <tr
                key={item.id}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="pl-8 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-12 w-12 rounded-2xl object-cover shadow-md group-hover:scale-110 transition-transform"
                    />
                    <div>
                      <p className="font-black italic text-slate-900 uppercase text-sm leading-tight">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                        SKU: {item.product.sku}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-center font-black italic text-slate-600 text-sm uppercase">
                  {item.unitSnapshot}
                </td>
                <td className="text-center">
                  <span className="bg-slate-900 text-white px-3 py-1 rounded-full font-black italic text-xs">
                    {item.quantityApproved}
                  </span>
                </td>
                <td className="pr-8 text-right">
                  <p className="font-black italic text-slate-900 text-sm">
                    {(
                      Number(item.priceSnapshot) * Number(item.quantityApproved)
                    ).toLocaleString()}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    ĐG: {Number(item.priceSnapshot).toLocaleString()}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. FOOTER LOGS */}
      <div className="flex flex-col md:flex-row justify-between gap-6 px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-[10px] font-black italic text-slate-500 uppercase">
              Ngày tạo: {formatDateTime(data.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-slate-400" />
            <span className="text-[10px] font-black italic text-slate-500 uppercase">
              Thanh toán: {data.priority.toUpperCase()}
            </span>
          </div>
        </div>
        <p className="text-[10px] font-black italic text-slate-300 uppercase">
          Order ID: {data.id}
        </p>
      </div>
    </div>
  );
}
