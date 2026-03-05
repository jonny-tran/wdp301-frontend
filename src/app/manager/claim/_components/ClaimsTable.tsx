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

<<<<<<< HEAD
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
=======
import { Claim } from "@/types/claim";

export default function ClaimsTable({
  items = [],
  isLoading,
  onViewDetail,
}: {
  items: Claim[];
  isLoading: boolean;
  onViewDetail: (id: string) => void;
}) {
  if (isLoading)
    return (
      <div className="p-32 text-center flex flex-col items-center gap-4 text-slate-200 uppercase italic font-black text-[10px] tracking-[0.3em]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-950 mb-4"></div>
        Đang tải...
      </div>
    );

  if (items.length === 0)
    return (
      <div className="p-32 text-center flex flex-col items-center gap-4 text-slate-200 uppercase italic font-black text-[10px] tracking-[0.3em]">
        <InboxIcon className="h-10 w-10 opacity-20" />
        Không tìm thấy khiếu nại nào
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
      </div>
    );

  return (
<<<<<<< HEAD
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
=======
    <div className="w-full overflow-hidden">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
          <tr>
            <th className="px-6 py-5 border-b border-slate-100 w-[22%]">
              Ngày nhận
            </th>
            <th className="px-6 py-5 border-b border-slate-100 w-[38%]">
              Shipment ID
            </th>
            <th className="px-6 py-5 border-b border-slate-100 text-center w-[20%]">
              Trạng thái
            </th>
            <th className="px-6 py-5 border-b border-slate-100 text-right w-[20%]">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((claim) => (
            <tr
              key={claim.claimId}
              className="group hover:bg-black transition-all duration-300"
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
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
<<<<<<< HEAD
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
=======
              </td>

              <td className="px-6 py-6">
                <span className="font-black text-black group-hover:text-white uppercase tracking-tighter text-[11px] line-clamp-1">
                  {claim.shipmentId}
                </span>
              </td>

              <td className="px-6 py-6 text-center">
                <div className="flex justify-center">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter transition-all
                    ${claim.status === "approved"
                        ? "bg-green-50 text-green-700 group-hover:bg-green-600 group-hover:text-white"
                        : claim.status === "pending"
                          ? "bg-orange-50 text-orange-700 group-hover:bg-orange-600 group-hover:text-white"
                          : "bg-red-50 text-red-700 group-hover:bg-red-600 group-hover:text-white"
                      }`}
                  >
                    {claim.status}
                  </span>
                </div>
              </td>

              <td className="px-6 py-6 text-right">
                <button
                  onClick={() => onViewDetail(claim.claimId)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95"
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
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
