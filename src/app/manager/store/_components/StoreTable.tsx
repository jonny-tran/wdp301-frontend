"use client";

import { Store } from "@/types/store";
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
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";
import { Pencil, Trash2, InboxIcon } from "lucide-react";

interface Props {
  items: Store[];
  isLoading: boolean;
  onEdit: (store: Store) => void;
  onDelete: (store: Store) => void;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-6">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-48" />
            </div>
          </TableCell>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell className="text-right pr-6">
            <div className="flex justify-end gap-1">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function StoreTable({ items, isLoading, onEdit, onDelete }: Props) {
  if (!isLoading && (!items || items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Chưa có cửa hàng nào</p>
        <p className="text-xs text-slate-400 mt-1">Nhấn &quot;Thêm Store&quot; để bắt đầu</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-6 text-xs font-semibold text-slate-500">Cửa hàng</TableHead>
          <TableHead className="text-xs font-semibold text-slate-500">Quản lý / Liên hệ</TableHead>
          <TableHead className="text-xs font-semibold text-slate-500 w-[100px]">Trạng thái</TableHead>
          <TableHead className="text-right pr-6 text-xs font-semibold text-slate-500 w-[100px]">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          items.map((store) => (
            <TableRow
              key={store.id}
              className="group hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="pl-6">
                <div>
                  <p className="font-semibold text-slate-900">{store.name}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[250px]">
                    {store.address || "—"}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm text-slate-700">
                    {store.managerName || "Chưa bổ nhiệm"}
                  </p>
                  <p className="text-xs text-slate-400">{store.phone || "—"}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    store.isActive
                      ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                      : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }
                >
                  {store.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Can I={P.STORE_UPDATE} on={Resource.STORE}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      onClick={() => onEdit(store)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(store)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Can>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
