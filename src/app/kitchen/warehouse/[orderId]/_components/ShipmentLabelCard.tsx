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
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">Shipment Label Preview</h3>
            {!shipmentId ? (
                <p className="text-xs text-text-muted">No shipment data available from picking detail.</p>
            ) : isLoading ? (
                <p className="text-xs text-text-muted">Loading label...</p>
            ) : isError ? (
                <p className="text-xs text-red-500">Failed to load label.</p>
            ) : (
                <div className="space-y-2 text-xs">
                    <p className="font-semibold text-text-main">Store: {String(data.storeName ?? "-")}</p>
                    <p className="text-text-muted">Template: {String(data.templateType ?? "-")}</p>
                    <p className="text-text-muted">Items: {items.length}</p>
                </div>
            )}
        </div>
    );
}
