interface ShipmentLabelCardProps {
    shipmentId: string;
    isLoading: boolean;
    isError: boolean;
    labelData: unknown;
}

export default function ShipmentLabelCard({
    shipmentId,
    isLoading,
    isError,
    labelData,
}: ShipmentLabelCardProps) {
    const data = (labelData ?? {}) as Record<string, unknown>;
    const items = Array.isArray(data.items) ? data.items : [];

    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">Xem trước nhãn vận chuyển</h3>
            {!shipmentId ? (
                <p className="text-xs text-text-muted">Không có dữ liệu vận chuyển từ chi tiết lấy hàng.</p>
            ) : isLoading ? (
                <p className="text-xs text-text-muted">Đang tải nhãn...</p>
            ) : isError ? (
                <p className="text-xs text-red-500">Tải nhãn thất bại.</p>
            ) : (
                <div className="space-y-2 text-xs">
                    <p className="font-semibold text-text-main">Cửa hàng: {String(data.storeName ?? "-")}</p>
                    <p className="text-text-muted">Mẫu: {String(data.templateType ?? "-")}</p>
                    <p className="text-text-muted">Mặt hàng: {items.length}</p>
                </div>
            )}
        </div>
    );
}
