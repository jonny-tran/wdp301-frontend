/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Route } from "@/types/logistics";
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
import {
  MapPin,
  Navigation,
  Clock,
  Banknote,
  Pencil,
  Trash2,
  InboxIcon,
  Eye,
} from "lucide-react";

interface Props {
  data: Route[];
  isLoading: boolean;
  onEdit: (route: Route) => void;
  onDelete: (route: Route) => void;
  onViewDetail: (route: Route) => void;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-8 py-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-24" />
          </TableCell>
          <TableCell className="text-right pr-8">
            <Skeleton className="h-8 w-24 ml-auto rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function RouteTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onViewDetail,
}: Props) {
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-slate-100 p-4 mb-4">
          <InboxIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest">
          Chưa có tuyến đường vận chuyển
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
          <TableHead className="pl-8 text-[10px] font-black uppercase italic tracking-widest text-slate-400">
            Lộ trình / Tuyến đường
          </TableHead>
          <TableHead className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">
            Cự ly
          </TableHead>
          <TableHead className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">
            Thời gian
          </TableHead>
          <TableHead className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">
            Chi phí cơ sở
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
          data.map((route) => (
            <TableRow
              key={route.id}
              className="group hover:bg-slate-50/50 transition border-slate-50"
            >
              <TableCell className="pl-8 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200 group-hover:rotate-3 transition-transform">
                    <Navigation className="h-4 w-4 text-white stroke-[2.5px]" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase italic text-sm tracking-tight">
                      {route.routeName}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-rose-500" />
                      <p className="text-[10px] font-bold text-slate-400 italic">
                        VFC Logistics Network
                      </p>
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-700 italic text-sm">
                    {route.distanceKm}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase italic">
                    KM
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-black italic">
                    {route.estimatedHours}H
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50/50 px-3 py-1 rounded-full w-fit">
                  <Banknote className="h-3.5 w-3.5" />
                  <span className="text-xs font-black italic tracking-tighter">
                    {parseFloat(route.baseTransportCost).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-black uppercase">VND</span>
                </div>
              </TableCell>

              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-1 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                    onClick={() => onViewDetail(route)}
                  >
                    <Eye className="h-4 w-4 stroke-[2.5px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                    onClick={() => onEdit(route)}
                  >
                    <Pencil className="h-4 w-4 stroke-[2.5px]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    onClick={() => onDelete(route)}
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
