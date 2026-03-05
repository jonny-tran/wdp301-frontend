"use client";

import { useClaim } from "@/hooks/useClaim";
import { extractClaimDetail } from "./claims.mapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CalendarIcon,
  InboxIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Image from "next/image";

interface Props {
  claimId: string;
  onBack: () => void;
}

// 1. Định nghĩa Interface cho Item để fix lỗi Implicit any
interface ClaimDetailItem {
  name: string;
  sku: string;
  damaged: number;
  missing: number;
  reason: string;
  image?: string;
}

export default function ClaimDetailView({ claimId, onBack }: Props) {
  const { claimDetail } = useClaim();
  const { data: response, isLoading } = claimDetail(claimId);

  const detail = extractClaimDetail(response);

  if (isLoading)
    return (
      <div className="p-40 text-center animate-pulse font-black italic text-slate-300 uppercase text-[10px] tracking-[0.4em]">
        Đang tải chi tiết khiếu nại...
      </div>
    );

  if (!detail) return null;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* HEADER & NAVIGATION */}
      <div className="flex justify-between items-center px-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full hover:bg-slate-100 px-6 py-6 group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest italic">
            Quay lại danh sách
          </span>
        </Button>
        <div className="text-right">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Chi tiết <span className="text-indigo-600">Khiếu nại</span>
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">
            Mã ID: {detail.id}
          </p>
        </div>
      </div>

      {/* SUMMARY INFORMATION CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <InboxIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 italic">
              Thông tin vận đơn
            </span>
          </div>
          <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">
            Shipment: {detail.shipmentId}
          </p>
          <Badge className="bg-emerald-100 text-emerald-600 border-none px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
            {detail.status}
          </Badge>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg text-slate-300">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase opacity-50 italic">
              Thời gian ghi nhận
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold opacity-40 uppercase">
              Ngày tạo: {format(new Date(detail.createdAt), "dd/MM/yyyy HH:mm")}
            </p>
            {detail.resolvedAt && (
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter italic">
                Đã xử lý:{" "}
                {format(new Date(detail.resolvedAt), "dd/MM/yyyy HH:mm")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ITEMS LIST & PROOFS */}
      <div className="px-4 space-y-6">
        <h3 className="text-[10px] font-black uppercase italic text-slate-400 tracking-[0.2em] ml-6">
          Danh sách sản phẩm khiếu nại
        </h3>
        {detail.items.map((item: ClaimDetailItem, idx: number) => (
          <div
            key={idx}
            className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row"
          >
            {/* 2. Hình ảnh bằng chứng (Sử dụng Next.js Image chuẩn) */}
            <div className="w-full md:w-1/3 bg-slate-50 relative min-h-300px">
              {item.image ? (
                <div className="w-full h-full p-4">
                  <Image
                    src={item.image}
                    alt={`Proof of ${item.name}`}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-[3.5rem] shadow-inner"
                    unoptimized // Nếu URL từ Cloudinary/External chưa config domain
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200">
                  <PhotoIcon className="w-12 h-12 mb-2" />
                  <span className="text-[9px] font-black uppercase italic">
                    Không có ảnh bằng chứng
                  </span>
                </div>
              )}
            </div>

            {/* Nội dung chi tiết */}
            <div className="flex-1 p-12 space-y-6">
              <div>
                <h4 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">
                  {item.name}
                </h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  SKU: {item.sku}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                  <p className="text-[8px] font-black text-red-400 uppercase italic">
                    Hàng hỏng
                  </p>
                  <p className="text-2xl font-black text-red-600 italic leading-none mt-1">
                    {item.damaged}
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <p className="text-[8px] font-black text-amber-500 uppercase italic">
                    Hàng thiếu
                  </p>
                  <p className="text-2xl font-black text-amber-600 italic leading-none mt-1">
                    {item.missing}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <p className="text-[9px] font-black text-slate-300 uppercase italic mb-2">
                  Lý do khiếu nại:
                </p>
                {/* 3. Thoát ký tự ngoặc kép (Escaping characters) */}
                <p className="text-sm font-bold text-slate-600 italic leading-relaxed">
                  &quot;{item.reason}&quot;
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
