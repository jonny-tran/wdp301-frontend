import { InboxArrowDownIcon, TrashIcon, TruckIcon, CalendarDaysIcon, CubeIcon } from "@heroicons/react/24/outline";
import InboundStatusBadge from "./InboundStatusBadge";
import { ReceiptStatus } from "@/utils/enum";
import type { Receipt, ReceiptItem } from "@/types/inbound";
import { useMemo } from "react";
import { useProduct } from "@/hooks/useProduct";
import { unwrapProductListRows } from "@/lib/unwrap-product-list";
import {
    coalesceReceiptLineProductLabel,
    receiptItems,
    receiptLineApiProductName,
    receiptLineProductId,
} from "@/lib/inbound-receipt-utils";
import type { Product } from "@/types/product";

interface InboundDraftBoardProps {
    drafts: Receipt[];
    isLoading: boolean;
    isError: boolean;
    onSelect: (receiptId: string, receiptCode: string) => void;
    onDelete?: (receiptId: string) => void;
}

function formatDraftLineSummary(item: ReceiptItem, productById: Map<number, Product>): string {
    const pid = receiptLineProductId(item);
    const fromCat = pid !== undefined ? productById.get(pid) : undefined;
    const name = coalesceReceiptLineProductLabel(receiptLineApiProductName(item), fromCat?.name);
    const qty = item.expectedQuantity ?? item.quantityAccepted ?? item.quantity;
    if (qty != null && Number.isFinite(Number(qty))) {
        return `${name} · ${qty}`;
    }
    return name;
}

export default function InboundDraftBoard({
    drafts,
    isLoading,
    isError,
    onSelect,
    onDelete,
}: InboundDraftBoardProps) {
    const { productList } = useProduct();
    const productsQuery = productList(
        { page: 1, limit: 1000, sortOrder: "ASC" },
        { enabled: drafts.length > 0 },
    );
    const productById = useMemo(() => {
        const rows = unwrapProductListRows(productsQuery.data);
        const m = new Map<number, Product>();
        for (const p of rows) {
            if (p?.id != null) m.set(p.id, p);
        }
        return m;
    }, [productsQuery.data]);

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-zinc-100 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                        <InboxArrowDownIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-zinc-900">Phiếu nháp chờ xử lý</h3>
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 tabular-nums">
                                {drafts.length}
                            </span>
                        </div>
                        <p className="mt-0.5 text-sm text-zinc-500">
                            Chọn phiếu để kiểm đếm và xác nhận hàng về.
                        </p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
                            <span className="text-sm text-zinc-500">Đang tải phiếu nháp...</span>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="rounded-xl bg-red-50 p-6 text-center">
                        <p className="text-sm font-medium text-red-600">Không thể tải danh sách phiếu nháp.</p>
                    </div>
                ) : drafts.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-zinc-200 py-12 text-center">
                        <InboxArrowDownIcon className="mx-auto h-8 w-8 text-zinc-300" />
                        <p className="mt-2 text-sm text-zinc-400">Không có phiếu nháp nào.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {drafts.map((receipt, index) => {
                            const id = String(receipt.receiptId ?? receipt.id ?? index);
                            const code = receipt.receiptCode ?? `REC-${index + 1}`;
                            const supplierName = receipt.supplierName ?? receipt.supplier?.name ?? "Không rõ NCC";
                            const lineItems = receiptItems(receipt);
                            const linePreview =
                                lineItems.length > 0
                                    ? lineItems
                                          .slice(0, 3)
                                          .map((it) => formatDraftLineSummary(it, productById))
                                          .join(" · ")
                                    : null;
                            const moreLines = lineItems.length > 3 ? ` (+${lineItems.length - 3})` : "";

                            return (
                                <div
                                    key={id}
                                    onClick={() => onSelect(id, code)}
                                    className="group flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 cursor-pointer transition-all hover:border-amber-200 hover:bg-white hover:shadow-sm"
                                >
                                    {/* Left: Info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-[11px] font-bold text-zinc-600">
                                                #{id.slice(0, 8).toUpperCase()}
                                            </span>
                                            <InboundStatusBadge status={ReceiptStatus.DRAFT} />
                                        </div>
                                        <div className="mt-1.5 flex items-center gap-1.5 text-zinc-500">
                                            <TruckIcon className="h-3.5 w-3.5 shrink-0" />
                                            <span className="truncate text-sm font-medium text-zinc-700">{supplierName}</span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-1.5 text-zinc-400">
                                            <CalendarDaysIcon className="h-3 w-3 shrink-0" />
                                            <span className="text-xs">{new Date(receipt.createdAt).toLocaleDateString("vi-VN")}</span>
                                            {receipt.note && (
                                                <>
                                                    <span className="text-zinc-300">·</span>
                                                    <span className="truncate text-xs italic text-zinc-400">{receipt.note}</span>
                                                </>
                                            )}
                                        </div>
                                        {linePreview && (
                                            <div className="mt-2 flex items-start gap-1.5 text-zinc-600">
                                                <CubeIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
                                                <span className="line-clamp-2 text-xs font-medium leading-snug">
                                                    {linePreview}
                                                    {moreLines}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Delete button */}
                                    {onDelete && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(id);
                                            }}
                                            className="shrink-0 rounded-lg border border-transparent p-2 text-zinc-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                            title="Xóa phiếu nháp"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
