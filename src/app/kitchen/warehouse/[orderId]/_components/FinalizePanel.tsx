"use client";

import { Truck } from "lucide-react";
import Can from "@/components/shared/Can";
import { Button } from "@/components/ui/button";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";
import { cn } from "@/lib/utils";

export type FinalizePanelProps = {
    disabled: boolean;
    isPending: boolean;
    onFinalize: () => void;
    storeName?: string;
    shipmentId?: string;
    totalVerifiedUnits: number;
    /** Từ chối / hủy task soạn (sự cố kho) */
    onReject?: () => void;
    rejectDisabled?: boolean;
    isRejectPending?: boolean;
};

export default function FinalizePanel({
    disabled,
    isPending,
    onFinalize,
    storeName,
    shipmentId,
    totalVerifiedUnits,
    onReject,
    rejectDisabled,
    isRejectPending,
}: FinalizePanelProps) {
    return (
        <div className="rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-[4px_4px_0_0_rgb(24_24_27)]">
            <div className="mb-4 flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-emerald-600/30 bg-emerald-50">
                    <Truck className="size-6 text-emerald-700" aria-hidden />
                </span>
                <div>
                    <h3 className="text-lg font-black text-zinc-950">Chốt đơn &amp; Xuất kho</h3>
                    <p className="mt-1 text-sm font-medium text-zinc-600">
                        {shipmentId ? (
                            <>
                                Shipment: <span className="font-mono font-bold text-zinc-900">{shipmentId}</span>
                                {storeName ? (
                                    <>
                                        {" "}
                                        · Đích: <span className="font-semibold text-zinc-900">{storeName}</span>
                                    </>
                                ) : null}
                            </>
                        ) : (
                            "Chưa có mã shipment — vẫn có thể chốt nếu API cho phép."
                        )}
                    </p>
                    <p className="mt-2 text-sm font-bold tabular-nums text-zinc-800">
                        Tổng đơn vị đã xác nhận lấy: {totalVerifiedUnits}
                    </p>
                </div>
            </div>

            <p
                className={cn(
                    "mb-4 rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold leading-relaxed text-amber-950",
                )}
            >
                Lưu ý: Phần hàng thiếu sẽ bị <strong>HỦY</strong> (không treo đơn nợ) theo nguyên tắc{" "}
                <strong>No Backorders</strong>.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                {onReject ? (
                    <Can I={P.WAREHOUSE_CANCEL_PICKING_TASK} on={Resource.WAREHOUSE}>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-14 min-h-[56px] shrink-0 border-2 border-red-300 font-black text-red-700 hover:bg-red-50 sm:min-w-[200px]"
                            disabled={rejectDisabled || isRejectPending}
                            onClick={onReject}
                        >
                            {isRejectPending ? "Đang xử lý…" : "Từ chối thực hiện"}
                        </Button>
                    </Can>
                ) : null}
                <div className="min-w-0 flex-1">
                    <Can I={P.WAREHOUSE_CREATE_SHIPMENT} on={Resource.WAREHOUSE}>
                        <Button
                            type="button"
                            disabled={disabled || isPending}
                            className="h-14 min-h-[56px] w-full border-2 border-emerald-800 bg-emerald-600 text-base font-black text-white hover:bg-emerald-700 disabled:opacity-50"
                            onClick={onFinalize}
                        >
                            {isPending ? "Đang xử lý…" : "Hoàn tất & Xuất kho"}
                        </Button>
                    </Can>
                </div>
            </div>
        </div>
    );
}
