/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  HashtagIcon,
  ScaleIcon,
  ShieldCheckIcon,
  ClockIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
// Giả định BatchStatus được export từ file types của Hàn
import { BatchStatus } from "@/utils/enum";

interface ProductDetailViewProps {
  product: any;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();

  // 1. Logic quay lại thông minh: Giữ trạng thái filter nếu đi từ danh sách
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/manager/products");
    }
  };

  // 2. Helper đổ màu theo Enum BatchStatus
  const getStatusStyles = (status: string) => {
    switch (status) {
      case BatchStatus.AVAILABLE:
        return "bg-green-50 text-green-600 border-green-100";
      case BatchStatus.PENDING:
        return "bg-amber-50 text-amber-600 border-amber-100";
      case BatchStatus.EMPTY:
        return "bg-slate-50 text-slate-400 border-slate-100 opacity-60";
      case BatchStatus.EXPIRED:
        return "bg-red-50 text-red-600 border-red-200 animate-pulse font-black";
      default:
        return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-500">
      {/* HEADER: Gọn gàng & Chuyên nghiệp */}
      <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="h-10 w-10 rounded-xl bg-white shadow-md hover:bg-primary-dark hover:text-white transition-all border border-slate-100 p-0 group"
        >
          <ArrowLeftIcon className="h-5 w-5 stroke-[2.5px] group-hover:-translate-x-1 transition-transform" />
        </Button>
        <div>
          <h1 className="text-2xl font-black uppercase italic text-black tracking-tighter leading-none">
            Thông tin <span className="text-primary italic">Sản phẩm</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
            SKU: {product.sku} • ID Hệ thống: #{product.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI: Profile sản phẩm */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative aspect-square w-full max-w-[260px] mx-auto rounded-[2rem] overflow-hidden shadow-lg border-4 border-white ring-1 ring-slate-100">
            <Image
              src={
                product.imageUrl ||
                "https://res.cloudinary.com/dmhjgnymn/image/upload/v1770135560/OIP_j6j4gz.webp"
              }
              alt={product.name}
              fill
              sizes="260px"
              className="object-cover"
              priority
            />
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-md border border-slate-50 space-y-6">
            <h2 className="text-xl font-black text-text-main font-display tracking-wider uppercase leading-tight">
              {product.name}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-primary/10 transition-colors">
                <ScaleIcon className="h-4 w-4 text-primary mb-2" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Đơn vị
                </p>
                <p className="text-xs font-black text-black uppercase italic">
                  {product.baseUnitName || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-green-50 transition-colors">
                <ShieldCheckIcon className="h-4 w-4 text-green-500 mb-2" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Bảo quản
                </p>
                <p className="text-xs font-black text-black uppercase italic">
                  {product.shelfLifeDays} Ngày
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Danh sách Lô hàng (Batches) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary rounded-lg shadow-lg -rotate-3">
                <CalendarDaysIcon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-sm font-black text-black uppercase tracking-widest italic">
                Lịch sử{" "}
                <span className="text-slate-400 italic font-black">
                  Nhập kho
                </span>
              </h3>
            </div>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
              {product.batches?.length || 0} Lô hàng
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.batches?.map((batch: any) => (
              <div
                key={batch.id}
                className="bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-180px group relative overflow-hidden"
              >
                <div className="flex justify-between items-start z-10">
                  {/* FIX: Ảnh lô hàng dùng fill + parent relative */}
                  <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                    {batch.imageUrl ? (
                      <Image
                        src={batch.imageUrl}
                        alt="Batch"
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <HashtagIcon className="h-5 w-5 text-slate-200 stroke-[2.5px]" />
                    )}
                  </div>
                  <span
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm transition-all",
                      getStatusStyles(batch.status),
                    )}
                  >
                    ● {batch.status}
                  </span>
                </div>

                <div className="mt-4 z-10">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] italic">
                    Mã định danh lô
                  </p>
                  <p className="text-xs font-black text-black truncate uppercase tracking-tight italic group-hover:text-primary transition-colors">
                    {batch.batchCode}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-slate-100 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-[8px] font-bold text-slate-400 uppercase">
                      Hết hạn:
                    </span>
                    <span className="text-[10px] font-black text-red-600 italic">
                      {new Date(batch.expiryDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  {batch.imageUrl && (
                    <PhotoIcon className="h-3 w-3 text-primary/60 opacity-40" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Fallback khi không có lô hàng */}
          {(!product.batches || product.batches.length === 0) && (
            <div className="py-24 text-center border-2 border-dashed border-slate-50 rounded-[2.5rem] bg-slate-50/20">
              <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em] italic">
                Chưa có dữ liệu nhập kho cho mặt hàng này
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
