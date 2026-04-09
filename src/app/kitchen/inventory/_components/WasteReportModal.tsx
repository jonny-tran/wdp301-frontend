"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useInventory } from "@/hooks/useInventory";
import { useUpload } from "@/hooks/useUpload";
import { handleErrorApi } from "@/lib/errors";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    const { uploadImage } = useUpload();
    const [reason, setReason] = useState<"EXPIRED" | "DAMAGED" | "">("");
    const [note, setNote] = useState("");
    const [quantity, setQuantity] = useState<number>(physicalQuantity > 0 ? physicalQuantity : 0);
    const [evidenceImage, setEvidenceImage] = useState("");

    const exceedsFivePercent = physicalQuantity > 0 && quantity > physicalQuantity * 0.05;

    const onSubmit = async () => {
        if (!reason) return;
        try {
            await reportWaste.mutateAsync({
                batchId,
                quantity,
                reason,
                note: note.trim() || undefined,
                evidenceImage: evidenceImage.trim() || undefined,
            });
            onOpenChange(false);
            setReason("");
            setNote("");
            setEvidenceImage("");
            setQuantity(physicalQuantity > 0 ? physicalQuantity : 0);
        } catch (error) {
            handleErrorApi({ error });
        }
    };

    const disabled =
        reportWaste.isPending ||
        uploadImage.isPending ||
        !reason ||
        physicalQuantity <= 0 ||
        quantity <= 0 ||
        quantity > physicalQuantity ||
        (exceedsFivePercent && !evidenceImage.trim());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Báo hủy lô (Waste)</DialogTitle>
                    <DialogDescription>
                        {productName} · lô {batchCode} · tồn vật lý hiện tại: {physicalQuantity} {unit}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="space-y-1">
                        <Label>Số lượng hủy</Label>
                        <Input
                            type="number"
                            min={0}
                            max={physicalQuantity}
                            step="any"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <p className="text-xs text-zinc-500">
                            Nếu hủy lớn hơn 5% tồn vật lý, bắt buộc tải ảnh chứng minh.
                        </p>
                    </div>
                    <div className="space-y-1">
                        <Label>Lý do tiêu hủy</Label>
                        <select
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            value={reason}
                            onChange={(e) => setReason(e.target.value as "EXPIRED" | "DAMAGED" | "")}
                        >
                            <option value="">-- Chọn lý do --</option>
                            <option value="EXPIRED">EXPIRED - Hết hạn</option>
                            <option value="DAMAGED">DAMAGED - Hỏng hóc</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <Label>Ghi chú</Label>
                        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Chi tiết thêm (tuỳ chọn)..." />
                    </div>
                    <div className="space-y-1">
                        <Label>Ảnh chứng minh {exceedsFivePercent ? <span className="text-red-600">*</span> : null}</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                    const uploaded = await uploadImage.mutateAsync(file);
                                    const url = (uploaded as { url?: string; imageUrl?: string })?.url ?? (uploaded as { imageUrl?: string })?.imageUrl;
                                    if (url) setEvidenceImage(url);
                                } catch (error) {
                                    handleErrorApi({ error });
                                } finally {
                                    if (e.target) e.target.value = "";
                                }
                            }}
                        />
                        {evidenceImage && <p className="text-xs text-emerald-700">Đã tải ảnh chứng minh.</p>}
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

