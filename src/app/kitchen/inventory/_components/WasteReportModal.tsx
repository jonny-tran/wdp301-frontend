"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useInventory } from "@/hooks/useInventory";
import { handleErrorApi } from "@/lib/errors";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type WasteReportModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    batchId: number;
    batchCode: string;
    productName: string;
    unit: string;
    physicalQuantity: number;
};

export default function WasteReportModal({
    open,
    onOpenChange,
    batchId,
    batchCode,
    productName,
    unit,
    physicalQuantity,
}: WasteReportModalProps) {
    const { reportWaste } = useInventory();
    const [reason, setReason] = useState<"EXPIRED" | "DAMAGED" | undefined>(undefined);
    const [note, setNote] = useState("");

    const onSubmit = async () => {
        if (!reason) return;
        try {
            await reportWaste.mutateAsync({
                batchId,
                reason,
                note: note.trim() || undefined,
            });
            onOpenChange(false);
            setReason(undefined);
            setNote("");
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    const disabled = reportWaste.isPending || reason == null || physicalQuantity <= 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-zinc-200 bg-white text-zinc-900">
                <DialogHeader>
                    <DialogTitle>Báo hủy lô (Waste)</DialogTitle>
                    <DialogDescription>
                        {productName} · lô {batchCode} · tồn vật lý hiện tại: {physicalQuantity} {unit}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Lý do tiêu hủy</Label>
                        <Select
                            value={reason}
                            onValueChange={(value) => setReason(value as "EXPIRED" | "DAMAGED")}
                        >
                            <SelectTrigger className="w-full bg-white text-zinc-900">
                                <SelectValue placeholder="-- Chọn lý do --" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-zinc-900">
                                <SelectItem value="EXPIRED">EXPIRED - Hết hạn</SelectItem>
                                <SelectItem value="DAMAGED">DAMAGED - Hỏng hóc</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Ghi chú</Label>
                        <Textarea
                            className="bg-white text-zinc-900"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Chi tiết thêm (tuỳ chọn)..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button type="button" disabled={disabled} onClick={() => void onSubmit()}>
                        {reportWaste.isPending ? "Đang gửi..." : "Gửi báo hủy"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

