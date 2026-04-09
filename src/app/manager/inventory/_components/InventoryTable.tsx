/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Fragment, useState } from "react";
import { InboxIcon } from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import KitchenBatchDetails from "./KitchenBatchDetails";

export interface InventoryRowItem {
  productId: number;
  productName: string;
  sku: string;
  totalQuantity: number;
  unit: string;
  status: "normal" | "low-stock" | "out-of-stock";
  warehouseName?: string;
}

interface InventoryTableProps {
  items: InventoryRowItem[];
  isLoading: boolean;
  isError: boolean;
  onAdjust?: (item: InventoryRowItem) => void;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-6 w-16 mx-auto" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-5 w-24 mx-auto" />
          </TableCell>
          {/* Skeleton cho Action đã ẩn */}
        </TableRow>
      ))}
    </>
  );
}

export default function InventoryTable({
  items,
  isLoading,
  isError,
  // onAdjust, // Tạm thời không dùng đến logic adjust ở table này
}: InventoryTableProps) {
  const [expandedProductId, setExpandedProductId] = useState<number | null>(
    null,
  );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-red-500">
          Lỗi tải dữ liệu kho hàng.
        </p>
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Không tìm thấy sản phẩm nào
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-6 text-xs font-semibold text-slate-500 w-[40%]">
            Sản phẩm / SKU
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[25%]">
            Kho quản lý
          </TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[15%]">
            Tồn kho
          </TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[20%]">
            Trạng thái
          </TableHead>
          {/* Ẩn Header Thao tác */}
          {/* <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[15%]">
            Thao tác
          </TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          items.map((item, idx) => (
            <Fragment key={`${item.productId}-${idx}`}>
              <TableRow
                className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                onClick={() =>
                  setExpandedProductId((prev) =>
                    prev === item.productId ? null : item.productId,
                  )
                }
              >
                <TableCell className="pl-6">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.productName}
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      SKU: {item.sku}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-700">
                    {item.warehouseName || "Kho chính"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors italic">
                    {item.totalQuantity.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase italic">
                    {item.unit}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      item.status === "normal"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : item.status === "low-stock"
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {item.status.toUpperCase()}
                  </Badge>
                </TableCell>

                {/* Ẩn Cell Thao tác */}
                {/* <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    {onAdjust && (
                      <Can I={P.PRODUCT_UPDATE} on={Resource.PRODUCT}>
                        <Button ...>Adjust</Button>
                      </Can>
                    )}
                  </div>
                </TableCell> */}
              </TableRow>

              {expandedProductId === item.productId && (
                <TableRow className="bg-slate-50/30">
                  <TableCell
                    colSpan={4}
                    className="p-0 border-b border-slate-100"
                  >
                    <div className="px-8 pb-8 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <KitchenBatchDetails
                        productId={item.productId}
                        embedded
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))
        )}
      </TableBody>
    </Table>
  );
}
