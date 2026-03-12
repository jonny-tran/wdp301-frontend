"use client";

import { Fragment, useState } from "react";
import { PlusIcon, ArchiveBoxIcon, InboxIcon } from "@heroicons/react/24/outline";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
          <TableCell className="text-center"><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
          <TableCell className="text-right pr-6">
            <Skeleton className="h-8 w-16 rounded-md inline-block" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function InventoryTable({
  items,
  isLoading,
  isError,
  onAdjust,
}: InventoryTableProps) {
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
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
        <p className="text-sm font-medium text-slate-500">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-6 text-xs font-semibold text-slate-500 w-[35%]">Sản phẩm / SKU</TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[20%]">Kho quản lý</TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[15%]">Tồn kho</TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[15%]">Trạng thái</TableHead>
          <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[15%]">Thao tác</TableHead>
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
                    <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-700">
                    {item.warehouseName || "Kho chính"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.totalQuantity.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">{item.unit}</span>
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
                    {item.status === "normal"
                      ? "Normal"
                      : item.status === "low-stock"
                      ? "Low Stock"
                      : "Out of Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div
                    className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {onAdjust && (
                      <Can I={P.PRODUCT_UPDATE} on={Resource.PRODUCT}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 border-slate-200 hover:bg-slate-100"
                          onClick={() => onAdjust(item)}
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                          <span className="text-xs">Adjust</span>
                        </Button>
                      </Can>
                    )}
                  </div>
                </TableCell>
              </TableRow>

              {expandedProductId === item.productId && (
                <TableRow>
                  <TableCell colSpan={5} className="bg-slate-50 p-0">
                    <div className="px-6 pb-6 pt-2">
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
