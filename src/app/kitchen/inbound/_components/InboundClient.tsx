"use client";

import { useInbound } from "@/hooks/useInbound";
import { ReceiptStatus } from "@/utils/enum";
import { InboxArrowDownIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import InboundDraftBoard from "./InboundDraftBoard";
import InboundHistoryColumn from "./InboundHistoryColumn";
import ReceiptDetailModal from "./ReceiptDetailModal";
import InboundCreateModal from "./InboundCreateModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

const QUERY_CONFIG = {
    page: 1,
    limit: 10,
    sortOrder: "DESC" as const,
};

export default function InboundClient() {
    const { receiptList } = useInbound();
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
        const data = (draftReceiptsQuery.data ?? {}) as { items?: unknown[]; data?: { items?: unknown[] } };
        return Array.isArray(data.items) ? data.items : Array.isArray(data.data?.items) ? data.data.items : [];
    }, [draftReceiptsQuery.data]);

    const completedReceipts = useMemo(() => {
        const data = (completedReceiptsQuery.data ?? {}) as { items?: unknown[]; data?: { items?: unknown[] } };
        return Array.isArray(data.items) ? data.items : Array.isArray(data.data?.items) ? data.data.items : [];
    }, [completedReceiptsQuery.data]);

    const handleSelect = (id: string, code: string) => {
        setSelectedReceiptId(id);
        setSelectedReceiptCode(code);
        setIsDetailOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="flex flex-col gap-1">
                    <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-text-main">
                        <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                            <InboxArrowDownIcon className="h-7 w-7" />
                        </div>
                        Xác nhận hàng về (Inbound)
                    </h1>
                    <p className="pl-1 text-text-muted">
                        Chốt phiếu để hệ thống tự sinh mã lô (BAT-…), đối soát SL nhận với dự kiến và in nhãn ngay tại quầy.
                    </p>
                </div>
                <Can I={P.INBOUND_CREATE_RECEIPT} on={Resource.INBOUND}>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Tạo phiếu nháp
                    </button>
                </Can>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:items-start">
                <InboundDraftBoard
                    drafts={draftReceipts as Record<string, unknown>[]}
                    isLoading={draftReceiptsQuery.isLoading}
                    isError={draftReceiptsQuery.isError}
                    onSelect={handleSelect}
                />
                <InboundHistoryColumn
                    receipts={completedReceipts as Record<string, unknown>[]}
                    isLoading={completedReceiptsQuery.isLoading}
                    isError={completedReceiptsQuery.isError}
                    onSelect={handleSelect}
                />
            </div>

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
