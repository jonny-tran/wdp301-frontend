"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatus } from "@/utils/enum";
import { clsx } from "clsx";
import { Eye, InboxIcon } from "lucide-react";
import { OrderRow } from "./order.types";

interface Props {
  data: OrderRow[];
  isLoading: boolean;
  isError: boolean;
  onView?: (order: OrderRow) => void;
}

const getStatusStyle = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-amber-50 text-amber-700 border-amber-200";
    case OrderStatus.APPROVED:
    case OrderStatus.COMPLETED:
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case OrderStatus.REJECTED:
    case OrderStatus.CANCELLED:
      return "bg-red-50 text-red-700 border-red-200";
    case OrderStatus.DELIVERING:
    case OrderStatus.PICKING:
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-slate-50 text-slate-500 border-slate-200";
  }
};

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-5 w-24 ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-24" />
          </TableCell>
          <TableCell className="text-right pr-6">
            <Skeleton className="h-8 w-8 rounded-md inline-block" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function OrderTable({
  data,
  isLoading,
  isError,
  onView,
}: Props) {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-red-500">
          Lỗi tải dữ liệu đơn hàng
        </p>
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Chưa có đơn hàng nào
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-6 text-xs font-semibold text-slate-500 w-[30%]">
            Mã Đơn / Cửa Hàng
          </TableHead>
          <TableHead className="text-right text-xs font-semibold text-slate-500 w-[20%]">
            Tổng Tiền
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[20%]">
            Dự Kiến Giao
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[15%]">
            Trạng Thái
          </TableHead>
          <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[15%]">
            Thao Tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          data.map((order) => (
            <TableRow
              key={order.id}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="pl-6">
                <div>
                  <p className="font-semibold text-slate-900">
                    {order.id.split("-")[0].toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500">
                    Store ID: {order.storeId}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-semibold text-blue-600">
                  {order.formattedAmount}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700">
                    {order.deliveryDateFormatted}
                  </span>
                  <span className="text-xs text-slate-400">
                    Created: {order.createdAtFormatted}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={clsx(getStatusStyle(order.status as OrderStatus))}
                >
                  {(order.status || "UNKNOWN").toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    onClick={() => onView?.(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
