import { FormEvent } from "react";
interface RejectOrderModalProps {
    reason: string;
    isPending: boolean;
    onChangeReason: (value: string) => void;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RejectOrderModal({
    reason,
    isPending,
    onChangeReason,
    onClose,
    onSubmit,
}: RejectOrderModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-text-main">Từ chối Đơn hàng</h3>
                <p className="mt-1 text-sm text-text-muted">Hệ thống yêu cầu cung cấp lý do từ chối.</p>

                <form className="mt-4 space-y-4" onSubmit={onSubmit}>
                    <textarea
                        value={reason}
                        onChange={(event) => onChangeReason(event.target.value)}
                        rows={4}
                        required
                        placeholder="Nhập lý do từ chối"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                    />

                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-text-main hover:border-primary/40"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !reason.trim()}
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {isPending ? "Đang xử lý..." : "Xác nhận từ chối"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
