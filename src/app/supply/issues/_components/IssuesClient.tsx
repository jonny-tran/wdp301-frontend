"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import BaseFilter, { FilterConfig } from "@/components/layout/BaseFilter";
import { BasePagination } from "@/components/layout/BasePagination";
import { useClaim } from "@/hooks/useClaim";
import { handleErrorApi } from "@/lib/errors";
import { ClaimStatus } from "@/utils/enum";
import { createPaginationSearchParams, normalizeMeta, parseListQuery, RawSearchParams } from "@/app/supply/_components/query";
import { formatStatusLabel } from "@/app/supply/_components/format";
import ClaimDetailModal from "./ClaimDetailModal";
import IssuesTable from "./IssuesTable";
import ResolveClaimModal from "./ResolveClaimModal";
import { extractClaims } from "./issues.mapper";
import { ClaimRow } from "./issues.types";

interface IssuesClientProps {
    searchParams: RawSearchParams;
}

export default function IssuesClient({ searchParams }: IssuesClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsHook = useSearchParams();
    const queryClient = useQueryClient();

    const parsedQuery = useMemo(
        () => parseListQuery(searchParams, { page: 1, limit: 10, sortOrder: "DESC" }),
        [searchParams],
    );

    const { claimList, claimDetail, resolveClaim } = useClaim();

    const listQuery = claimList({
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        sortOrder: parsedQuery.sortOrder,
        status: parsedQuery.status as ClaimStatus | undefined,
        search: parsedQuery.search,
        storeId: parsedQuery.storeId,
        fromDate: parsedQuery.fromDate,
        toDate: parsedQuery.toDate,
    });

    const claims = useMemo(() => extractClaims(listQuery.data), [listQuery.data]);
    const meta = useMemo(
        () => normalizeMeta((listQuery.data as { meta?: unknown } | undefined)?.meta, parsedQuery.page, parsedQuery.limit, claims.length),
        [claims.length, listQuery.data, parsedQuery.limit, parsedQuery.page],
    );
    const rowStart = (meta.currentPage - 1) * meta.itemsPerPage;

    const statusSummary = useMemo(() => {
        const summary = {
            pending: 0,
            approved: 0,
            rejected: 0,
            other: 0,
        };

        claims.forEach((claim) => {
            const status = String(claim.status ?? "").toLowerCase();
            if (status === ClaimStatus.PENDING) {
                summary.pending += 1;
            } else if (status === ClaimStatus.APPROVED) {
                summary.approved += 1;
            } else if (status === ClaimStatus.REJECTED) {
                summary.rejected += 1;
            } else {
                summary.other += 1;
            }
        });

        return summary;
    }, [claims]);

    const [detailTargetId, setDetailTargetId] = useState("");
    const [resolveTarget, setResolveTarget] = useState<ClaimRow | null>(null);
    const [resolveStatus, setResolveStatus] = useState<"approved" | "rejected">("approved");
    const [resolveNote, setResolveNote] = useState("");

    const detailQuery = claimDetail(detailTargetId);
    const detailClaimNo = useMemo(() => {
        const index = claims.findIndex((claim) => claim.id === detailTargetId);
        return index >= 0 ? rowStart + index + 1 : undefined;
    }, [claims, detailTargetId, rowStart]);
    const resolveClaimNo = useMemo(() => {
        if (!resolveTarget) return undefined;
        const index = claims.findIndex((claim) => claim.id === resolveTarget.id);
        return index >= 0 ? rowStart + index + 1 : undefined;
    }, [claims, resolveTarget, rowStart]);

    const filterConfig: FilterConfig[] = [
        {
            key: "search",
            label: "Search",
            type: "text",
            placeholder: "Claim ID / Shipment ID...",
            className: "md:col-span-2",
        },
        {
            key: "status",
            label: "Status",
            type: "select",
            options: Object.values(ClaimStatus).map((status) => ({
                label: formatStatusLabel(status),
                value: status,
            })),
        },
        {
            key: "limit",
            label: "Rows",
            type: "select",
            defaultValue: String(parsedQuery.limit),
            options: [
                { label: "10", value: "10" },
                { label: "20", value: "20" },
                { label: "50", value: "50" },
            ],
        },
        {
            key: "sortOrder",
            label: "Sort",
            type: "select",
            defaultValue: parsedQuery.sortOrder,
            options: [
                { label: "Newest", value: "DESC" },
                { label: "Oldest", value: "ASC" },
            ],
        },
        {
            key: "fromDate",
            label: "From",
            type: "date",
        },
        {
            key: "toDate",
            label: "To",
            type: "date",
        },
    ];

    const handlePageChange = (nextPage: number) => {
        const query = createPaginationSearchParams(searchParamsHook, nextPage);
        router.push(`${pathname}?${query}`);
    };

    const handleRefresh = () => {
        listQuery.refetch();
        if (detailTargetId) {
            detailQuery.refetch();
        }
    };

    const handleResolveSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!resolveTarget) return;

        try {
            await resolveClaim.mutateAsync({
                id: resolveTarget.id,
                data: {
                    status: resolveStatus,
                    resolutionNote: resolveNote.trim() || undefined,
                },
            });

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["claim-list"] }),
                queryClient.invalidateQueries({ queryKey: ["claim-detail", resolveTarget.id] }),
            ]);

            if (detailTargetId === resolveTarget.id) {
                detailQuery.refetch();
            }
            setResolveTarget(null);
            setResolveStatus("approved");
            setResolveNote("");
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    const detailData = (detailQuery.data ?? {}) as Record<string, unknown>;
    const detailItems = Array.isArray(detailData.items) ? detailData.items : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black text-text-main">Issue & Claim</h1>
                    <p className="text-sm text-text-muted">Process claims through the backend flow: pending to approved/rejected.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-text-main hover:border-primary/50 hover:text-primary"
                >
                    <ArrowPathIcon className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatusSummaryCard label="Pending" value={statusSummary.pending} tone="amber" />
                <StatusSummaryCard label="Approved" value={statusSummary.approved} tone="green" />
                <StatusSummaryCard label="Rejected" value={statusSummary.rejected} tone="red" />
                <StatusSummaryCard label="Total Records" value={meta.totalItems} tone="default" />
            </div>

            <BaseFilter filters={filterConfig} />

            <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
                <IssuesTable
                    claims={claims}
                    rowStart={rowStart}
                    isLoading={listQuery.isLoading}
                    isError={listQuery.isError}
                    onOpenDetail={setDetailTargetId}
                    onOpenResolve={setResolveTarget}
                />

                <div className="border-t border-gray-100 px-6 py-4">
                    <BasePagination
                        currentPage={meta.currentPage}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                        totalItems={meta.totalItems}
                        itemsPerPage={meta.itemsPerPage}
                    />
                </div>
            </section>

            {resolveTarget && (
                <ResolveClaimModal
                    claimNo={resolveClaimNo}
                    status={resolveStatus}
                    note={resolveNote}
                    isPending={resolveClaim.isPending}
                    onChangeStatus={setResolveStatus}
                    onChangeNote={setResolveNote}
                    onClose={() => {
                        setResolveTarget(null);
                        setResolveStatus("approved");
                        setResolveNote("");
                    }}
                    onSubmit={handleResolveSubmit}
                />
            )}

            {detailTargetId && (
                <ClaimDetailModal
                    claimNo={detailClaimNo}
                    onClose={() => setDetailTargetId("")}
                    isLoading={detailQuery.isLoading}
                    isError={detailQuery.isError}
                    detailData={detailData}
                    detailItems={detailItems}
                />
            )}
        </div>
    );
}

function StatusSummaryCard({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: "default" | "amber" | "green" | "red";
}) {
    const toneClass =
        tone === "amber"
            ? "bg-amber-50 text-amber-700"
            : tone === "green"
                ? "bg-green-50 text-green-700"
                : tone === "red"
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-50 text-text-main";

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">{label}</p>
            <p className={`mt-2 inline-flex rounded-lg px-2.5 py-1 text-sm font-bold ${toneClass}`}>{value}</p>
        </div>
    );
}
