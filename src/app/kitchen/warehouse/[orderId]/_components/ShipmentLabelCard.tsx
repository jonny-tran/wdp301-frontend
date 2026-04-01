import { FileText } from "lucide-react";
import type { ShipmentLabel } from "@/types/warehouse";
import { cn } from "@/lib/utils";

interface ShipmentLabelCardProps {
    shipmentId: string;
    isLoading: boolean;
    isError: boolean;
    labelData: ShipmentLabel | undefined;
    className?: string;
}

export default function ShipmentLabelCard({
    shipmentId,
    isLoading,
    isError,
    labelData,
    className,
}: ShipmentLabelCardProps) {
    const items = labelData?.items || [];
    const preview = items.slice(0, 5);

    return (
        <div
            className={cn(
                "rounded-3xl border border-zinc-200/90 bg-gradient-to-b from-white to-zinc-50/80 p-5 shadow-sm ring-1 ring-zinc-100",
                className,
            )}
        >
            <div className="mb-4 flex items-center gap-2 border-b border-zinc-100 pb-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-zinc-900 text-white">
                    <FileText className="size-4" aria-hidden />
                </span>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wide text-zinc-800">Nhãn vận chuyển</h3>
                    <p className="text-xs text-zinc-500">Xem nhanh trước khi chốt đơn</p>
                </div>
            </div>

            {!shipmentId ? (
                <p className="text-sm text-zinc-500">Chưa có mã shipment từ chi tiết đơn.</p>
            ) : isLoading ? (
                <p className="text-sm text-zinc-500">Đang tải nhãn…</p>
            ) : isError ? (
                <p className="text-sm font-medium text-red-600">Không tải được nhãn. Bạn vẫn có thể soạn và chốt xuất kho.</p>
            ) : labelData ? (
                <div className="space-y-4 text-sm">
                    <div className="space-y-1 rounded-xl bg-white/80 px-3 py-2 ring-1 ring-zinc-100">
                        <p className="font-semibold text-zinc-900">{labelData.storeName}</p>
                        <p className="text-xs text-zinc-500">
                            Mẫu in: <span className="font-mono font-medium text-zinc-700">{labelData.templateType || "—"}</span>
                        </p>
                        <p className="text-xs font-bold text-zinc-600">{items.length} dòng hàng trên nhãn</p>
                    </div>
                    {preview.length > 0 ? (
                        <ul className="max-h-48 space-y-2 overflow-y-auto text-xs">
                            {preview.map((it, i) => {
                                const q = it.quantity ?? it.qty;
                                return (
                                    <li key={i} className="flex justify-between gap-2 rounded-lg bg-white px-2 py-1.5 ring-1 ring-zinc-100">
                                        <span className="min-w-0 flex-1 truncate font-medium text-zinc-800">{it.productName}</span>
                                        <span className="shrink-0 font-mono text-zinc-600">{it.batchCode}</span>
                                        {q != null && q !== "" ? (
                                            <span className="shrink-0 font-bold tabular-nums text-zinc-900">{String(q)}</span>
                                        ) : null}
                                    </li>
                                );
                            })}
                            {items.length > preview.length ? (
                                <li className="px-2 text-center text-zinc-400">+{items.length - preview.length} dòng khác…</li>
                            ) : null}
                        </ul>
                    ) : (
                        <p className="text-xs text-zinc-500">Chưa có dòng chi tiết trên nhãn.</p>
                    )}
                </div>
            ) : null}
        </div>
    );
}
