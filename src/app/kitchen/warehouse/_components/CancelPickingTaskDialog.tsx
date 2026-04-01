"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWarehouse } from "@/hooks/useWarehouse";

const MIN_REASON_LEN = 10;

export type CancelPickingTaskDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orderId: string;
    /** Tiêu đề dialog */
    title?: string;
    onSuccess?: () => void;
};

export default function CancelPickingTaskDialog({
    open,
    onOpenChange,
    orderId,
    title = "Hủy tác vụ soạn hàng",
    onSuccess,
}: CancelPickingTaskDialogProps) {
    const { cancelPickingTask } = useWarehouse();
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!open) setReason("");
    }, [open]);

    const trimmed = reason.trim();
    const canSubmit = trimmed.length >= MIN_REASON_LEN;

    const handleConfirm = async () => {
        if (!canSubmit || !orderId) return;
        try {
            await cancelPickingTask.mutateAsync({ orderId, reason: trimmed });
            onOpenChange(false);
            onSuccess?.();
        } catch {
            /* handleErrorApi trong mutation */
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-2 border-red-200 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-black text-red-700">{title}</DialogTitle>
                    <DialogDescription className="text-left text-sm text-zinc-600">
                        Thao tác này hủy đơn và giải phóng hàng giữ theo quy tắc hệ thống. Không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="warehouse-cancel-reason" className="font-bold text-zinc-800">
                        Lý do hủy (tối thiểu {MIN_REASON_LEN} ký tự)
                    </Label>
                    <Textarea
                        id="warehouse-cancel-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Ví dụ: Hỏng kệ, không truy cập được khu vực chứa lô, sai đơn trên hệ thống…"
                        className="min-h-[100px] border-2 border-zinc-300 text-sm"
                    />
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" className="font-bold" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        className="font-black"
                        disabled={!canSubmit || cancelPickingTask.isPending}
                        onClick={handleConfirm}
                    >
                        {cancelPickingTask.isPending ? "Đang xử lý…" : "Xác nhận hủy"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
