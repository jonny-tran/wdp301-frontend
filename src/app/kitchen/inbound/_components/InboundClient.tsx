"use client";

import { useInbound } from "@/hooks/useInbound";
import { ReceiptStatus } from "@/utils/enum";
import { InboxArrowDownIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import InboundDraftBoard from "./InboundDraftBoard";
import ReceiptDetailModal from "./ReceiptDetailModal";

const QUERY_CONFIG = {
    page: 1,
    limit: 10,
    sortOrder: "DESC" as const,
};

export default function InboundClient() {
    const { receiptList, receiptDetail } = useInbound();
    const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
    const [selectedReceiptCode, setSelectedReceiptCode] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const draftReceiptsQuery = receiptList({
        ...QUERY_CONFIG,
        status: ReceiptStatus.DRAFT
    });

    const receiptDetailQuery = receiptDetail(selectedReceiptId || "");

    const draftReceipts = useMemo(() => {
        const data = (draftReceiptsQuery.data ?? {}) as any;
        return Array.isArray(data.items) ? data.items : [];
    }, [draftReceiptsQuery.data]);

    const handleSelect = (id: string, code: string) => {
        setSelectedReceiptId(id);
        setSelectedReceiptCode(code);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-text-main tracking-tight flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                        <InboxArrowDownIcon className="h-7 w-7" />
                    </div>
                    Inbound Management
                </h1>
                <p className="text-text-muted pl-1">Professional goods receiving and shipment tracking.</p>
            </div>

            <InboundDraftBoard
                drafts={draftReceipts}
                isLoading={draftReceiptsQuery.isLoading}
                isError={draftReceiptsQuery.isError}
                onSelect={handleSelect}
            />

            <ReceiptDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                receiptCode={selectedReceiptCode}
                details={receiptDetailQuery.data}
                isLoading={receiptDetailQuery.isLoading}
            />
        </div>
    );
}
