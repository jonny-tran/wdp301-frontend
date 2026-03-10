"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import ProductDetailView from "../_components/ProductDetailView";
import { ArchiveBoxIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

import { ProductRow } from "../_components/product.types";
import { Batch } from "@/types/product";

// Định nghĩa Interface để khớp với JSON API của Hàn
interface ProductDetailResponse {
  statusCode: number;
  message: string;
  data: ProductRow & { batches?: Batch[] }; // Đây là nơi chứa object sản phẩm (Đùi gà KFC)
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { productDetail } = useProduct();

  // 1. Ép kiểu 'as any' hoặc interface cụ thể để bypass lỗi 'Property data does not exist'
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = productDetail(Number(id)) as {
    data: ProductDetailResponse | (ProductRow & { batches?: Batch[] }) | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };

  // 2. Bóc tách dữ liệu: response.data chính là Object Product
  const product = useMemo(() => {
    if (!response) return null;
    return ('data' in response ? response.data : response) as ProductRow & { batches?: Batch[] };
  }, [response]);

  // 3. Giao diện Loading
  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-4 border-slate-900 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
          Đang truy xuất dữ liệu ...
        </p>
      </div>
    );
  }

  // 4. Giao diện Lỗi (Không tìm thấy hoặc Server sập)
  if (error || !product) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100 text-red-600 shadow-xl shadow-red-100/20">
          <ArchiveBoxIcon className="h-12 w-12 stroke-[1.5px]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black font-display tracking-wider uppercase text-text-main">
            Sản phẩm không tồn tại
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed italic">
            Mã định danh #{id} không có trong kho hoặc máy chủ gặp sự cố kết
            nối.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push("/manager/products")}
            variant="outline"
            className="rounded-full px-8 py-5 border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all h-auto"
          >
            Quay lại
          </Button>
          <Button
            onClick={() => refetch()}
            className="rounded-full px-8 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all h-auto flex gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" /> Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // 5. Hiển thị View Component
  return <ProductDetailView product={product} />;
}
