"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInventory } from "@/hooks/useInventory";
import { cn } from "@/lib/utils";
import type { KitchenBatchRow, KitchSummary } from "@/types/inventory";
import {
  ChevronDown,
  ChevronRight,
  Package,
  SlidersHorizontal,
} from "lucide-react";
import { Fragment, useCallback } from "react";
import BatchDetailTable from "./BatchDetailTable";

function KitchenExpandBatches({
  productId,
  unit,
  onAdjust,
  onWaste,
}: {
  productId: number;
  unit: string;
  onAdjust: (batch: KitchenBatchRow) => void;
  onWaste?: (batch: KitchenBatchRow) => void;
}) {
  const { kitchenDetails } = useInventory();
  const q = kitchenDetails(productId);
  return (
    <BatchDetailTable
      batches={q.data?.batches ?? []}
      isLoading={q.isLoading}
      isError={q.isError}
      unit={unit}
      onAdjust={onAdjust}
      onWaste={onWaste}
    />
  );
}

interface InventorySummaryTableProps {
  items: KitchSummary[];
  expandedProductIds: Set<number>;
  onToggleExpand: (productId: number) => void;
  onAdjustBatch: (payload: {
    productId: number;
    productName: string;
    unit: string;
    batch: KitchenBatchRow;
  }) => void;
  onReportWasteBatch?: (payload: { productId: number; productName: string; unit: string; batch: KitchenBatchRow }) => void;
  onAdjustProduct: (product: KitchSummary) => void;
  isLoading: boolean;
  isError: boolean;
}

export default function InventorySummaryTable({
  items,
  expandedProductIds,
  onToggleExpand,
  onAdjustBatch,
  onReportWasteBatch,
  onAdjustProduct,
  isLoading,
  isError,
}: InventorySummaryTableProps) {
  const handleAdjustFromSubtable = useCallback(
    (product: KitchSummary, batch: KitchenBatchRow) => {
      onAdjustBatch({
        productId: product.productId,
        productName: product.productName,
        unit: product.unit,
        batch,
      });
    },
    [onAdjustBatch],
  );

  if (isLoading) {
    return (
      <p className="px-6 py-10 text-center text-sm text-zinc-500">
        Đang tải bảng tồn kho…
      </p>
    );
  }

  if (isError) {
    return (
      <p className="px-6 py-10 text-center text-sm text-red-600">
        Không tải được dữ liệu tổng quan bếp.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="px-6 py-10 text-center text-sm text-zinc-500">
        Không có dòng nào khớp bộ lọc.
      </p>
    );
  }

  const colSpan = 10;

  return (
    <div className="px-2 pb-2 sm:px-4">
      <p className="mb-3 px-2 text-xs text-zinc-500">
        <span className="font-medium text-zinc-700">Quy ước tồn:</span> Vật lý =
        Khả dụng + Đặt trước (theo từng lô, FEFO theo HSD).
      </p>
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-200 hover:bg-transparent">
            <TableHead className="w-10" />
            <TableHead className="font-semibold text-zinc-700">
              Sản phẩm
            </TableHead>
            <TableHead className="font-semibold text-zinc-700">
              Đơn vị
            </TableHead>
            <TableHead className="text-right font-semibold text-zinc-700">
              Vật lý
            </TableHead>
            <TableHead className="text-right font-semibold text-zinc-700">
              Khả dụng
            </TableHead>
            <TableHead className="text-right font-semibold text-zinc-700">
              Đặt trước
            </TableHead>
            <TableHead className="text-center font-semibold text-zinc-700">
              Trạng thái
            </TableHead>
            <TableHead className="w-[200px] text-right font-semibold text-zinc-700">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const expanded = expandedProductIds.has(item.productId);
            const physical = item.totalPhysical;
            const available = item.availableQuantity;
            const reserved = item.totalReserved;
            const low = item.isLowStock;
            const out = physical <= 0;

            return (
              <Fragment key={item.productId}>
                <TableRow
                  className={cn(
                    "border-zinc-100 transition-colors",
                    expanded && "bg-zinc-50",
                    !expanded && "hover:bg-zinc-50",
                  )}
                >
                  <TableCell className="align-middle">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      onClick={() => onToggleExpand(item.productId)}
                      aria-expanded={expanded}
                      aria-label={expanded ? "Thu gọn lô" : "Xem lô"}
                    >
                      {expanded ? (
                        <ChevronDown className="size-4 text-zinc-500" />
                      ) : (
                        <ChevronRight className="size-4 text-zinc-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-zinc-400">
                            <Package className="size-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-zinc-900">
                          {item.productName}
                        </p>
                        <p className="font-mono text-xs text-amber-700">
                          {item.sku}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-500">{item.unit}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium text-zinc-900">
                    {physical}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-700">
                    {available}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-zinc-500">
                    {reserved}
                  </TableCell>
                  <TableCell className="text-center">
                    {out ? (
                      <Badge variant="destructive" className="text-[10px]">
                        Hết hàng
                      </Badge>
                    ) : low ? (
                      <Badge
                        variant="secondary"
                        className="border-amber-200 bg-amber-50 text-[10px] text-amber-900"
                      >
                        Tồn thấp
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 text-[10px] text-emerald-800"
                      >
                        Đủ hàng
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 border-zinc-300 bg-white text-xs text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900"
                        onClick={() => onToggleExpand(item.productId)}
                      >
                        {expanded ? "Ẩn lô" : "Xem lô"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => onAdjustProduct(item)}
                      >
                        <SlidersHorizontal className="size-3.5" />
                        Điều chỉnh
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expanded && (
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableCell colSpan={colSpan} className="p-0">
                      <KitchenExpandBatches
                        productId={item.productId}
                        unit={item.unit}
                        onAdjust={(batch) =>
                          handleAdjustFromSubtable(item, batch)
                        }
                        onWaste={
                          onReportWasteBatch
                            ? (batch) =>
                                onReportWasteBatch({
                                  productId: item.productId,
                                  productName: item.productName,
                                  unit: item.unit,
                                  batch,
                                })
                            : undefined
                        }
                      />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
