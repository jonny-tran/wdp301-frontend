"use client";

import { BaseUnit } from "@/types/base-unit";
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
import { Pencil, Trash2, InboxIcon } from "lucide-react";

interface Props {
  data: BaseUnit[];
  isLoading: boolean;
  onEdit: (unit: BaseUnit) => void;
  onDelete: (unit: BaseUnit) => void;
}

// Skeleton rows for loading state
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6">
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell className="text-right pr-6">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function BaseUnitTable({ data, isLoading, onEdit, onDelete }: Props) {
  // Empty state
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">
          Chưa có đơn vị tính nào
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Nhấn &quot;Thêm đơn vị&quot; để bắt đầu
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-6 w-[60px] text-xs font-semibold text-slate-500">
            #
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500">
            Tên đơn vị
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500">
            Mô tả
          </TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[100px]">
            Trạng thái
          </TableHead>
          <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[120px]">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          data.map((unit, index) => (
            <TableRow
              key={unit.id}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="pl-6 text-sm text-slate-400 font-medium">
                {index + 1}
              </TableCell>
              <TableCell className="font-semibold text-slate-900">
                {unit.name}
              </TableCell>
              <TableCell className="text-sm text-slate-500 max-w-[300px] truncate">
                {unit.description || "—"}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    unit.isActive
                      ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                      : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }
                >
                  {unit.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    onClick={() => onEdit(unit)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(unit)}
                  >
                    <Trash2 className="h-4 w-4" />
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
