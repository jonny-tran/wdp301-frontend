"use client";

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
import { Shipment } from "@/types/shipment";
import { format } from "date-fns";
import { toast } from "sonner";
import { CopyIcon, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  items: Shipment[];
  isLoading: boolean;
  isError: boolean;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-3 w-12 mx-auto mt-1" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-4 w-20 mx-auto" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-6 w-20 mx-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function ShipmentTable({
  items,
  isLoading,
  isError,
}: Props) {
  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}`);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-red-500">Lỗi tải dữ liệu vận đơn</p>
      </div>
    );
  }

  if (!isLoading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Chưa có vận đơn nào</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
            <TableHead className="pl-6 text-xs font-semibold text-slate-500 w-[25%]">Vận đơn / Đơn hàng</TableHead>
            <TableHead className="text-xs font-semibold text-slate-500 w-[25%]">Cửa hàng</TableHead>
            <TableHead className="text-center text-xs font-semibold text-slate-500 w-[15%]">Ngày tạo</TableHead>
            <TableHead className="text-center text-xs font-semibold text-slate-500 w-[15%]">Ngày xuất</TableHead>
            <TableHead className="text-center text-xs font-semibold text-slate-500 w-[20%]">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            items.map((ship) => {
              // Extract store formatting logic safely
              const splitName = ship.storeName ? ship.storeName.split("-") : ["Cửa hàng nhánh"];
              const brand = splitName[0]?.trim();
              const branch = splitName.slice(1).join("-").trim();

              return (
                <TableRow
                  key={ship.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="pl-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 group/id">
                        <p className="font-semibold text-slate-900 uppercase">
                          #{ship.id.slice(0, 8)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover/id:opacity-100"
                          onClick={(e) => handleCopy(e, ship.id, "Mã Vận Đơn")}
                        >
                          <CopyIcon className="h-3 w-3 text-slate-400" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 uppercase">
                        ORD: {ship.orderId.slice(0, 8)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-slate-900 truncate max-w-[200px]" title={brand}>
                        {brand}
                      </p>
                      {branch && (
                        <p className="text-xs text-slate-500 truncate max-w-[200px]" title={branch}>
                          {branch}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="text-sm font-medium text-slate-700">
                      {format(new Date(ship.createdAt), "dd/MM/yyyy")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {format(new Date(ship.createdAt), "HH:mm")}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    {ship.shipDate ? (
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {format(new Date(ship.shipDate), "dd/MM/yyyy")}
                        </p>
                        <p className="text-xs text-slate-400">
                          {format(new Date(ship.shipDate), "HH:mm")}
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={
                        ship.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : ship.status === "preparing" || ship.status === "picking" || ship.status === "delivering"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {(ship.status || "UNKNOWN").toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
