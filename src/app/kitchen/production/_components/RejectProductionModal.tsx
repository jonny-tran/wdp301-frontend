"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ProductionOrder } from "@/types/production";

type RejectProductionModalProps = {
    open: boolean;
    order: ProductionOrder | null;
    isSubmitting: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (id: string, reason: string) => void;
};

export default function RejectProductionModal({
    open,
    order,
    isSubmitting,
    onOpenChange,
    onSubmit,
}: RejectProductionModalProps) {
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (open) setReason("");
    }, [open, order?.id]);

    if (!order) return null;
    const canSubmit = reason.trim().length >= 2 && !isSubmitting;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-2 border-zinc-800 bg-white text-zinc-950">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-black">
                        <AlertTriangle className="size-5 text-red-600" />
                        Từ chối lệnh sản xuất
                    </DialogTitle>
                    <DialogDescription asChild>
                        <p className="text-sm text-zinc-700">
                            <span className="font-semibold text-zinc-900">{order.productName}</span>
                            <span className="text-zinc-500"> · mục tiêu {order.targetQuantity} {order.unit}</span>
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-800">Lý do từ chối</label>
                    <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ví dụ: thiếu nhân sự ca đêm / máy đang bảo trì / thiếu nguyên liệu..."
                        className="min-h-[110px] border-2 border-zinc-300"
                    />
                    <p className="text-xs text-zinc-500">Tối thiểu 2 ký tự.</p>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        className="bg-red-700 text-white hover:bg-red-800"
                        disabled={!canSubmit}
                        onClick={() => onSubmit(order.id, reason.trim())}
                    >
                        {isSubmitting ? "Đang gửi..." : "Xác nhận từ chối"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

