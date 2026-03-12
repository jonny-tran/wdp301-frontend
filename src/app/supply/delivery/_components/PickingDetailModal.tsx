import { XMarkIcon } from "@heroicons/react/24/outline";
import { formatDate, getStatusBadgeClass } from "@/app/supply/_components/format";
import { ShipmentPickingList } from "@/types/shipment";
import Image from "next/image";

interface PickingDetailModalProps {
    shipmentNo?: number;
    onClose: () => void;
    isLoading: boolean;
    isError: boolean;
    pickingData: ShipmentPickingList;
}

export default function PickingDetailModal({
    shipmentNo,
    onClose,
    isLoading,
    isError,
    pickingData,
}: PickingDetailModalProps) {
    const getStatusLabel = (status?: string) => {
        if (!status) return "-";
        const statusMap: Record<string, string> = {
            pending: "Đang chờ",
            preparing: "Đang chuẩn bị",
            picking: "Đang lấy hàng",
            in_transit: "Đang vận chuyển",
            delivered: "Đã giao",
            completed: "Hoàn tất",
            cancelled: "Đã hủy",
        };
        return statusMap[status.toLowerCase()] || status.replace(/_/g, " ");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-text-main">Danh sách Lấy hàng</h3>
                        <p className="text-xs text-text-muted">#{shipmentNo}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            <span className="ml-3 text-text-muted">Đang tải...</span>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12">
                            <p className="text-red-500 font-medium">Tải dữ liệu thất bại</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Shipment Info Card */}
                            <div className="rounded-2xl bg-gray-50 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vận đơn</span>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(pickingData.status)}`}>
                                        {getStatusLabel(pickingData.status)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400">Mã vận đơn</p>
                                        <p className="font-semibold text-text-main truncate" title={pickingData.shipment_id}>
                                            {pickingData.shipment_id?.slice(0, 8).toUpperCase() || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Mã đơn hàng</p>
                                        <p className="font-semibold text-text-main truncate" title={pickingData.order_id}>
                                            {pickingData.order_id?.slice(0, 8).toUpperCase() || "-"}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-400">Cửa hàng</p>
                                        <p className="font-semibold text-text-main">{pickingData.store_name || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Products Section */}
                            <div>
                                <h4 className="text-sm font-bold text-text-main mb-3">Sản phẩm ({pickingData.items?.length || 0})</h4>
                                {pickingData.items?.length === 0 ? (
                                    <p className="text-sm text-text-muted text-center py-8">Không có sản phẩm nào</p>
                                ) : (
                                    <div className="space-y-3">
                                        {pickingData.items.map((item, index) => (
                                            <div
                                                key={`${item.batch_code}-${index}`}
                                                className="flex gap-4 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
                                            >
                                                {/* Product Image */}
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 relative">
                                                    {item.image_url ? (
                                                        <Image
                                                            src={item.image_url}
                                                            alt={item.product_name || "Sản phẩm"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-text-main truncate">{item.product_name || "Sản phẩm"}</p>
                                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                                        <span>SKU: <span className="font-medium text-gray-700">{item.sku || "-"}</span></span>
                                                        <span>Lô: <span className="font-medium text-gray-700">{item.batch_code || "-"}</span></span>
                                                    </div>
                                                </div>

                                                {/* Quantity & Expiry */}
                                                <div className="flex flex-col items-end justify-between text-right">
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-primary">{item.quantity || "-"}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase">SL</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-medium text-gray-600">{formatDate(item.expiry_date)}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase">Hạn dùng</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
