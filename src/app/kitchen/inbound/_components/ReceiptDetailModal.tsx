"use client";

import {
    XMarkIcon,
    CubeIcon,
    TagIcon,
    ScaleIcon,
    CalendarIcon,
    TruckIcon,
    PlusIcon,
    TrashIcon,
    CheckCircleIcon,
    PrinterIcon,
    QrCodeIcon,
    EyeSlashIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";
import { useInbound } from "@/hooks/useInbound";
import { useProduct } from "@/hooks/useProduct";
import {
    acceptedQty,
    getReceiptId,
    isDraftLinePendingBatch,
    receiptItems,
    receiptLineDeleteId,
} from "@/lib/inbound-receipt-utils";
import { ReceiptStatus } from "@/utils/enum";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { inboundRequest } from "@/apiRequest/inbound";
import type { CompleteInboundReceiptResult, InboundCompletedBatchLine } from "@/types/inbound";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddReceiptItemBody, AddReceiptItemBodyType } from "@/schemas/inbound";
import { handleErrorApi } from "@/lib/errors";
import { requiresStatedExpiryForInbound } from "@/lib/inbound-product-rules";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { Receipt, ReceiptItem } from "@/types/inbound";

function escapeHtmlInbound(s: string) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

interface ReceiptDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiptId: string | null;
    receiptCode: string;
}

export default function ReceiptDetailModal({
    isOpen,
    onClose,
    receiptId,
    receiptCode,
}: ReceiptDetailModalProps) {
    const [omitExpected, setOmitExpected] = useState(false);
    const { receiptDetail, addReceiptItem, deleteReceiptItem, completeReceipt, reprintBatch, batchLabel } =
        useInbound();
    const detailQuery = receiptDetail(receiptId ?? "", { omitExpected });
    const details = detailQuery.data as Receipt | undefined;

    const { productList } = useProduct();
    const productsQuery = productList({ page: 1, limit: 300, sortOrder: "ASC" });

    const [isAddingItem, setIsAddingItem] = useState(false);
    const {
        register,
        handleSubmit,
        reset: resetForm,
        setError: setErrorForm,
        setValue,
        watch,
        formState: { errors: formErrors },
    } = useForm<AddReceiptItemBodyType>({
        resolver: zodResolver(AddReceiptItemBody) as import("react-hook-form").Resolver<AddReceiptItemBodyType>,
    });

    const addFormExpected = watch("expectedQuantity");
    const addFormProductId = watch("productId");

    useEffect(() => {
        if (!isAddingItem || !isOpen) return;
        const exp = Number(addFormExpected);
        if (Number.isFinite(exp) && exp > 0) {
            setValue("quantity", exp, { shouldValidate: false, shouldDirty: false });
        }
    }, [addFormExpected, isAddingItem, isOpen, setValue]);

    const [viewingBatchId, setViewingBatchId] = useState<string | null>(null);
    const labelQuery = batchLabel(viewingBatchId || "");

    const [postComplete, setPostComplete] = useState<CompleteInboundReceiptResult | null>(null);
    const [printingAll, setPrintingAll] = useState(false);
    /** key = receipt line id (itemId / receiptItemId / id) */
    const [lineEdits, setLineEdits] = useState<Record<string, { accepted: string; statedExpiry: string }>>({});

    useEffect(() => {
        if (!isOpen) {
            setOmitExpected(false);
            setIsAddingItem(false);
            setViewingBatchId(null);
            setPostComplete(null);
            setLineEdits({});
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isAddingItem || !isOpen) {
            resetForm({
                productId: undefined,
                expectedQuantity: undefined,
                quantity: undefined,
                quantityAccepted: undefined,
                quantityRejected: undefined,
                rejectionReason: "",
                manufacturedDate: "",
                statedExpiryDate: "",
            });
        }
    }, [isAddingItem, isOpen, resetForm]);

    const rid = getReceiptId(details);
    const isDraft =
        details?.status === ReceiptStatus.DRAFT || String(details?.status ?? "").toLowerCase() === "draft";
    const items = receiptItems(details);

    const receiptLineIdsKey = useMemo(
        () =>
            (details?.items ?? [])
                .map((it) => String(receiptLineDeleteId(it as ReceiptItem) ?? ""))
                .filter(Boolean)
                .join("|"),
        [details?.items],
    );

    useEffect(() => {
        if (!isOpen || !isDraft || !details) return;
        setLineEdits((prev) => {
            const next = { ...prev };
            const valid = new Set<string>();
            for (const it of receiptItems(details)) {
                const k = String(receiptLineDeleteId(it) ?? "");
                if (!k) continue;
                valid.add(k);
                if (!next[k]) {
                    const expQ = it.expectedQuantity;
                    const defaultAcc =
                        expQ != null && Number.isFinite(Number(expQ)) && Number(expQ) > 0
                            ? Number(expQ)
                            : acceptedQty(it);
                    next[k] = {
                        accepted: String(defaultAcc),
                        statedExpiry: it.statedExpiryDate ? String(it.statedExpiryDate).slice(0, 10) : "",
                    };
                }
            }
            for (const key of Object.keys(next)) {
                if (!valid.has(key)) delete next[key];
            }
            return next;
        });
    }, [isOpen, isDraft, details, detailQuery.dataUpdatedAt, receiptLineIdsKey]);

    const printAllBatchLabels = useCallback(async (batches: InboundCompletedBatchLine[]) => {
        if (batches.length === 0) {
            toast.error("Không có batch để in nhãn.");
            return;
        }
        setPrintingAll(true);
        try {
            const chunks: string[] = [
                `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>In nhãn lô</title></head><body style="font-family:system-ui,sans-serif">`,
            ];
            for (const b of batches) {
                try {
                    const res = await inboundRequest.getBatchLabel(String(b.batchId));
                    const label = res.data;
                    chunks.push(
                        `<section style="page-break-after:always;text-align:center;padding:32px;border-bottom:1px solid #eee">` +
                            `<h1 style="font-size:18px;margin:0 0 8px">${escapeHtmlInbound(label.productName)}</h1>` +
                            `<p style="font-size:14px;font-weight:700;color:#0d9488;margin:0 0 16px">LÔ: ${escapeHtmlInbound(label.batchCode)}</p>` +
                            `<img src="${label.qrCode}" width="220" height="220" alt="QR"/>` +
                            `<p style="margin-top:16px;font-size:13px">SL: <strong>${label.quantity}</strong> · HSD: <strong>${escapeHtmlInbound(String(label.expiryDate))}</strong></p>` +
                            `</section>`,
                    );
                } catch {
                    chunks.push(
                        `<section style="page-break-after:always;padding:24px"><p>Không tải được nhãn lô ${escapeHtmlInbound(b.batchCode)} (ID ${b.batchId}).</p></section>`,
                    );
                }
            }
            chunks.push(`</body></html>`);
            const html = chunks.join("");
            const w = window.open("", "_blank");
            if (!w) {
                toast.error("Trình duyệt chặn cửa sổ mới — cho phép popup để in.");
                return;
            }
            w.document.write(html);
            w.document.close();
            w.focus();
            w.print();
        } finally {
            setPrintingAll(false);
        }
    }, []);

    const products: Product[] = (productsQuery.data as { items?: Product[] } | undefined)?.items ?? [];
    const productById = useMemo(() => {
        const m = new Map<number, Product>();
        for (const p of products) {
            if (p?.id != null) m.set(p.id, p);
        }
        return m;
    }, [products]);

    if (!isOpen) return null;

    const onFormSubmit = async (data: AddReceiptItemBodyType) => {
        if (!rid) return;
        const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
        const accepted = num(data.quantityAccepted) || num(data.quantity);
        const sel = productById.get(data.productId);
        if (accepted > 0 && requiresStatedExpiryForInbound(sel) && !String(data.statedExpiryDate ?? "").trim()) {
            toast.error("Hàng đóng gói / NCC bắt buộc nhập HSD khai báo.");
            setErrorForm("statedExpiryDate", { message: "Bắt buộc với loại sản phẩm này" });
            return;
        }
        try {
            await addReceiptItem.mutateAsync({ id: rid, data });
            resetForm();
            setIsAddingItem(false);
        } catch (error) {
            handleErrorApi({ error, setError: setErrorForm });
        }
    };

    const handleDeleteItem = (item: ReceiptItem) => {
        if (!confirm("Xóa dòng này khỏi phiếu nháp?")) return;
        const lineId = receiptLineDeleteId(item);
        if (!rid || lineId === undefined) {
            toast.error("Không xác định được ID dòng phiếu — kiểm tra payload API.");
            return;
        }
        deleteReceiptItem.mutate({ receiptId: rid, itemId: lineId });
    };

    const acceptedFromEdits = (it: ReceiptItem): number => {
        const k = String(receiptLineDeleteId(it) ?? "");
        const ed = lineEdits[k];
        if (ed?.accepted != null && ed.accepted.trim() !== "") {
            const p = parseFloat(ed.accepted.replace(",", "."));
            if (Number.isFinite(p)) return p;
        }
        const exp = it.expectedQuantity;
        if (exp != null && Number.isFinite(Number(exp)) && Number(exp) > 0) return Number(exp);
        return acceptedQty(it);
    };

    const validateBeforeComplete = (): boolean => {
        for (const it of items) {
            const acc = acceptedFromEdits(it);
            if (acc <= 0) continue;
            const k = String(receiptLineDeleteId(it) ?? "");
            const ed = lineEdits[k];
            const prod =
                productById.get(it.productId) ??
                (it.productType ? ({ type: it.productType } as Product) : undefined);
            if (requiresStatedExpiryForInbound(prod) && !String(ed?.statedExpiry ?? "").trim()) {
                toast.error(`"${it.productName}": bắt buộc HSD khai báo (hàng đóng gói / NCC).`);
                return false;
            }
        }
        return true;
    };

    const handleComplete = async () => {
        if (!rid) return;
        if (items.length === 0) {
            toast.error("Không thể chốt phiếu không có dòng hàng.");
            return;
        }
        if (!validateBeforeComplete()) return;
        const itemsPayload = items
            .map((it) => {
                const lineId = receiptLineDeleteId(it);
                if (lineId === undefined || lineId === null) return null;
                const k = String(lineId);
                const ed = lineEdits[k];
                const rawAcc = ed?.accepted?.trim() ?? "";
                const parsed = parseFloat(rawAcc.replace(",", "."));
                const quantityAccepted = Number.isFinite(parsed) ? parsed : acceptedFromEdits(it);
                const statedExpiryDate = ed?.statedExpiry?.trim() || undefined;
                return {
                    itemId: lineId,
                    quantityAccepted,
                    ...(statedExpiryDate ? { statedExpiryDate } : {}),
                };
            })
            .filter((x): x is NonNullable<typeof x> => x !== null);

        try {
            const result = await completeReceipt.mutateAsync({
                id: rid,
                body: itemsPayload.length > 0 ? { items: itemsPayload } : undefined,
            });
            setPostComplete(result);
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    const handleReprint = (batchId: number) => {
        reprintBatch.mutate({ batchId });
    };

    const isLoading = detailQuery.isLoading;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all flex flex-col">
                <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-5 sm:px-8">
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-gray-800">Cổng nhập kho — Chi tiết phiếu</h3>
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                            #{String(rid || receiptCode).slice(0, 8).toUpperCase()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setOmitExpected((v) => !v)}
                            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wide text-gray-600 hover:bg-gray-50"
                            title="GET ?omitExpected=true — ẩn SL dự kiến khi kiểm đếm"
                        >
                            {omitExpected ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
                            {omitExpected ? "Hiện dự kiến" : "Kiểm đếm"}
                        </button>
                        <button
                            onClick={onClose}
                            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
                    {!isLoading && details && (
                        <div className="mb-8 grid gap-6 sm:grid-cols-2">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <TruckIcon className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Nhà cung cấp</span>
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-4">
                                    <p className="text-sm font-bold text-gray-800">
                                        {details.supplier?.name ?? details.supplierName ?? "—"}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {details.supplier?.contactName} • {details.supplier?.phone}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <TagIcon className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Ghi chú</span>
                                </div>
                                <div className="min-h-[58px] rounded-2xl border border-gray-100 bg-gray-50/30 p-4">
                                    <p className="text-xs font-medium italic leading-relaxed text-gray-500">
                                        {details.note ? `"${details.note}"` : "Không có ghi chú."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-2 rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs font-medium text-amber-950">
                        <strong>Batch-centric:</strong> Dòng nháp mới chưa có mã lô nội bộ cho đến khi chốt phiếu. NSX/HSD
                        dùng để sinh lô <code className="rounded bg-white px-1">BAT-YYYYMMDD-SKU-XXXX</code> và FEFO.
                    </div>

                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                            <CubeIcon className="h-4 w-4 text-primary" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-800">Dòng hàng</h4>
                        </div>
                        {isDraft && (
                            <button
                                onClick={() => setIsAddingItem(!isAddingItem)}
                                className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase text-primary transition-colors hover:bg-primary/20"
                            >
                                <PlusIcon className="h-3.5 w-3.5" />
                                {isAddingItem ? "Hủy" : "Thêm dòng"}
                            </button>
                        )}
                    </div>

                    {isAddingItem && isDraft && (
                        <form
                            onSubmit={handleSubmit(onFormSubmit)}
                            className="mb-8 space-y-4 rounded-[1.5rem] border border-primary/20 bg-primary/5 p-6 animate-in slide-in-from-top duration-300"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="ml-2 text-[10px] font-black uppercase text-gray-600">Sản phẩm</label>
                                    <select
                                        {...register("productId", { valueAsNumber: true })}
                                        defaultValue=""
                                        className="w-full appearance-none rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="" disabled>
                                            Chọn sản phẩm…
                                        </option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {(p.name ?? "").trim() || `#${p.id}`}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.productId && (
                                        <p className="ml-2 text-[9px] text-red-500">{formErrors.productId.message}</p>
                                    )}
                                </div>
                                {!omitExpected && (
                                    <div className="space-y-1.5">
                                        <label className="ml-2 text-[10px] font-black uppercase text-gray-500">
                                            SL dự kiến (PO)
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            {...register("expectedQuantity", { valueAsNumber: true })}
                                            className="w-full rounded-full border border-white bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                )}
                                <div className="space-y-1.5">
                                    <label className="ml-2 text-[10px] font-black uppercase text-gray-600">
                                        SL nhận (QC) — mặc định = dự kiến, chỉnh khi lệch
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        {...register("quantity", { valueAsNumber: true })}
                                        placeholder="Cùng SL dự kiến nếu đủ hàng"
                                        className="w-full rounded-full border border-white bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {formErrors.quantity && (
                                        <p className="ml-2 text-[9px] text-red-500">{formErrors.quantity.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="ml-2 text-[10px] font-black uppercase text-gray-500">SL từ chối</label>
                                    <input
                                        type="number"
                                        step="any"
                                        {...register("quantityRejected", { valueAsNumber: true })}
                                        className="w-full rounded-full border border-white bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="ml-2 text-[10px] font-black uppercase text-gray-500">
                                        NSX (tùy chọn — hỗ trợ truy xuất)
                                    </label>
                                    <input
                                        type="date"
                                        {...register("manufacturedDate")}
                                        className="w-full rounded-full border border-white bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {formErrors.manufacturedDate && (
                                        <p className="ml-2 text-[9px] text-red-500">{formErrors.manufacturedDate.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="ml-2 text-[10px] font-black uppercase text-gray-500">
                                        HSD khai báo
                                        {requiresStatedExpiryForInbound(
                                            addFormProductId ? productById.get(Number(addFormProductId)) : undefined,
                                        ) && <span className="text-red-500"> *</span>}
                                        {!requiresStatedExpiryForInbound(
                                            addFormProductId ? productById.get(Number(addFormProductId)) : undefined,
                                        ) && (
                                            <span className="font-normal normal-case text-gray-400"> (tùy chọn)</span>
                                        )}
                                    </label>
                                    <input
                                        type="date"
                                        {...register("statedExpiryDate")}
                                        className="w-full rounded-full border border-white bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {formErrors.statedExpiryDate && (
                                        <p className="ml-2 text-[9px] text-red-500">{formErrors.statedExpiryDate.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="ml-2 text-[10px] font-black uppercase text-gray-500">
                                        Lý do từ chối (khi SL từ chối &gt; 0)
                                    </label>
                                    <input
                                        type="text"
                                        {...register("rejectionReason")}
                                        className="w-full rounded-full border border-white bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    {formErrors.rejectionReason && (
                                        <p className="ml-2 text-[9px] text-red-500">{formErrors.rejectionReason.message}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={addReceiptItem.isPending}
                                className="w-full rounded-full bg-primary py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark active:scale-[0.98] disabled:bg-slate-300"
                            >
                                {addReceiptItem.isPending ? "Đang thêm…" : "Ghi nhận dòng"}
                            </button>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <p className="mt-4 text-sm font-bold text-gray-500">Đang tải phiếu…</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="rounded-[2rem] border-2 border-dashed border-gray-100 bg-gray-50/30 py-12 text-center">
                            <CubeIcon className="mx-auto h-12 w-12 text-gray-200" />
                            <p className="mt-3 text-sm font-bold text-gray-800">Chưa có dòng hàng</p>
                            <p className="mt-1 px-12 text-[11px] italic text-gray-500">
                                Thêm dòng hàng — SL nhận mặc định theo dự kiến, chỉnh khi thiếu/hỏng.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {items.map((item, index) => {
                                const lineKey = String(receiptLineDeleteId(item) ?? index);
                                const batchId = item.batchId ?? undefined;
                                const productName = item.productName || "—";
                                const batchCode = item.batchCode ?? (batchId ? `ID ${batchId}` : "Chưa có lô (sau chốt)");
                                const expiry = item.statedExpiryDate ?? item.expiryDate ?? null;
                                const unit = item.unit ?? "";
                                const acc = acceptedQty(item);
                                const rej = item.quantityRejected ?? 0;
                                const pendingBatch = isDraftLinePendingBatch(item);
                                const expNum = item.expectedQuantity;
                                const defaultAccStr = String(
                                    expNum != null && Number.isFinite(Number(expNum)) && Number(expNum) > 0
                                        ? Number(expNum)
                                        : acc,
                                );
                                const ed = lineEdits[lineKey] ?? {
                                    accepted: defaultAccStr,
                                    statedExpiry: item.statedExpiryDate ? String(item.statedExpiryDate).slice(0, 10) : "",
                                };
                                const needExpiry = requiresStatedExpiryForInbound(
                                    productById.get(item.productId) ??
                                        (item.productType ? ({ type: item.productType } as Product) : undefined),
                                );
                                const displayAccepted = acceptedFromEdits(item);
                                const hasDiscrepancy =
                                    isDraft &&
                                    !omitExpected &&
                                    expNum != null &&
                                    Number.isFinite(Number(expNum)) &&
                                    Math.abs(displayAccepted - Number(expNum)) > 1e-5;

                                return (
                                    <div
                                        key={lineKey}
                                        className={cn(
                                            "group flex flex-col gap-3 rounded-2xl border-2 p-5 transition-all hover:shadow-lg",
                                            hasDiscrepancy
                                                ? "border-amber-500 bg-amber-50/90 shadow-amber-100/50"
                                                : "border-gray-100 bg-white hover:border-primary/20 hover:shadow-primary/5",
                                        )}
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-gray-50 p-2.5 text-gray-500 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                                                    <CubeIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{productName}</h4>
                                                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-gray-500">
                                                        <TagIcon className="h-3.5 w-3.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                                            Lô: {batchCode}
                                                        </span>
                                                        {hasDiscrepancy && (
                                                            <span className="rounded-md border border-amber-700 bg-amber-200 px-2 py-0.5 text-[9px] font-black uppercase text-amber-950">
                                                                Lệch so với dự kiến
                                                            </span>
                                                        )}
                                                        {item.inspectionStatus && (
                                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase text-slate-700">
                                                                {item.inspectionStatus}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {!isDraft ? (
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1 text-primary">
                                                        <ScaleIcon className="h-4 w-4" />
                                                        <span className="text-lg font-black tracking-tight">{acc}</span>
                                                        <span className="mt-1 text-[10px] font-bold uppercase">{unit}</span>
                                                    </div>
                                                    {!omitExpected && item.expectedQuantity != null && (
                                                        <p className="mt-1 text-[10px] text-gray-500">
                                                            Dự kiến: {item.expectedQuantity} {unit}
                                                        </p>
                                                    )}
                                                    {rej > 0 && (
                                                        <p className="text-[10px] font-bold text-red-600">Từ chối: {rej}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-right text-[10px] font-bold uppercase text-gray-500">
                                                    {rej > 0 && <p className="text-red-600">Từ chối: {rej}</p>}
                                                </div>
                                            )}
                                        </div>

                                        {isDraft && (
                                            <div className="grid gap-3 rounded-xl border border-gray-200 bg-white/80 p-4 sm:grid-cols-2">
                                                {!omitExpected && (
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                            SL dự kiến (PO)
                                                        </p>
                                                        <p className="text-2xl font-black tabular-nums text-gray-900">
                                                            {expNum != null ? `${expNum} ${unit}`.trim() : "—"}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className={cn(!omitExpected ? "" : "sm:col-span-2")}>
                                                    <label
                                                        htmlFor={`acc-${lineKey}`}
                                                        className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-700"
                                                    >
                                                        SL nhận (QC)
                                                    </label>
                                                    <input
                                                        id={`acc-${lineKey}`}
                                                        type="number"
                                                        inputMode="decimal"
                                                        step="any"
                                                        min={0}
                                                        value={ed.accepted}
                                                        onChange={(e) =>
                                                            setLineEdits((prev) => ({
                                                                ...prev,
                                                                [lineKey]: { ...ed, accepted: e.target.value },
                                                            }))
                                                        }
                                                        className="min-h-[52px] w-full rounded-xl border-2 border-gray-300 bg-white px-4 text-2xl font-black tabular-nums text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor={`exp-${lineKey}`}
                                                        className="mb-1 block text-[10px] font-black uppercase tracking-widest text-gray-500"
                                                    >
                                                        HSD khai báo
                                                        {needExpiry && <span className="text-red-600"> *</span>}
                                                        {!needExpiry && (
                                                            <span className="font-normal normal-case text-gray-400">
                                                                {" "}
                                                                (tùy chọn)
                                                            </span>
                                                        )}
                                                    </label>
                                                    <input
                                                        id={`exp-${lineKey}`}
                                                        type="date"
                                                        value={ed.statedExpiry}
                                                        onChange={(e) =>
                                                            setLineEdits((prev) => ({
                                                                ...prev,
                                                                [lineKey]: { ...ed, statedExpiry: e.target.value },
                                                            }))
                                                        }
                                                        className="min-h-[48px] w-full max-w-full rounded-xl border-2 border-gray-200 bg-white px-3 text-base font-bold text-gray-800 outline-none focus:border-primary"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid gap-2 rounded-xl bg-gray-50/50 p-3 text-[11px] text-gray-700 sm:grid-cols-2">
                                            {item.manufacturedDate && (
                                                <div>
                                                    <span className="font-black uppercase text-gray-500">NSX: </span>
                                                    {new Date(item.manufacturedDate).toLocaleDateString("vi-VN")}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="font-black uppercase text-gray-500">HSD: </span>
                                                <span className="font-bold text-red-600">
                                                    {expiry
                                                        ? new Date(expiry).toLocaleDateString("vi-VN", {
                                                              year: "numeric",
                                                              month: "short",
                                                              day: "numeric",
                                                          })
                                                        : pendingBatch
                                                          ? "Theo NSX + shelf life / HSD khai báo"
                                                          : "—"}
                                                </span>
                                            </div>
                                            {item.rejectionReason && (
                                                <div className="sm:col-span-2 text-red-700">
                                                    Lý do từ chối: {item.rejectionReason}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-2">
                                            {batchId ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewingBatchId(String(batchId))}
                                                        className="rounded-lg border border-transparent bg-white p-2 text-gray-500 transition-all hover:border-primary/20 hover:text-primary hover:shadow-sm"
                                                        title="Xem nhãn"
                                                    >
                                                        <QrCodeIcon className="h-4 w-4" />
                                                    </button>
                                                    {!isDraft && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleReprint(Number(batchId))}
                                                            disabled={reprintBatch.isPending}
                                                            className="rounded-lg border border-transparent bg-white p-2 text-gray-500 transition-all hover:border-primary/20 hover:text-primary hover:shadow-sm"
                                                            title="In lại nhãn"
                                                        >
                                                            <PrinterIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-[10px] font-bold uppercase text-amber-700">
                                                    Nhãn QR sau khi chốt phiếu
                                                </span>
                                            )}
                                            {isDraft && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteItem(item)}
                                                    className="rounded-lg bg-white p-2 text-gray-500 transition-all hover:border hover:border-red-200 hover:text-red-500 hover:shadow-sm"
                                                    title="Xóa dòng"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex shrink-0 flex-col gap-4 border-t border-gray-100 bg-gray-50/50 px-6 py-5 sm:px-8">
                    {postComplete && (
                        <div
                            className="rounded-2xl border-2 border-emerald-600 bg-emerald-50 p-4 text-emerald-950"
                            role="status"
                        >
                            <p className="flex items-center gap-2 text-sm font-black text-emerald-900">
                                <CheckCircleIcon className="h-5 w-5 shrink-0" />
                                Đã xác nhận hàng về — ghi mã lô lên thùng ngay
                            </p>
                            {postComplete.batchCodes.length > 0 ? (
                                <ul className="mt-3 grid gap-2 font-mono text-sm font-bold sm:grid-cols-2">
                                    {postComplete.batchCodes.map((code) => (
                                        <li
                                            key={code}
                                            className="rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-emerald-200"
                                        >
                                            {code}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-2 text-xs text-emerald-800/90">
                                    API chưa trả danh sách mã lô — kiểm tra Swagger / payload{" "}
                                    <code className="rounded bg-white/80 px-1">batches</code>.
                                </p>
                            )}
                            <button
                                type="button"
                                disabled={printingAll || postComplete.batches.length === 0}
                                onClick={() => void printAllBatchLabels(postComplete.batches)}
                                className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-800 bg-emerald-700 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-md transition hover:bg-emerald-800 disabled:bg-slate-400"
                            >
                                <PrinterIcon className="h-5 w-5" />
                                {printingAll ? "Đang chuẩn bị in…" : "In tất cả nhãn lô"}
                            </button>
                        </div>
                    )}
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
                        {isDraft && items.length > 0 && !postComplete && (
                            <button
                                type="button"
                                onClick={() => void handleComplete()}
                                disabled={completeReceipt.isPending}
                                className="order-2 flex min-h-[56px] w-full flex-[2] items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.98] disabled:bg-slate-300 sm:order-none sm:min-h-[52px] sm:py-3 sm:text-[11px]"
                            >
                                <CheckCircleIcon className="h-6 w-6 sm:h-5 sm:w-5" />
                                {completeReceipt.isPending ? "Đang xử lý…" : "Hoàn tất phiếu nhận"}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                if (postComplete) setPostComplete(null);
                                onClose();
                            }}
                            className="order-1 min-h-[48px] w-full flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 shadow-sm transition-all hover:bg-gray-100 active:scale-[0.98] sm:order-none sm:w-auto"
                        >
                            Đóng
                        </button>
                    </div>
                </div>

                {viewingBatchId && (
                    <div className="absolute inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-300">
                        <button
                            onClick={() => setViewingBatchId(null)}
                            className="absolute right-8 top-6 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>

                        {labelQuery.isLoading ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    Đang tải nhãn…
                                </p>
                            </div>
                        ) : labelQuery.data ? (
                            <div className="flex w-full max-w-sm flex-col items-center rounded-[3rem] border border-slate-100 bg-white p-10 shadow-xl">
                                <h4 className="mb-1 text-sm font-black uppercase italic tracking-tight text-gray-800">
                                    {labelQuery.data.productName}
                                </h4>
                                <span className="mb-6 text-[10px] font-bold text-primary">LÔ: {labelQuery.data.batchCode}</span>

                                <div className="relative mb-8 rounded-3xl border-4 border-slate-50 bg-white p-4 shadow-inner">
                                    <img
                                        src={labelQuery.data.qrCode}
                                        alt="Batch QR Code"
                                        className="h-48 w-48 object-contain"
                                    />
                                    <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                                        <div className="rounded-full bg-primary px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-md">
                                            FEFO / quét kiểm
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full space-y-3 rounded-2xl bg-slate-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">SL</span>
                                        <span className="text-xs font-black text-gray-800">{labelQuery.data.quantity} đơn vị</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">HSD</span>
                                        <span className="text-xs font-black text-red-500">
                                            {new Date(labelQuery.data.expiryDate).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-text-main py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:bg-black"
                                >
                                    <PrinterIcon className="h-4 w-4" />
                                    In nhãn
                                </button>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
