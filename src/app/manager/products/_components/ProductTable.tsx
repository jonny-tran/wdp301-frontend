"use client";

import {
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
  EyeIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { Product } from "@/types/product";
import { clsx } from "clsx";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

interface ProductTableProps {
  items: Product[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onViewDetail: (product: Product) => void;
}

export default function ProductTable({
  items,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onRestore,
  onViewDetail,
}: ProductTableProps) {
  // 1. Xử lý trạng thái Loading rỗng
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center space-y-4 flex-col">
        <ArrowPathIcon className="h-10 w-10 animate-spin text-slate-200" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Đang tải Catalog...
        </p>
      </div>
    );
  }

  // 2. Xử lý lỗi hoặc không có dữ liệu
  if (isError || items.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4 text-slate-300">
        <CubeIcon className="h-16 w-16 opacity-20" />
        <p className="text-xs font-bold uppercase tracking-widest">
          Không tìm thấy sản phẩm nào
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <th className="px-10 py-6">Sản phẩm</th>
            <th className="px-6 py-6">Thông tin kho</th>
            <th className="px-6 py-6 text-center">Trạng thái</th>
            <th className="px-10 py-6 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((item) => (
            <tr
              key={item.id}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              {/* CỘT 1: Ảnh & Tên */}
              <td className="px-10 py-6">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 shadow-sm group-hover:shadow-md transition-all border border-slate-100">
                    <img
                      src={item.imageUrl || "https://cdn.com/placeholder.jpg"}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) =>
                      (e.currentTarget.src =
                        "https://cdn.com/placeholder.jpg")
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 leading-none">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">
                      SKU: {item.sku}
                    </p>
                  </div>
                </div>
              </td>

              {/* CỘT 2: Đơn vị & Hạn dùng */}
              <td className="px-6 py-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-900 px-2 py-0.5 bg-slate-100 rounded-md uppercase tracking-tighter">
                      {item.baseUnit}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 italic">
                      Hạn: {item.shelfLifeDays} ngày
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Min Stock: {item.minStockLevel}
                  </p>
                </div>
              </td>

              {/* CỘT 3: Trạng thái Badge */}
              <td className="px-6 py-6 text-center">
                <span
                  className={clsx(
                    "inline-flex rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest",
                    item.isActive
                      ? "bg-green-50 text-green-600 border border-green-100 shadow-sm shadow-green-50"
                      : "bg-slate-100 text-slate-400 border border-slate-200",
                  )}
                >
                  {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </td>

              {/* CỘT 4: Hành động */}
              <td className="px-10 py-6">
                <div className="flex items-center justify-end gap-2">
                  {item.isActive ? (
                    <>
                      <button
                        onClick={() => onViewDetail(item)}
                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-lg transition-all active:scale-90"
                        title="Xem lô hàng (FEFO)"
                      >
                        <EyeIcon className="h-4 w-4 stroke-[2.5px]" />
                      </button>
                      <Can I={P.PRODUCT_UPDATE} on={Resource.PRODUCT}>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-green-600 hover:shadow-lg transition-all active:scale-90"
                          title="Chỉnh sửa"
                        >
                          <PencilSquareIcon className="h-4 w-4 stroke-[2.5px]" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 hover:shadow-lg transition-all active:scale-90"
                          title="Xóa sản phẩm"
                        >
                          <TrashIcon className="h-4 w-4 stroke-[2.5px]" />
                        </button>
                      </Can>
                    </>
                  ) : (
                    // NÚT KHÔI PHỤC CHO SẢN PHẨM INACTIVE
                    <Can I={P.PRODUCT_UPDATE} on={Resource.PRODUCT}>
                      <button
                        onClick={() => onRestore(item.id)}
                        className="group flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-[10px] font-black text-white hover:bg-black transition-all active:scale-95 shadow-lg shadow-slate-200"
                      >
                        <ArrowPathIcon className="h-3.5 w-3.5 stroke-[3px] group-hover:rotate-180 transition-transform duration-500" />
                        KHÔI PHỤC
                      </button>
                    </Can>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
