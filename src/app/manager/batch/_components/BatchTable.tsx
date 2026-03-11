"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Batch } from "@/types/product";
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
import { Pencil, InboxIcon, Archive } from "lucide-react";

interface BatchTableProps {
  items: Batch[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (batch: Batch) => void;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell className="text-center"><Skeleton className="h-6 w-12 mx-auto" /></TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
          <TableCell className="text-right pr-6">
            <Skeleton className="h-8 w-8 rounded-md inline-block" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function BatchTable({
  items,
  isLoading,
  isError,
  onEdit,
}: BatchTableProps) {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-red-500">Lỗi truy xuất dữ liệu lô hàng</p>
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Chưa có lô hàng nào</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-6 text-xs font-semibold text-slate-500 w-[35%]">Mã Lô & Hình ảnh</TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[15%]">Số lượng</TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[20%]">Ngày hết hạn</TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[15%]">Trạng thái</TableHead>
          <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[15%]">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          items.map((item) => (
            <TableRow
              key={item.id}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="pl-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                    {item.imageUrl && item.imageUrl.trim() !== "" ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.batchCode}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <Archive className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.batchCode}</p>
                    <p className="text-xs text-slate-500">Product ID: #{item.productId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {Number(item.currentQuantity).toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-slate-700">
                    {item.expiryDate ? format(new Date(item.expiryDate), "dd/MM/yyyy") : "Vô thời hạn"}
                  </p>
                  <p className="text-xs text-slate-400">Hạn dùng (EXP)</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    item.status === "AVAILABLE" || item.status === "available"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : item.status === "PENDING" || item.status === "pending"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : item.status === "EXPIRED" || item.status === "expired"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }
                >
                  {(item.status || "UNKNOWN").toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
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
