import { EyeIcon } from "@heroicons/react/24/outline";
import { formatDate, formatStatusLabel, getStatusBadgeClass } from "@/app/supply/_components/format";
import { ShipmentRow } from "./delivery.types";

interface DeliveryTableProps {
    shipments: ShipmentRow[];
    rowStart: number;
    isLoading: boolean;
    isError: boolean;
    onOpenPicking: (shipmentId: string) => void;
}

export default function DeliveryTable({
    shipments,
    rowStart,
    isLoading,
    isError,
    onOpenPicking,
}: DeliveryTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-text-muted">
                    <tr>
                        <th className="px-6 py-3">No.</th>
                        <th className="px-6 py-3">Store</th>
                        <th className="px-6 py-3">Ship Date</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-sm text-text-muted">Loading shipments...</td>
                        </tr>
                    ) : isError ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-sm text-red-500">Failed to load shipment list.</td>
                        </tr>
                    ) : shipments.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-sm text-text-muted">No shipments match the current filters.</td>
                        </tr>
                    ) : (
                        shipments.map((shipment, index) => (
                            <tr key={shipment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-text-main">#{rowStart + index + 1}</p>
                                    <p className="text-xs text-text-muted">{shipment.orderId ? "Linked order available" : "No linked order"}</p>
                                </td>
                                <td className="px-6 py-4 text-text-muted">{shipment.storeName ?? "-"}</td>
                                <td className="px-6 py-4 text-text-muted">{formatDate(shipment.shipDate)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getStatusBadgeClass(String(shipment.status ?? ""))}`}>
                                        {formatStatusLabel(String(shipment.status ?? ""))}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => onOpenPicking(shipment.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40 hover:text-primary"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                            Picking
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
