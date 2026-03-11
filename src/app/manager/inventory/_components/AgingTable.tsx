"use client";

import { ClockIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
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

export interface AgingBatchItem {
  batchCode: string;
  productName: string;
  quantity: number;
  expiryDate: string;
  percentageLeft: number;
  level?: "WARNING" | "CRITICAL";
}

export interface AgingData {
  warning: AgingBatchItem[];
  critical: AgingBatchItem[];
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
          <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
          <TableCell className="text-center"><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
          <TableCell>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </TableCell>
          <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function AgingTable({
  data,
  isLoading,
}: {
  data: AgingData;
  isLoading: boolean;
}) {
  const warningList = data?.warning || [];
  const criticalList = data?.critical || [];

  const allBatches: AgingBatchItem[] = [
    ...criticalList.map((b: AgingBatchItem) => ({
      ...b,
      level: "CRITICAL" as const,
    })),
    ...warningList.map((b: AgingBatchItem) => ({
      ...b,
      level: "WARNING" as const,
    })),
  ];

  if (!isLoading && allBatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <ClockIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Tất cả lô hàng đều trong hạn an toàn</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-6 text-xs font-semibold text-slate-500 w-[35%]">Lô hàng / Sản phẩm</TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[15%]">Số lượng</TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[15%]">Hết hạn</TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[20%]">Vòng đời còn lại</TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[15%]">Mức độ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          allBatches.map((batch, idx) => (
            <TableRow
              key={`${batch.batchCode}-${idx}`}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="pl-6">
                <div>
                  <p className="font-semibold text-slate-900">{batch.productName}</p>
                  <p className="text-xs text-slate-500">Lô: {batch.batchCode}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {batch.quantity.toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <p className="font-medium text-slate-700">
                  {batch.expiryDate
                    ? format(new Date(batch.expiryDate), "dd/MM/yyyy")
                    : "---"}
                </p>
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-center gap-1.5 px-4">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        batch.level === "CRITICAL" ? "bg-red-500" : "bg-orange-400"
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, batch.percentageLeft))}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    {batch.percentageLeft}% CÒN LẠI
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={
                    batch.level === "CRITICAL"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-orange-50 text-orange-700 border-orange-200"
                  }
                >
                  {batch.level}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
