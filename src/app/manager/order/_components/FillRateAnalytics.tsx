"use client";

import { useOrder } from "@/hooks/useOrder";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function FillRateAnalytics() {
  const searchParams = useSearchParams();

  // 1. Lấy đúng các param từ URL theo định dạng API
  const storeId = searchParams.get("storeId") || "";
  const from = searchParams.get("fromDate") || "";
  const to = searchParams.get("toDate") || "";

  const { fillRateAnalytics } = useOrder();

  // 2. Fetch dữ liệu Analytics
  const { data: analyticsRes, isLoading } = fillRateAnalytics({
    storeId,
    from,
    to,
  });

  const res = analyticsRes as Record<string, unknown> | undefined;
  const data = res?.data as Record<string, unknown> | undefined;
  const shortfallData = (data?.shortfallAnalysis || res?.shortfallAnalysis || []) as Record<string, unknown>[];

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      {/* Header của bảng Analytics */}
      <div className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex items-center gap-3">
        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 stroke-[2.5px]" />
        <div>
          <h3 className="text-lg font-black font-display tracking-wider uppercase text-text-main">
            Phân tích <span className="text-red-500">Thiếu hụt hàng hóa</span>
          </h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            Dữ liệu thống kê lý do đơn hàng không được đáp ứng
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/30">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="pl-10 text-[10px] font-black uppercase text-slate-400 italic py-6">
                Nguyên nhân (Reason)
              </TableHead>
              <TableHead className="text-right pr-10 text-[10px] font-black uppercase text-slate-400 italic py-6">
                Số lượng hụt (Shortfall Qty)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="py-20 text-center text-[10px] font-bold text-slate-300 uppercase italic animate-pulse"
                >
                  Đang tải dữ liệu phân tích...
                </TableCell>
              </TableRow>
            ) : shortfallData.length > 0 ? (
              shortfallData.map((item: Record<string, unknown>, idx: number) => (
                <TableRow
                  key={idx}
                  className="border-slate-50 hover:bg-slate-50/50 transition-colors group"
                >
                  <TableCell className="pl-10 py-6">
                    <span className="text-[11px] font-bold text-slate-700 uppercase italic group-hover:text-primary transition-colors">
                      {String(item.reason || "N/A")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-10 py-6">
                    <span className="text-base font-black text-slate-900 italic">
                      -{Number(item.shortfallQuantity || 0).toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="py-20 text-center text-[10px] font-bold text-slate-300 uppercase italic"
                >
                  Không có dữ liệu thất thoát trong khoảng thời gian này
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer bảng Analytics */}
      <div className="bg-slate-50/50 px-10 py-4 border-t border-slate-50 text-right">
        <span className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest">
          Supply Chain Analytics • {new Date().toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
