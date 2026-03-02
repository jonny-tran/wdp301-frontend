import { ShipmentLabel } from "@/types/warehouse";

interface ShipmentLabelCardProps {
    shipmentId: string;
    isLoading: boolean;
    isError: boolean;
    labelData: ShipmentLabel | undefined;
}

export default function ShipmentLabelCard({
    shipmentId,
    isLoading,
    isError,
    labelData,
}: ShipmentLabelCardProps) {
    const items = labelData?.items || [];

    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">Shipment Label Preview</h3>
            {!shipmentId ? (
                <p className="text-xs text-text-muted">No shipment data available from picking detail.</p>
            ) : isLoading ? (
                <p className="text-xs text-text-muted">Loading label...</p>
            ) : isError ? (
                <p className="text-xs text-red-500">Failed to load label.</p>
            ) : labelData ? (
                <div className="space-y-2 text-xs">
                    <p className="font-semibold text-text-main">Store: {labelData.storeName}</p>
                    <p className="text-text-muted">Template: {labelData.templateType || "-"}</p>
                    <p className="text-text-muted">Items: {items.length}</p>
                </div>
            ) : null}
        </div>
    );
}
