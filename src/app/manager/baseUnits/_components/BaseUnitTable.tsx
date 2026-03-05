"use client";

<<<<<<< HEAD
import { BaseUnitRow } from "./base-unit.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PencilSquareIcon, // Đảm bảo đã import icon này
  TrashIcon,
  InboxStackIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

interface Props {
  data: BaseUnitRow[];
  onEdit: (id: number) => void;
=======
import {
  PencilSquareIcon,
  TrashIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { BaseUnit } from "@/types/base-unit";

interface BaseUnitTableProps {
  items: BaseUnit[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (unit: BaseUnit) => void;
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
  onDelete: (id: number) => void;
}

export default function BaseUnitTable({ data, onEdit, onDelete }: Props) {
  // Logic kiểm tra dữ liệu để tránh lỗi length
  if (!data || data.length === 0) {
    return (
      <div className="p-32 text-center flex flex-col items-center gap-4 animate-in fade-in">
        <InboxStackIcon className="w-12 h-12 text-slate-200 stroke-[1.5px]" />
        <p className="font-black text-slate-300 italic uppercase text-[10px] tracking-[0.3em]">
          Hệ thống chưa ghi nhận đơn vị tính nào
        </p>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <Table>
      <TableHeader className="bg-slate-50/50">
        <TableRow className="border-none hover:bg-transparent">
          <TableHead className="pl-10 text-[10px] font-black uppercase text-slate-400 py-8 tracking-widest italic w-100px">
            No.
          </TableHead>
          <TableHead className="text-[10px] font-black uppercase text-slate-400 py-8 tracking-widest italic">
            Tên đơn vị
          </TableHead>
          <TableHead className="text-[10px] font-black uppercase text-slate-400 py-8 tracking-widest italic">
            Mô tả chi tiết
          </TableHead>
          <TableHead className="text-right pr-10 text-[10px] font-black uppercase text-slate-400 py-8 tracking-widest italic w-150px">
            Thao tác
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={row.id}
            className="border-slate-50 hover:bg-slate-50/50 transition-all duration-300 group"
          >
            <TableCell className="pl-10 py-8 font-black italic text-slate-300 group-hover:text-indigo-600 transition-colors">
              {row.no}
            </TableCell>
            <TableCell className="py-8">
              <span className="text-sm font-black uppercase italic text-slate-950 tracking-tighter leading-none">
                {row.name}
              </span>
            </TableCell>
            <TableCell className="py-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">
                {row.description}
              </span>
            </TableCell>
            <TableCell className="text-right pr-10 py-8">
              <div className="flex justify-end gap-3">
                {/* NÚT EDIT: Sửa lỗi hiển thị icon */}
                <Button
                  onClick={() => onEdit(row.id)}
                  className="p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-950 text-slate-400 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <PencilSquareIcon className="w-4 h-4 stroke-[2.5px]" />
                </Button>
                {/* NÚT DELETE */}
                <Button
                  onClick={() => onDelete(row.id)}
                  className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <TrashIcon className="w-4 h-4 stroke-[2.5px]" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
=======
    <div className="overflow-x-auto px-1 pb-4">
      <table className="w-full text-left text-sm border-separate border-spacing-0">
        <thead className="bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <tr>
            <th className="px-10 py-5 border-b border-slate-100">
              Đơn vị tính
            </th>
            <th className="px-10 py-5 border-b border-slate-100">
              Mô tả chi tiết
            </th>
            <th className="px-10 py-5 border-b border-slate-100 text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {items.map((item) => (
            <tr
              key={item.id}
              className="group border-l-4 border-l-transparent hover:border-l-blue-600 hover:bg-slate-900 transition-all duration-300 ease-in-out"
            >
              <td className="px-10 py-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-800 transition-colors shadow-sm">
                    <InboxIcon className="h-6 w-6 text-slate-400 group-hover:text-white" />
                  </div>
                  <span className="font-black text-slate-900 uppercase italic group-hover:text-white transition-colors tracking-tighter text-lg">
                    {item.name}
                  </span>
                </div>
              </td>
              <td className="px-10 py-6 font-bold text-slate-500 group-hover:text-slate-400 transition-colors italic">
                {item.description || "N/A"}
              </td>
              <td className="px-10 py-6 text-right">
                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-3 bg-white/10 text-white hover:bg-blue-600 rounded-xl transition-all shadow-sm"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-3 bg-white/10 text-white hover:bg-red-600 rounded-xl transition-all shadow-sm"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
  );
}
