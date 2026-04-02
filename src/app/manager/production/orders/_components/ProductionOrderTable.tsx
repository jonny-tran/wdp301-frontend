"use client";

import Link from "next/link";
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
import { Eye, InboxIcon } from "lucide-react";
import type {
  ProductionOrder,
  ProductionOrderStatus,
} from "@/types/production";

interface Props {
  items: ProductionOrder[];
  isLoading: boolean;
  rowStart: number;
}

function statusBadgeClass(s: ProductionOrderStatus): string {
  const u = String(s).toUpperCase();
  switch (u) {
    case "PENDING":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "CANCELLED":
      return "bg-red-50 text-red-800 border-red-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function statusLabel(s: ProductionOrderStatus): string {
  const u = String(s).toUpperCase();
  const map: Record<string, string> = {
    PENDING: "Chờ xử lý",
    IN_PROGRESS: "Đang SX",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Đã hủy",
  };
  return map[u] ?? u;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6">
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-20" />
          </TableCell>
          <TableCell className="pr-6">
            <Skeleton className="h-8 w-8 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function ProductionOrderTable({
  items,
  isLoading,
  rowStart,
}: Props) {
  if (!isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Không có lệnh sản xuất
        </p>
        <p className="text-xs text-slate-400 mt-1">Thử đổi bộ lọc</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-6 text-xs font-semibold text-slate-500 w-[52px]">
            #
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500">
            Mã lệnh
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500">
            Công thức / TP
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[100px]">
            Kế hoạch
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[100px]">
            Thực tế
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[120px]">
            Bếp
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[110px]">
            Trạng thái
          </TableHead>
          <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[72px]">
            Xem
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          items.map((o, index) => (
            <TableRow key={o.id} className="hover:bg-slate-50/50">
              <TableCell className="pl-6 text-sm text-slate-400 font-medium">
                {rowStart + index + 1}
              </TableCell>
              <TableCell className="font-mono text-sm text-slate-900">
                {o.orderCode || o.id.slice(0, 12)}
              </TableCell>
              <TableCell>
                <p className="text-sm text-slate-900">
                  {o.recipeName || o.productName}
                </p>
                <p className="text-xs text-slate-400">{o.sku ?? ""}</p>
              </TableCell>
              <TableCell className="text-sm tabular-nums">
                {o.targetQuantity} {o.unit}
              </TableCell>
              <TableCell className="text-sm tabular-nums text-slate-700">
                {o.actualQuantity != null
                  ? `${o.actualQuantity} ${o.unit}`
                  : "—"}
              </TableCell>
              <TableCell className="text-sm text-slate-600 max-w-[140px] truncate">
                {o.staffName?.trim() ? o.staffName : "—"}
              </TableCell>
              <TableCell>
                <Badge
                  className={`border text-[10px] ${statusBadgeClass(o.status)}`}
                >
                  {statusLabel(o.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                {/* Nút Xem chi tiết với hiệu ứng hover Indigo đặc trưng */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-lg"
                  asChild
                >
                  <Link href={`/manager/production/orders/${o.id}`}>
                    {/* Stroke dày 2.8px giúp icon sắc nét hơn trên màn hình */}
                    <Eye className="h-4 w-4 stroke-[2.8px]" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
