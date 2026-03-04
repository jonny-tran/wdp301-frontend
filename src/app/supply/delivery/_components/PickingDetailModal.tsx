import { formatDate, formatStatusLabel } from "@/app/supply/_components/format";
import { PickingDetail } from "./delivery.types";

interface PickingDetailModalProps {
    shipmentNo?: number;
    onClose: () => void;
    isLoading: boolean;
    isError: boolean;
    pickingData: PickingDetail;
}

export default function PickingDetailModal({
    shipmentNo,
    onClose,
    isLoading,
    isError,
    pickingData,
}: PickingDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">Danh sách Lấy hàng</h3>
                        <p className="text-sm text-text-muted">Chi tiết lấy hàng và phân tách mặt hàng.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40"
                    >
                        Đóng
                    </button>
                </div>

                {isLoading ? (
                    <p className="text-sm text-text-muted">Đang tải danh sách lấy hàng...</p>
                ) : isError ? (
                    <p className="text-sm text-red-500">Tải danh sách lấy hàng thất bại.</p>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-gray-100 p-4 text-xs">
                            <p className="font-semibold text-text-main">Giao hàng số: {shipmentNo ? `#${shipmentNo}` : "-"}</p>
                            <p className="text-text-muted">{pickingData.orderId ? "Đơn hàng liên kết: Có sẵn" : "Đơn hàng liên kết: Không khả dụng"}</p>
                            <p className="text-text-muted">Cửa hàng: {pickingData.storeName ?? "-"}</p>
                            <p className="text-text-muted">Trạng thái: {formatStatusLabel(String(pickingData.status ?? ""))}</p>
                        </div>

                        {pickingData.items.length === 0 ? (
                            <p className="text-sm text-text-muted">Không có mặt hàng nào trong danh sách lấy hàng.</p>
                        ) : (
                            <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                                {pickingData.items.map((item, index) => (
                                    <div key={`${item.batchCode}-${index}`} className="rounded-2xl border border-gray-100 p-3">
                                        <p className="font-semibold text-text-main">{item.productName ?? "Sản phẩm"}</p>
                                        <p className="text-xs text-text-muted">SKU: {item.sku ?? "-"}</p>
                                        <p className="text-xs text-text-muted">Lô: {item.batchCode ?? "-"}</p>
                                        <p className="text-xs text-text-muted">SL: {item.quantity ?? "-"}</p>
                                        <p className="text-xs text-text-muted">Hạn dùng: {formatDate(item.expiryDate)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
