import { FormEvent } from "react";

interface ReportIssueCardProps {
    batchId: string;
    reason: string;
    isPending: boolean;
    onChangeBatchId: (value: string) => void;
    onChangeReason: (value: string) => void;
    onSubmit: (event: FormEvent) => void;
}

export default function ReportIssueCard({
    batchId,
    reason,
    isPending,
    onChangeBatchId,
    onChangeReason,
    onSubmit,
}: ReportIssueCardProps) {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-text-muted">Report Issue</h3>
            <form onSubmit={onSubmit} className="space-y-3">
                <input
                    value={batchId}
                    onChange={(event) => onChangeBatchId(event.target.value)}
                    placeholder="Enter Batch ID"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                    type="number"
                />
                <textarea
                    value={reason}
                    onChange={(event) => onChangeReason(event.target.value)}
                    placeholder="Reason"
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
                >
                    {isPending ? "Submitting..." : "Submit issue"}
                </button>
            </form>
        </div>
    );
}
