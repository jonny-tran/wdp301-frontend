"use client";

import Image from "next/image";
import { ProductRow } from "./product.types";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
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
        <tbody className="divide-y divide-slate-100 bg-white">
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="px-10 py-20 text-center font-bold text-slate-400 italic"
              >
                Đang tải Catalog...
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
                          "text-base font-black font-display tracking-wider uppercase",
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
                    <span className="text-[10px] font-black text-primary bg-blue-50 px-3 py-1 rounded-lg w-fit uppercase italic border border-primary/20">
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
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white text-[10px] font-black uppercase rounded-full hover:bg-primary-dark transition-all shadow-lg"
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
