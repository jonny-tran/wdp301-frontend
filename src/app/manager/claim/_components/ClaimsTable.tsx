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
import { cn } from "@/lib/utils";
import { CheckCircle2, Eye, InboxIcon } from "lucide-react";
import { ClaimRow } from "./claims.types";

interface Props {
  data: ClaimRow[];
  onSelect: (id: string) => void;
  onResolve: (id: string) => void;
  isLoading?: boolean;
  isError?: boolean;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6">
            <Skeleton className="h-4 w-6" />
          </TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-6 w-20 mx-auto" />
          </TableCell>
          <TableCell className="text-right pr-6">
            <Skeleton className="h-8 w-8 ml-auto rounded-md inline-block" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function ClaimTable({
  data,
  onSelect,
  onResolve,
  isLoading,
  isError,
}: Props) {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-red-500">
          Lỗi tải dữ liệu khiếu nại
        </p>
      </div>
    );
  }

  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Chưa có khiếu nại nào
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-slate-50/80 hover:bg-slate-50/80">
        <TableRow>
          <TableHead className="pl-6 text-xs font-semibold text-slate-500 w-[10%]">
            No.
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[45%]">
            Khiếu nại / Vận đơn
          </TableHead>
          <TableHead className="text-center text-xs font-semibold text-slate-500 w-[20%]">
            Trạng thái
          </TableHead>
          <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[25%]">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          data.map((row) => {
            const isPending = row.status === "pending";

            return (
              <TableRow
                key={row.claimId}
                className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                onClick={() => onSelect(row.claimId)}
              >
                <TableCell className="pl-6 py-6 font-semibold text-slate-500">
                  {row.no}
                </TableCell>
                <TableCell className="py-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors uppercase">
                      ID: {row.claimId.slice(0, 8)}
                    </span>
                    <span className="text-xs font-medium text-slate-500 uppercase">
                      Shipment: {row.shipmentId.slice(0, 8)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center py-6">
                  <Badge
                    variant="outline"
                    className={cn(
                      row.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : row.status === "rejected"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200",
                    )}
                  >
                    {(row.status || "UNKNOWN").toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6 py-6">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(row.claimId);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {isPending && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onResolve(row.claimId);
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
