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
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Kiểm tra quét</h3>
            <form onSubmit={onSubmit} className="space-y-3">
                <input
                    value={scanInput}
                    onChange={(event) => onChangeInput(event.target.value)}
                    placeholder="Nhập mã lô hàng"
                    className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-slate-400"
                />
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-primary/40 hover:text-primary hover:shadow-sm transition-all"
                >
                    <QrCodeIcon className="h-4 w-4 text-primary" />
                    Kiểm tra lô
                </button>
            </form>

            {scanCode && (
                <div className="mt-4 rounded-2xl border border-gray-100 p-3 text-xs">
                    {isLoading ? (
                        <p className="text-slate-500 animate-pulse">Đang quét...</p>
                    ) : isError ? (
                        <p className="text-red-600 font-semibold">Không tìm thấy lô hàng hoặc lỗi hệ thống.</p>
                    ) : scanData ? (
                        <div className="space-y-1.5 shadow-sm bg-slate-50/50 p-2 rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-slate-800">{scanData.productName || "-"}</p>
                                <span className="text-[10px] font-black bg-primary text-white border border-primary px-2 py-0.5 rounded-lg uppercase shadow-sm">ID: {scanData.batchId || "-"}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <p className="text-slate-600 font-medium">Code: <span className="text-slate-900 font-bold">{scanData.batchCode || "-"}</span></p>
                                <p className="text-slate-600 font-medium">Số lượng: <span className="text-slate-900 font-bold">{scanData.quantityPhysical ?? scanData.currentQuantity ?? 0}</span></p>
                                <p className="text-slate-600 font-medium">Trạng thái: <span className="text-slate-900 font-bold uppercase">{scanData.status || "-"}</span></p>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
