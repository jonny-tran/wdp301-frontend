"use client";

import { useInventory } from "@/hooks/useInventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isPast } from "date-fns";
import { cn } from "@/lib/utils";

interface KitchenBatchDetailsProps {
  productId: number;
  onBack?: () => void;
  embedded?: boolean;
}

export default function KitchenBatchDetails({
  productId,
  onBack,
  embedded = false,
}: KitchenBatchDetailsProps) {
  const { kitchenDetails } = useInventory();
  const { data, isLoading } = kitchenDetails(productId);

  // FEFO ưu tiên: sắp xếp lô theo ngày hết hạn tăng dần
  const batches = [...(data?.batches || [])].sort((a, b) => {
    const aTime = new Date(a.expiryDate).getTime();
    const bTime = new Date(b.expiryDate).getTime();
    return aTime - bTime;
  });

  return (
    <div className={embedded ? "space-y-4" : "space-y-6"}>
      {!embedded && (
        <div className="flex justify-between items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold uppercase italic text-slate-400 hover:text-primary"
            >
              ← Quay lại
            </button>
          )}
          <h2 className="text-xl font-black uppercase italic tracking-tighter">
            Lô hàng:{" "}
            <span className="text-primary">
              {data?.productName || "Đang tải..."}
            </span>
          </h2>
        </div>
      )}

      <div
        className={
          embedded
            ? "bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden max-h-[320px] overflow-y-auto"
            : "bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden"
        }
      >
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-[10px] font-black uppercase py-4">
                Mã lô
              </TableHead>
              <TableHead className="text-center text-[10px] font-black uppercase">
                Hết hạn
              </TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase">
                Thực tế
              </TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase">
                Dự trữ
              </TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase pr-10">
                Khả dụng
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-20 text-center animate-pulse italic font-bold"
                >
                  Đang tải dữ liệu lô hàng...
                </TableCell>
              </TableRow>
            ) : batches.length > 0 ? (
              batches.map((batch, idx) => {
                const expired = isPast(new Date(batch.expiryDate));
                return (
                  <TableRow
                    key={idx}
                    className={cn(
                      expired ? "bg-red-50/50" : "hover:bg-slate-50",
                    )}
                  >
                    <TableCell className="font-bold py-6">
                      {batch.batchCode}
                      {expired && (
                        <Badge className="ml-2 bg-red-500 text-[8px]">
                          HẾT HẠN
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center italic text-slate-500 font-bold">
                      {format(new Date(batch.expiryDate), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-400">
                      {batch.totalQuantity}
                    </TableCell>
                    <TableCell className="text-right font-bold text-amber-500">
                      {batch.reservedQuantity}
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <span className="text-base font-black italic">
                        {batch.availableQuantity}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-20 text-center text-slate-400 italic"
                >
                  Không tìm thấy thông tin lô hàng.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
