import { DocumentTextIcon, TruckIcon, CalendarDaysIcon, InboxArrowDownIcon } from "@heroicons/react/24/outline";

interface InboundDraftBoardProps {
    drafts: Record<string, any>[];
    isLoading: boolean;
    isError: boolean;
    onSelect: (receiptId: string, receiptCode: string) => void;
}

export default function InboundDraftBoard({
    drafts,
    isLoading,
    isError,
    onSelect,
}: InboundDraftBoardProps) {
    return (
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <div className="mb-6">
                <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <InboxArrowDownIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-black text-text-main tracking-tight">Inbound Draft Board</h3>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-text-muted">
                        Total: {drafts.length}
                    </span>
                </div>
                <p className="mt-1 text-sm text-text-muted">
                    List of draft incoming shipments scheduled for the kitchen.
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <p className="animate-pulse text-sm font-medium text-text-muted">Loading draft receipts...</p>
                </div>
            ) : isError ? (
                <div className="rounded-2xl bg-red-50 p-6 text-center">
                    <p className="text-sm font-bold text-red-600">Error: Could not load draft receipts.</p>
                </div>
            ) : drafts.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-100 py-10 text-center">
                    <p className="text-sm font-medium text-text-muted italic">No draft receipts in queue.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {drafts.slice(0, 6).map((receipt, index) => (
                        <div
                            key={String(receipt.receiptId ?? receipt.id ?? index)}
                            onClick={() => onSelect(String(receipt.receiptId ?? receipt.id), receipt.receiptCode ?? `REC-${index + 1}`)}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.01] active:scale-[0.98]"
                        >
                            <div className="absolute -right-2 -top-2 opacity-[0.03] transition-opacity group-hover:opacity-[0.08]">
                                <DocumentTextIcon className="h-20 w-20 text-text-main" />
                            </div>

                            <div className="mb-3 flex items-center justify-between">
                                <span className="rounded-lg bg-primary/5 px-2 py-1 text-[10px] font-bold text-primary border border-primary/10">
                                    #{String(receipt.id).slice(0, 8).toUpperCase()}
                                </span>
                                <span className="text-[10px] font-medium text-text-muted">
                                    {new Date(receipt.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="mb-1 flex items-center gap-1.5 text-text-muted">
                                        <TruckIcon className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-wider">Supplier</span>
                                    </div>
                                    <p className="text-sm font-bold text-text-main leading-tight truncate">
                                        {String(receipt.supplierName ?? receipt.supplier?.name ?? "Unknown")}
                                    </p>
                                </div>

                                {receipt.note && (
                                    <div className="rounded-xl bg-gray-50/50 p-3 border border-gray-100/50">
                                        <p className="text-[11px] font-medium text-text-muted italic line-clamp-2">
                                            "{receipt.note}"
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-text-muted">
                                            {String(receipt.user?.username ?? receipt.createdBy?.username ?? "U")[0].toUpperCase()}
                                        </div>
                                        <span className="text-[10px] font-bold text-text-muted">
                                            {receipt.user?.username ?? receipt.createdBy?.username ?? "Staff"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-primary">
                                        <CalendarDaysIcon className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-black uppercase">Draft</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
