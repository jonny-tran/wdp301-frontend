"use client";

import { XMarkIcon, CubeIcon, TagIcon, ScaleIcon, CalendarIcon, TruckIcon, PlusIcon, TrashIcon, CheckCircleIcon, PrinterIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { useInbound } from "@/hooks/useInbound";
import { useProduct } from "@/hooks/useProduct";
import { ReceiptStatus } from "@/utils/enum";
import { useState, FormEvent } from "react";
import { toast } from "sonner";

interface ReceiptDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiptCode: string;
    details: any;
    isLoading: boolean;
}

export default function ReceiptDetailModal({
    isOpen,
    onClose,
    receiptCode,
    details,
    isLoading
}: ReceiptDetailModalProps) {
    const { addReceiptItem, deleteReceiptItem, completeReceipt, reprintBatch, batchLabel } = useInbound();
    const { productList } = useProduct();

    // Form state for adding item
    const [productId, setProductId] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [isAddingItem, setIsAddingItem] = useState(false);

    // State for viewing QR Code
    const [viewingBatchId, setViewingBatchId] = useState<string | null>(null);
    const labelQuery = batchLabel(viewingBatchId || "");
    const productsQuery = productList({ page: 1, limit: 100, sortOrder: "DESC" });

    if (!isOpen) return null;

    const isDraft = details?.status === ReceiptStatus.DRAFT || (details as any)?.data?.status === ReceiptStatus.DRAFT;
    const items = Array.isArray(details?.items) ? details.items : (Array.isArray((details as any)?.data?.items) ? (details as any).data.items : []);
    const products = (productsQuery.data as any)?.items || (productsQuery.data as any)?.data?.items || [];

    const handleAddItem = (e: FormEvent) => {
        e.preventDefault();
        if (!details?.id || !productId || !quantity) return;

        addReceiptItem.mutate({
            id: details.id,
            data: {
                productId: Number(productId),
                quantity: Number(quantity)
            }
        }, {
            onSuccess: () => {
                setProductId("");
                setQuantity("");
                setIsAddingItem(false);
            }
        });
    };

    const handleDeleteItem = (batchId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa mặt hàng này không?")) return;
        deleteReceiptItem.mutate(batchId);
    };

    const handleComplete = () => {
        if (!details?.id) return;
        if (items.length === 0) {
            toast.error("Không thể hoàn tất phiếu nhập không có mặt hàng.");
            return;
        }
        if (!confirm("Xác nhận hoàn tất? Hành động này sẽ cập nhật tồn kho vĩnh viễn.")) return;
        completeReceipt.mutate(details.id, {
            onSuccess: () => onClose()
        });
    };

    const handleReprint = (batchId: number) => {
        reprintBatch.mutate({ batchId });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-8 py-6">
                    <div>
                        <h3 className="text-xl font-black text-text-main tracking-tight">Chi tiết phiếu nhập</h3>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mt-0.5">#{String(details?.id || receiptCode).slice(0, 8).toUpperCase()}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto p-8">
                    {/* Top Info Section */}
                    {!isLoading && details && (
                        <div className="mb-8 grid gap-6 sm:grid-cols-2">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-text-muted">
                                    <TruckIcon className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Thông tin nhà cung cấp</span>
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-4">
                                    <p className="text-sm font-bold text-text-main">{details.supplier?.name || "Không rõ nhà cung cấp"}</p>
                                    <p className="mt-1 text-xs text-text-muted">{details.supplier?.contactName} • {details.supplier?.phone}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-text-muted">
                                    <TagIcon className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Ghi chú</span>
                                </div>
                                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-4 min-h-[58px]">
                                    <p className="text-xs font-medium text-text-muted italic leading-relaxed">
                                        {details.note ? `"${details.note}"` : "Không có ghi chú nào cho chuyến hàng này."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                            <CubeIcon className="h-4 w-4 text-primary" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-text-main">Hàng hóa nhập kho</h4>
                        </div>
                        {isDraft && (
                            <button
                                onClick={() => setIsAddingItem(!isAddingItem)}
                                className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase text-primary hover:bg-primary/20 transition-colors"
                            >
                                <PlusIcon className="h-3.5 w-3.5" />
                                {isAddingItem ? "Hủy" : "Thêm mặt hàng"}
                            </button>
                        )}
                    </div>

                    {isAddingItem && isDraft && (
                        <form onSubmit={handleAddItem} className="mb-8 rounded-[2rem] border border-primary/20 bg-primary/5 p-6 space-y-4 animate-in slide-in-from-top duration-300">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Sản phẩm</label>
                                    <select
                                        required
                                        value={productId}
                                        onChange={(e) => setProductId(e.target.value)}
                                        className="w-full rounded-full border border-white bg-white px-4 py-2.5 text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="" disabled>{productsQuery.isLoading ? "Đang tải sản phẩm..." : "Chọn sản phẩm..."}</option>
                                        {!productsQuery.isLoading && products.length === 0 && (
                                            <option value="" disabled>Không có sản phẩm nào</option>
                                        )}
                                        {products.map((p: any) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-text-muted ml-2">Số lượng</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="e.g. 50"
                                        className="w-full rounded-full border border-white bg-white px-4 py-2.5 text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={addReceiptItem.isPending || !productId || !quantity}
                                className="w-full rounded-full bg-primary py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary-dark transition-all disabled:bg-slate-300"
                            >
                                {addReceiptItem.isPending ? "Đang thêm..." : "Xác nhận nhập"}
                            </button>
                        </form>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <p className="mt-4 text-sm font-bold text-text-muted">Đang tải các mặt hàng...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="rounded-[2rem] border-2 border-dashed border-gray-100 py-12 text-center bg-gray-50/30">
                            <CubeIcon className="mx-auto h-12 w-12 text-gray-200" />
                            <p className="mt-3 text-sm font-bold text-text-main">Không tìm thấy sản phẩm nào</p>
                            <p className="mt-1 text-[11px] text-text-muted px-12 italic">Phiếu nhập kho này chưa có bất kỳ sản phẩm nào được ghi nhận.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {items.map((item: any, index: number) => {
                                const productName = item.productName || item.batch?.product?.name || "Unknown Product";
                                const batchCode = item.batchCode || item.batch?.batchCode || "N/A";
                                const expiryDate = item.expiryDate || item.batch?.expiryDate;
                                const unit = item.unit || item.batch?.product?.unit || "Units";

                                return (
                                    <div
                                        key={item.batchId ?? index}
                                        className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-gray-50 p-2.5 text-text-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                                                    <CubeIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-text-main">{productName}</h4>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-text-muted">
                                                        <TagIcon className="h-3.5 w-3.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">Lô hàng: {batchCode}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1 text-primary">
                                                    <ScaleIcon className="h-4 w-4" />
                                                    <span className="text-lg font-black tracking-tight">{item.quantity}</span>
                                                    <span className="text-[10px] font-bold uppercase mt-1">{unit}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50/50 p-3">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-text-muted">
                                                    <CalendarIcon className="h-3.5 w-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Hạn dùng:</span>
                                                </div>
                                                <span className="text-xs font-bold text-red-500">
                                                    {expiryDate ? new Date(expiryDate).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : "Đang chờ"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setViewingBatchId(String(item.batchId))}
                                                    className="rounded-lg bg-white p-2 text-text-muted hover:text-primary hover:shadow-sm border border-transparent hover:border-primary/20 transition-all"
                                                    title="Xem nhãn"
                                                >
                                                    <QrCodeIcon className="h-4 w-4" />
                                                </button>
                                                {!isDraft && (
                                                    <button
                                                        onClick={() => handleReprint(item.batchId)}
                                                        disabled={reprintBatch.isPending}
                                                        className="rounded-lg bg-white p-2 text-text-muted hover:text-primary hover:shadow-sm border border-transparent hover:border-primary/20 transition-all"
                                                        title="In lại nhãn"
                                                    >
                                                        <PrinterIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {isDraft && (
                                                    <button
                                                        onClick={() => handleDeleteItem(String(item.batchId))}
                                                        className="rounded-lg bg-white p-2 text-text-muted hover:text-red-500 hover:shadow-sm border border-transparent hover:border-red-200 transition-all ml-1"
                                                        title="Xóa mặt hàng"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-6 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-2xl bg-white border border-gray-200 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted transition-all hover:bg-gray-100 active:scale-[0.98] shadow-sm"
                    >
                        Đóng
                    </button>
                    {isDraft && items.length > 0 && (
                        <button
                            onClick={handleComplete}
                            disabled={completeReceipt.isPending}
                            className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-primary-dark active:scale-[0.98] shadow-lg shadow-primary/20 disabled:bg-slate-300"
                        >
                            <CheckCircleIcon className="h-4 w-4" />
                            {completeReceipt.isPending ? "Đang hoàn tất..." : "Hoàn tất & Nhập hàng"}
                        </button>
                    )}
                </div>

                {/* QR Code Overlay */}
                {viewingBatchId && (
                    <div className="absolute inset-0 z-[110] flex items-center justify-center bg-white/95 backdrop-blur-md animate-in fade-in duration-300">
                        <button
                            onClick={() => setViewingBatchId(null)}
                            className="absolute top-6 right-8 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>

                        {labelQuery.isLoading ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Đang tạo dữ liệu nhãn...</p>
                            </div>
                        ) : labelQuery.data ? (
                            <div className="flex flex-col items-center bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl max-w-sm w-full">
                                <h4 className="text-sm font-black text-text-main mb-1 uppercase italic tracking-tight">{labelQuery.data.productName}</h4>
                                <span className="text-[10px] font-bold text-primary mb-6">LÔ: {labelQuery.data.batchCode}</span>

                                <div className="relative mb-8 bg-white p-4 rounded-3xl border-4 border-slate-50 shadow-inner">
                                    <img
                                        src={labelQuery.data.qrCode}
                                        alt="Batch QR Code"
                                        className="w-48 h-48 object-contain"
                                    />
                                    <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                                        <div className="bg-primary px-3 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest shadow-md">
                                            Quét để xác minh
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full space-y-3 bg-slate-50 rounded-2xl p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">SL</span>
                                        <span className="text-xs font-black text-text-main">{labelQuery.data.quantity} đơn vị</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Hạn dùng</span>
                                        <span className="text-xs font-black text-red-500">{new Date(labelQuery.data.expiryDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.print()}
                                    className="mt-8 flex items-center justify-center gap-2 w-full rounded-2xl bg-text-main py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black transition-all shadow-xl shadow-slate-200"
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
