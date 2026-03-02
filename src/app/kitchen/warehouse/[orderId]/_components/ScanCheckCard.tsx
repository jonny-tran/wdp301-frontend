import { SyntheticEvent } from "react";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { ScanCheckResult } from "@/types/warehouse";

interface ScanCheckCardProps {
    scanInput: string;
    scanCode: string;
    scanData: ScanCheckResult | undefined;
    isLoading: boolean;
    isError: boolean;
    onChangeInput: (value: string) => void;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}

export default function ScanCheckCard({
    scanInput,
    scanCode,
    scanData,
    isLoading,
    isError,
    onChangeInput,
    onSubmit,
}: ScanCheckCardProps) {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">Scan Check</h3>
            <form onSubmit={onSubmit} className="space-y-3">
                <input
                    value={scanInput}
                    onChange={(event) => onChangeInput(event.target.value)}
                    placeholder="Enter batch code"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-text-main hover:border-primary/40 hover:text-primary"
                >
                    <QrCodeIcon className="h-4 w-4" />
                    Check batch
                </button>
            </form>

            {scanCode && (
                <div className="mt-4 rounded-2xl border border-gray-100 p-3 text-xs">
                    {isLoading ? (
                        <p className="text-text-muted">Scanning...</p>
                    ) : isError ? (
                        <p className="text-red-500">Batch not found or inaccessible.</p>
                    ) : scanData ? (
                        <>
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-text-main">{scanData.productName || "-"}</p>
                                <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 rounded uppercase">ID: {scanData.batchId || "-"}</span>
                            </div>
                            <p className="text-text-muted">Code: {scanData.batchCode || "-"}</p>
                            <p className="text-text-muted">Quantity: {scanData.quantityPhysical ?? scanData.currentQuantity ?? 0}</p>
                            <p className="text-text-muted">Status: {scanData.status || "-"}</p>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}
