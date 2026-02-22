interface ForceApproveAllocationModalProps {
    orderNo?: number;
    message: string;
    isPending: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ForceApproveAllocationModal({
    orderNo,
    message,
    isPending,
    onClose,
    onConfirm,
}: ForceApproveAllocationModalProps) {
    const title = orderNo ? `Force Approve Order #${orderNo}` : "Force Approve Order";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-text-main">{title}</h3>
                <p className="mt-2 text-sm text-text-muted">{message || "Are you sure you want to force approve this order?"}</p>

                <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-text-main hover:border-primary/40"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                    >
                        {isPending ? "Processing..." : "Confirm approval"}
                    </button>
                </div>
            </div>
        </div>
    );
}
