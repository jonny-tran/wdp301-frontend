"use client";

import { useInbound } from "@/hooks/useInbound";
import { ReceiptStatus } from "@/utils/enum";
import { Receipt } from "@/types/inbound";
import { InboxArrowDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import InboundDraftBoard from "./InboundDraftBoard";
import InboundHistoryColumn from "./InboundHistoryColumn";
import ReceiptDetailModal from "./ReceiptDetailModal";
import InboundCreateModal from "./InboundCreateModal";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

const QUERY_CONFIG = {
    page: 1,
    limit: 10,
    sortOrder: "DESC" as const,
};

export default function InboundClient() {
    const { receiptList, deleteReceipt } = useInbound();
    const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
    const [selectedReceiptCode, setSelectedReceiptCode] = useState<string>("");
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const draftReceiptsQuery = receiptList({
        ...QUERY_CONFIG,
        status: ReceiptStatus.DRAFT,
    });

    const completedReceiptsQuery = receiptList({
        ...QUERY_CONFIG,
        limit: 12,
        status: ReceiptStatus.COMPLETED,
    });

    const draftReceipts = useMemo(() => {
        const raw = draftReceiptsQuery.data;
        if (!raw) return [];
        const data = raw as { items?: unknown[]; data?: { items?: unknown[] } };
        return (Array.isArray(data.items) ? data.items : Array.isArray(data.data?.items) ? data.data.items : []) as Receipt[];
    }, [draftReceiptsQuery.data]);

    const completedReceipts = useMemo(() => {
        const raw = completedReceiptsQuery.data;
        if (!raw) return [];
        const data = raw as { items?: unknown[]; data?: { items?: unknown[] } };
        return (Array.isArray(data.items) ? data.items : Array.isArray(data.data?.items) ? data.data.items : []) as Receipt[];
    }, [completedReceiptsQuery.data]);

    const handleSelect = (id: string, code: string) => {
        setSelectedReceiptId(id);
        setSelectedReceiptCode(code);
        setIsDetailOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn phiếu nhập nháp này?\nThao tác này không thể hoàn tác.")) {
            return;
        }
        await deleteReceipt.mutateAsync(id);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                            <InboxArrowDownIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900">Nhập hàng</h1>
                            <p className="text-sm text-zinc-500">
                                Chốt phiếu để hệ thống tự sinh mã lô, đối soát số lượng và in nhãn.
                            </p>
                        </div>
                    </div>
                </div>
                <Can I={P.INBOUND_CREATE_RECEIPT} on={Resource.INBOUND}>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-[0.98]"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Tạo phiếu nhập
                    </button>
                </Can>
            </div>

            {/* Stacked full-width sections */}
            <InboundDraftBoard
                drafts={draftReceipts}
                isLoading={draftReceiptsQuery.isLoading}
                isError={draftReceiptsQuery.isError}
                onSelect={handleSelect}
                onDelete={handleDelete}
            />
            <InboundHistoryColumn
                receipts={completedReceipts}
                isLoading={completedReceiptsQuery.isLoading}
                isError={completedReceiptsQuery.isError}
                onSelect={handleSelect}
            />

            <ReceiptDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                receiptId={selectedReceiptId}
                receiptCode={selectedReceiptCode}
            />

            <InboundCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        </div>
    );
}
