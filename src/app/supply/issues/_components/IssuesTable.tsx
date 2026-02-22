import { EyeIcon } from "@heroicons/react/24/outline";
import { formatDateTime, formatStatusLabel, getStatusBadgeClass } from "@/app/supply/_components/format";
import { ClaimStatus } from "@/utils/enum";
import { ClaimRow } from "./issues.types";

interface IssuesTableProps {
    claims: ClaimRow[];
    rowStart: number;
    isLoading: boolean;
    isError: boolean;
    onOpenDetail: (claimId: string) => void;
    onOpenResolve: (claim: ClaimRow) => void;
}

export default function IssuesTable({
    claims,
    rowStart,
    isLoading,
    isError,
    onOpenDetail,
    onOpenResolve,
}: IssuesTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 text-xs uppercase tracking-wide text-text-muted">
                    <tr>
                        <th className="px-6 py-3">No.</th>
                        <th className="px-6 py-3">Shipment</th>
                        <th className="px-6 py-3">Created</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-sm text-text-muted">Loading claims...</td>
                        </tr>
                    ) : isError ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-sm text-red-500">Failed to load claim list.</td>
                        </tr>
                    ) : claims.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-sm text-text-muted">No claims match current filters.</td>
                        </tr>
                    ) : (
                        claims.map((claim, index) => (
                            <tr key={claim.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-text-main">#{rowStart + index + 1}</td>
                                <td className="px-6 py-4 text-text-main">{claim.shipmentId ? "Available" : "-"}</td>
                                <td className="px-6 py-4 text-text-muted">{formatDateTime(claim.createdAt)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${getStatusBadgeClass(String(claim.status ?? ""))}`}>
                                        {formatStatusLabel(String(claim.status ?? ""))}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onOpenDetail(claim.id)}
                                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-text-main hover:border-primary/40 hover:text-primary"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                            Details
                                        </button>

                                        {claim.status === ClaimStatus.PENDING && (
                                            <button
                                                onClick={() => onOpenResolve(claim)}
                                                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark"
                                            >
                                                Resolve
                                            </button>
                                        )}
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
