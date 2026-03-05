"use client";

import Image from "next/image";
import { ProductRow } from "./product.types";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
<<<<<<< HEAD
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";

interface ProductTableProps {
  items: ProductRow[];
  rowStart: number;
  isLoading: boolean;
  onEdit: (product: ProductRow) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onViewDetail: (product: ProductRow) => void;
=======
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
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
}

export default function ProductTable({
  items,
  rowStart,
  isLoading,
  onEdit,
  onDelete,
  onRestore,
  onViewDetail,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-10 py-6">No.</th>
            <th className="px-6 py-6">Sản phẩm định danh</th>
            <th className="px-6 py-6">Đơn vị & Kho</th>
            <th className="px-6 py-6 text-center">Trạng thái</th>
            <th className="px-10 py-6 text-right">Thao tác</th>
          </tr>
        </thead>
<<<<<<< HEAD
        <tbody className="divide-y divide-slate-100 bg-white">
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="px-10 py-20 text-center font-bold text-slate-400 italic"
              >
                Đang tải Catalog...
=======
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
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr
                key={item.id}
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-10 py-8 w-24">
                  <span className="text-sm font-black text-slate-900 italic">
                    #{rowStart + index + 1}
                  </span>
                </td>
                <td className="px-6 py-8">
                  <div className="flex items-center gap-6">
                    <div
                      className={clsx(
                        "relative h-16 w-16 overflow-hidden rounded-[1.2rem] border shadow-sm transition-all duration-500",
                        !item.isActive &&
                          "grayscale contrast-75 brightness-90 opacity-50",
                      )}
                    >
                      <Image
                        src={
                          item.imageUrl ??
                          "https://res.cloudinary.com/dmhjgnymn/image/upload/v1770135560/OIP_j6j4gz.webp"
                        }
                        alt={item.name}
                        fill
                        sizes="64px"
                        priority={index === 0}
                        className="..."
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={clsx(
                          "text-base font-black uppercase italic tracking-tighter",
                          item.isActive ? "text-slate-900" : "text-slate-300",
                        )}
                      >
                        {item.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        SKU: {item.sku}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg w-fit uppercase italic border border-blue-100">
                      {item.baseUnitName}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 italic">
                      Hạn: {item.shelfLifeDays} ngày
                    </span>
                  </div>
                </td>
                <td className="px-6 py-8 text-center">
                  <span
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap",
                      item.isActive
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-slate-100 text-slate-400 border border-slate-200",
                    )}
                  >
                    {item.isActive ? "HOẠT ĐỘNG" : "ĐÃ ẨN"}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <div className="flex justify-end gap-3">
                    {item.isActive ? (
                      <>
                        <Button
                          onClick={() => onViewDetail(item)}
                          className="p-3 bg-[#a3b18a]/20 text-[#588157] hover:bg-[#588157] hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                        >
                          <EyeIcon className="h-4 w-4 stroke-[3px]" />
                        </Button>
                        <Button
                          onClick={() => onEdit(item)}
                          className="p-3 bg-[#a3b18a]/20 text-[#588157] hover:bg-[#588157] hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                        >
                          <PencilSquareIcon className="h-4 w-4 stroke-[3px]" />
                        </Button>
                        <Button
                          onClick={() => onDelete(item.id)}
                          className="p-3 bg-[#a3b18a]/20 text-[#588157] hover:bg-[#588157] hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                        >
                          <TrashIcon className="h-4 w-4 stroke-[3px]" />
                        </Button>
                      </>
                    ) : (
                      <button
                        onClick={() => onRestore(item.id)}
                        className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-full hover:bg-black transition-all shadow-lg"
                      >
                        <ArrowPathIcon className="h-4 w-4 stroke-[3px]" /> KHÔI
                        PHỤC
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
