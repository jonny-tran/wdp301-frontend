import { PickFormRow } from "./picking.types";

interface SuggestedPicksPanelProps {
    rows: PickFormRow[];
    shipmentId: string;
    isFinalizing: boolean;
    onChangeRow: (index: number, field: "batchId" | "quantity", value: string) => void;
    onFinalize: () => void;
}

export default function SuggestedPicksPanel({
    rows,
    shipmentId,
    isFinalizing,
    onChangeRow,
    onFinalize,
}: SuggestedPicksPanelProps) {
    return (
        <div className="xl:col-span-3 rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted">Suggested Picks</h2>
            </div>

            {rows.length === 0 ? (
                <p className="px-6 py-8 text-sm text-text-muted">No suggested batch returned for this order.</p>
            ) : (
                <div className="space-y-4 p-4">
                    {rows.map((row, index) => (
                        <div key={row.key} className="rounded-2xl border border-gray-100 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-text-main">{row.productName}</p>
                                    <p className="text-xs text-text-muted">Batch: {row.batchCode}</p>
                                </div>
                                <p className="text-xs text-text-muted">Exp: {row.expiry ? String(row.expiry).slice(0, 10) : "-"}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <label className="text-xs font-semibold text-text-muted">
                                    Batch ID {row.batchId && "(Auto-filled)"}
                                    <input
                                        value={row.batchId}
                                        readOnly={!!row.batchId}
                                        onChange={(event) => onChangeRow(index, "batchId", event.target.value)}
                                        className={`mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary ${row.batchId ? "bg-gray-50 text-text-muted cursor-not-allowed" : ""}`}
                                        placeholder="Ex: 101"
                                    />
                                </label>

                                <label className="text-xs font-semibold text-text-muted">
                                    Quantity to pick
                                    <input
                                        value={row.quantity}
                                        onChange={(event) => onChangeRow(index, "quantity", event.target.value)}
                                        className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                                        placeholder="Ex: 5"
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <span className="text-xs text-text-muted">{shipmentId ? "Shipment data available" : "Shipment data not available"}</span>
                <button
                    onClick={onFinalize}
                    disabled={isFinalizing || rows.length === 0}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark disabled:opacity-60"
                >
                    {isFinalizing ? "Finalizing..." : "Finalize Bulk Shipment"}
                </button>
            </div>
        </div>
    );
}
