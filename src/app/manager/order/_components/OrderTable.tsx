/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { cn } from "@/lib/utils"; // Ưu tiên dùng cn của hệ thống
import { Eye, InboxIcon, Truck, Building2 } from "lucide-react";
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
          <TableCell className="pl-8 py-5">
            <Skeleton className="h-10 w-full rounded-xl" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-10 w-full rounded-xl" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-10 w-full rounded-xl" />
          </TableCell>
          <TableCell className="pr-8 text-right">
            <Skeleton className="h-8 w-8 rounded-full inline-block" />
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
      <div className="flex flex-col items-center justify-center py-20 bg-red-50/30 rounded-[2rem] border-2 border-dashed border-red-100">
        <p className="text-sm font-bold text-red-500 uppercase italic">
          Lỗi kết nối dữ liệu đơn hàng
        </p>
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
        <div className="rounded-2xl bg-white p-4 mb-4 shadow-sm">
          <InboxIcon className="h-8 w-8 text-slate-300" />
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase italic">
          Hệ thống chưa ghi nhận đơn hàng
        </p>
      </div>
    );
  }

  return (
    // Bọc Table trong một khung bo tròn lớn để tạo cảm giác hiện đại
    <div className="rounded-[2rem] border border-slate-100 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
            <TableHead className="pl-8 py-4 text-[10px] font-black uppercase italic tracking-widest text-slate-400">
              Định danh / Cửa hàng
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">
              Lịch trình dự kiến
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">
              Trạng thái vận hành
            </TableHead>
            <TableHead className="text-right pr-8 text-[10px] font-black uppercase italic tracking-widest text-slate-400">
              Thao tác
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
                className="group hover:bg-slate-50/50 transition-all duration-200 border-b border-slate-50 last:border-0"
              >
                <TableCell className="pl-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        #{order.id.split("-")[0].toUpperCase()}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        ID: {order.storeId}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Truck className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm font-medium">
                        {order.deliveryDateFormatted}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                      Tạo: {order.createdAtFormatted}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full px-3 py-0.5 text-[10px] font-black uppercase italic tracking-wider shadow-sm",
                      getStatusStyle(order.status as OrderStatus),
                    )}
                  >
                    {order.status || "UNKNOWN"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right pr-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 hover:shadow-md transition-all active:scale-90"
                    onClick={() => onView?.(order)}
                  >
                    <Eye className="h-5 w-5 stroke-[2.5px]" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
