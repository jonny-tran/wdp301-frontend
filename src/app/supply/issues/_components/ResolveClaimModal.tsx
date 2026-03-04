import { FormEvent } from "react";

interface ResolveClaimModalProps {
    claimNo?: number;
    status: "approved" | "rejected";
    note: string;
    isPending: boolean;
    onChangeStatus: (status: "approved" | "rejected") => void;
    onChangeNote: (note: string) => void;
    onClose: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function ResolveClaimModal({
    claimNo,
    status,
    note,
    isPending,
    onChangeStatus,
    onChangeNote,
    onClose,
    onSubmit,
}: ResolveClaimModalProps) {
    const title = claimNo ? `Giải quyết Khiếu nại #${claimNo}` : "Giải quyết Khiếu nại";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-text-main">{title}</h3>
                <p className="mt-1 text-sm text-text-muted">Chọn quyết định giải quyết cho khiếu nại này.</p>

                <form className="mt-4 space-y-4" onSubmit={onSubmit}>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-text-main">Quyết định</label>
                        <select
                            value={status}
                            onChange={(event) => onChangeStatus(event.target.value as "approved" | "rejected")}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                        >
                            <option value="approved">Duyệt</option>
                            <option value="rejected">Từ chối</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-text-main">Ghi chú giải quyết</label>
                        <textarea
                            value={note}
                            onChange={(event) => onChangeNote(event.target.value)}
                            rows={4}
                            placeholder="Thêm ghi chú (tùy chọn)"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                    </div>

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
                            disabled={isPending}
                            className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                        >
                            {isPending ? "Đang xử lý..." : "Xác nhận"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
