"use client";

import Image from "next/image";
import { Product } from "@/types/product";
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
import { Eye, Pencil, Trash2, RotateCw, InboxIcon } from "lucide-react";

interface ProductTableProps {
  items: Product[];
  rowStart: number;
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onViewDetail: (product: Product) => void;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6"><Skeleton className="h-4 w-6" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-14" /></TableCell>
          <TableCell className="text-right pr-6">
            <div className="flex justify-end gap-1"><Skeleton className="h-8 w-8 rounded-md" /></div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

const DEFAULT_IMG = "https://res.cloudinary.com/dmhjgnymn/image/upload/v1770135560/OIP_j6j4gz.webp";

export default function ProductTable({
  items,
  rowStart,
  isLoading,
  onEdit,
  onDelete,
  onRestore,
  onViewDetail,
}: ProductTableProps) {
  if (!isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Chưa có sản phẩm nào</p>
        <p className="text-xs text-slate-400 mt-1">Nhấn &quot;Thêm sản phẩm&quot; để bắt đầu</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-6 w-[50px] text-xs font-semibold text-slate-500">#</TableHead>
          <TableHead className="text-xs font-semibold text-slate-500">Sản phẩm</TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[140px]">Đơn vị & Hạn</TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[100px]">Trạng thái</TableHead>
          <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[140px]">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          items.map((item, index) => (
            <TableRow
              key={item.id}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="pl-6 text-sm text-slate-400 font-medium">
                {rowStart + index + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className={`relative h-10 w-10 overflow-hidden rounded-lg border border-slate-200 shrink-0 ${!item.isActive ? "opacity-40 grayscale" : ""}`}>
                    <Image
                      src={item.imageUrl || DEFAULT_IMG}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate max-w-[200px] ${item.isActive ? "text-slate-900" : "text-slate-400"}`}>
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">SKU: {item.sku}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 text-[10px]">
                    {item.baseUnit}
                  </Badge>
                  <p className="text-xs text-slate-400">{item.shelfLifeDays} ngày</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    item.isActive
                      ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                      : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }
                >
                  {item.isActive ? "Active" : "Ẩn"}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.isActive ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => onViewDetail(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5"
                      onClick={() => onRestore(item.id)}
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                      Khôi phục
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
