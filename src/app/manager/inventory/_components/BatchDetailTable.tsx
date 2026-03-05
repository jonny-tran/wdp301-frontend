"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";

export default function BatchDetailTable({ details }: { details: any[] }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      <div className="bg-slate-50/50 px-8 py-5 border-b flex justify-between items-center">
        <h3 className="text-sm font-black uppercase italic tracking-widest text-slate-900">
          Chi tiết <span className="text-indigo-600">Lô hàng (Batches)</span>
        </h3>
        <Badge variant="outline" className="rounded-full border-slate-200 text-[10px] font-bold">
          {details.length} Lô tồn kho
        </Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="pl-8 text-[9px] font-black uppercase text-slate-400 py-4">Mã lô (Batch Code)</TableHead>
            <TableHead className="text-[9px] font-black uppercase text-slate-400 py-4 text-center">Ngày hết hạn</TableHead>
            <TableHead className="text-right text-[9px] font-black uppercase text-slate-400 py-4">Thực tế</TableHead>
            <TableHead className="text-right text-[9px] font-black uppercase text-slate-400 py-4">Đã giữ</TableHead>
            <TableHead className="text-right pr-8 text-[9px] font-black uppercase text-slate-400 py-4">Khả dụng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details.map((batch, idx) => {
            const expired = isPast(new Date(batch.expiry_date)); // Kiểm tra hết hạn
            
            return (
              <TableRow key={idx} className={cn("border-slate-50 group transition-colors", expired ? "bg-red-50/30" : "hover:bg-slate-50/50")}>
                <TableCell className="pl-8 py-4 font-bold text-slate-700 text-[11px] uppercase tracking-tighter">
                  {batch.batch_code}
                  {expired && <Badge className="ml-2 bg-red-500 text-[8px] uppercase">Quá hạn</Badge>}
                </TableCell>
                <TableCell className="text-center py-4">
                   <span className={cn("text-[10px] font-black italic", expired ? "text-red-500" : "text-slate-500")}>
                    {format(new Date(batch.expiry_date), "dd/MM/yyyy")}
                   </span>
                </TableCell>
                <TableCell className="text-right py-4 font-bold text-slate-400">{batch.physical}</TableCell>
                <TableCell className="text-right py-4 font-bold text-amber-500">{batch.reserved}</TableCell>
                <TableCell className="text-right pr-8 py-4">
                  <span className="text-sm font-black text-slate-900 italic">
                    {batch.available}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}