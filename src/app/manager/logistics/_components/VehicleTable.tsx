/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Truck, Fuel, Package, Inbox, Pencil, Trash2, Eye } from "lucide-react";
import { Vehicle } from "@/types/logistics";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Định nghĩa Interface đầy đủ để khớp với LogisticsClient
interface Props {
  data: Vehicle[];
  isLoading: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onViewDetail: (vehicle: Vehicle) => void;
}

export default function VehicleTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onViewDetail,
}: Props) {
  if (!isLoading && (!data || data.length === 0)) return <EmptyState />;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-8 text-[10px] font-black uppercase italic tracking-widest text-slate-400">
            Biển số / Xe tải
          </TableHead>
          <TableHead className="text-[10px] font-black uppercase italic tracking-widest text-slate-400 text-center">
            Tải trọng (KG)
          </TableHead>
          <TableHead className="text-[10px] font-black uppercase italic tracking-widest text-slate-400 text-center">
            Nhiên liệu
          </TableHead>
          <TableHead className="text-center text-[10px] font-black uppercase italic tracking-widest text-slate-400">
            Trạng thái
          </TableHead>
          <TableHead className="text-right pr-8 text-[10px] font-black uppercase italic tracking-widest text-slate-400 w-[140px]">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          data.map((v) => (
            <TableRow
              key={v.id}
              className="group hover:bg-slate-50/50 transition-colors border-slate-50"
            >
              {/* Biển số & Icon */}
              <TableCell className="pl-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200 group-hover:rotate-3 transition-transform">
                    <Truck className="h-4 w-4 text-white stroke-[2.5px]" />
                  </div>
                  <p className="font-black text-slate-900 uppercase italic text-sm tracking-tight">
                    {v.licensePlate}
                  </p>
                </div>
              </TableCell>

              {/* Tải trọng */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Package className="h-4 w-4 text-slate-400" />
                  <span className="font-black italic text-slate-700">
                    {parseFloat(v.payloadCapacity).toLocaleString()}
                  </span>
                </div>
              </TableCell>

              {/* Định mức nhiên liệu */}
              <TableCell className="text-center">
                <div className="inline-flex items-center gap-1.5 text-indigo-600 bg-indigo-50/50 px-3 py-1 rounded-full">
                  <Fuel className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black italic">
                    {v.fuelRatePerKm} L/KM
                  </span>
                </div>
              </TableCell>

              {/* Trạng thái */}
              <TableCell className="text-center">
                <Badge
                  className={
                    v.status === "available"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {v.status.toUpperCase()}
                </Badge>
              </TableCell>

              {/* Các nút thao tác (Hiện khi hover hàng) */}
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-1 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                    onClick={() => onViewDetail(v)}
                  >
                    <Eye className="h-4 w-4 stroke-[2.5px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                    onClick={() => onEdit(v)}
                  >
                    <Pencil className="h-4 w-4 stroke-[2.5px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={() => onDelete(v)}
                  >
                    <Trash2 className="h-4 w-4 stroke-[2.5px]" />
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-slate-100 p-4 mb-4">
        <Inbox className="h-8 w-8 text-slate-400" />
      </div>
      <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">
        Đội xe đang trống
      </p>
    </div>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={5} className="p-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
