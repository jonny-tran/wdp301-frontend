"use client";

import { ClaimRow } from "./claims.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  EyeIcon,
  CheckIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  data: ClaimRow[];
  onSelect: (id: string) => void;
  onResolve: (id: string) => void; // Prop mới để mở Modal xử lý
}

export default function ClaimTable({ data, onSelect, onResolve }: Props) {
  if (!data || data.length === 0)
    return (
      <div className="p-32 text-center flex flex-col items-center gap-4 animate-in fade-in">
        <ArchiveBoxIcon className="w-12 h-12 text-slate-200" />
        <p className="font-black text-slate-300 italic uppercase text-[10px] tracking-[0.3em]">
          Hệ thống chưa ghi nhận khiếu nại nào
        </p>
      </div>
    );

  return (
    <Table>
      <TableHeader className="bg-slate-50/50">
        <TableRow className="border-none">
          <TableHead className="pl-10 text-[10px] font-black uppercase text-slate-400 py-8 italic w-100px">
            No.
          </TableHead>
          <TableHead className="text-[10px] font-black uppercase text-slate-400 py-8 italic">
            Khiếu nại / Vận đơn
          </TableHead>
          <TableHead className="text-center text-[10px] font-black uppercase text-slate-400 py-8 italic">
            Trạng thái
          </TableHead>
          <TableHead className="text-right pr-10 text-[10px] font-black uppercase text-slate-400 py-8 italic">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => {
          // Chỉ hiển thị nút xử lý nếu trạng thái là pending
          const isPending = row.status === "pending";

          return (
            <TableRow
              key={row.claimId}
              className="border-slate-50 hover:bg-indigo-50/10 transition-all group"
            >
              <TableCell className="pl-10 py-8 font-black italic text-slate-300">
                {row.no}
              </TableCell>
              <TableCell className="py-8" onClick={() => onSelect(row.claimId)}>
                <div className="flex flex-col cursor-pointer">
                  <span className="text-sm font-black uppercase italic text-slate-900 group-hover:text-indigo-600">
                    ID: {row.claimId.slice(0, 8)}...
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">
                    Shipment: {row.shipmentId.slice(0, 8)}...
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center py-8">
                <Badge
                  className={cn(
                    "rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-none",
                    row.status === "approved"
                      ? "bg-emerald-100 text-emerald-600"
                      : row.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-400",
                  )}
                >
                  {row.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-10 py-8">
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => onSelect(row.claimId)}
                    className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-950 hover:text-white transition-all shadow-sm"
                  >
                    <EyeIcon className="w-4 h-4 stroke-[2.5px]" />
                  </Button>

                  {/* LOGIC: Chỉ hiện nút Resolve nếu chưa xử lý */}
                  {isPending && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onResolve(row.claimId);
                      }}
                      className="p-3 bg-indigo-600 text-white border-none rounded-xl hover:bg-slate-950 transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                    >
                      <CheckIcon className="w-4 h-4 stroke-[3px]" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
