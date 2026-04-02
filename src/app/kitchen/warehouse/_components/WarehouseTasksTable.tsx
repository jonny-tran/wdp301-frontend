"use client";

import Can from "@/components/shared/Can";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { P } from "@/lib/authz";
import type { PickingTaskListItem } from "@/types/warehouse";
import { Resource } from "@/utils/constant";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CancelPickingTaskDialog from "./CancelPickingTaskDialog";

interface WarehouseTasksTableProps {
  tasks: PickingTaskListItem[];
  rowStart: number;
  isLoading: boolean;
  isError: boolean;
  isResetting: boolean;
  onReset: (orderId: string) => void;
}

function canCancelWarehouseTask(task: PickingTaskListItem): boolean {
  const s = task.status?.trim().toUpperCase();
  return s === "APPROVED" || s === "PICKING";
}

function formatCreatedAt(iso: string | undefined) {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: vi });
  } catch {
    return String(iso).slice(0, 16);
  }
}

export default function WarehouseTasksTable({
  tasks,
  rowStart,
  isLoading,
  isError,
  isResetting,
  onReset,
}: WarehouseTasksTableProps) {
  const router = useRouter();
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

  const goDetail = (orderId: string) => {
    if (!orderId) return;
    router.push(`/kitchen/warehouse/${orderId}`);
  };

  return (
    <div className="w-full overflow-x-auto">
      <CancelPickingTaskDialog
        open={cancelOrderId != null}
        onOpenChange={(open) => {
          if (!open) setCancelOrderId(null);
        }}
        orderId={cancelOrderId ?? ""}
        title="Hủy tác vụ soạn hàng"
      />
      <Table>
        <TableHeader>
          <TableRow className="border-b border-zinc-200 bg-zinc-50 hover:bg-zinc-50">
            <TableHead className="w-16 font-semibold text-zinc-500">STT</TableHead>
            <TableHead className="font-semibold text-zinc-500">Mã đơn</TableHead>
            <TableHead className="font-semibold text-zinc-500">
              Cửa hàng đích
            </TableHead>
            <TableHead className="text-right font-semibold text-zinc-500">
              Tổng mặt hàng
            </TableHead>
            <TableHead className="font-semibold text-zinc-500">Ngày tạo</TableHead>
            <TableHead className="text-right font-semibold text-zinc-500">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-zinc-500"
              >
                Đang tải danh sách tác vụ kho…
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center font-medium text-red-500"
              >
                Không tải được danh sách. Vui lòng thử lại.
              </TableCell>
            </TableRow>
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-zinc-500">
                Hiện không có đơn chờ soạn hàng
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task, index) => {
              const oid = task.orderId || task.id || "";
              return (
                <TableRow
                  key={oid || String(index)}
                  className="cursor-pointer border-zinc-100 transition-colors hover:bg-zinc-100 data-[state=selected]:bg-muted"
                  role="button"
                  tabIndex={0}
                  onClick={() => goDetail(oid)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goDetail(oid);
                    }
                  }}
                >
                  <TableCell className="font-semibold tabular-nums text-zinc-900">
                    {rowStart + index + 1}
                  </TableCell>
                  <TableCell className="font-mono font-semibold text-amber-700">
                    {oid || "—"}
                  </TableCell>
                  <TableCell className="text-zinc-800">
                    {task.storeName ?? "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-zinc-900">
                    {task.totalItems ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {formatCreatedAt(task.createdAt)}
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="ml-auto inline-flex max-w-full flex-wrap items-center justify-end gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50/90 p-1 shadow-sm backdrop-blur-[2px] dark:border-zinc-700 dark:bg-zinc-900/80">
                      <Can
                        I={P.WAREHOUSE_CANCEL_PICKING_TASK}
                        on={Resource.WAREHOUSE}
                      >
                        {canCancelWarehouseTask(task) ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:hover:bg-red-950/50"
                            onClick={() => setCancelOrderId(oid)}
                          >
                            Hủy
                          </Button>
                        ) : null}
                      </Can>
                      <Can
                        I={P.WAREHOUSE_RESET_PICKING}
                        on={Resource.WAREHOUSE}
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          disabled={isResetting}
                          onClick={() => onReset(oid)}
                        >
                          Reset
                        </Button>
                      </Can>
                      <Button
                        type="button"
                        size="sm"
                        className="bg-amber-600 text-white hover:bg-amber-700"
                        onClick={() => goDetail(oid)}
                      >
                        Soạn hàng
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
