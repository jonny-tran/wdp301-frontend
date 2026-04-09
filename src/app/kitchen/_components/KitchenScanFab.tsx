"use client";

import { useState } from "react";
import { QrCodeIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWarehouse } from "@/hooks/useWarehouse";
import { ScanCheckResult } from "@/types/warehouse";

/**
 * Nút nổi toàn kitchen: mở modal tra cứu nhanh batchCode.
 */
export default function KitchenScanFab() {
    const { verifyScanCheck } = useWarehouse();
    const [open, setOpen] = useState(false);
    const [batchCode, setBatchCode] = useState("");
    const [result, setResult] = useState<ScanCheckResult | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const onSearch = async () => {
        const code = batchCode.trim();
        if (!code) return;
        setSubmitted(true);
        const data = await verifyScanCheck.mutateAsync(code);
        setResult(data);
    };

    const onOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            setBatchCode("");
            setResult(null);
            setSubmitted(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => onOpenChange(true)}
                className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-zinc-900 text-white shadow-lg transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                aria-label="Mở tra cứu batch code"
            >
                <QrCodeIcon className="h-7 w-7" aria-hidden />
            </button>

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md border-zinc-200 bg-white text-zinc-900">
                    <DialogHeader>
                        <DialogTitle>Tra cứu batch code</DialogTitle>
                        <DialogDescription>
                            Nhập mã lô để kiểm tra nhanh thông tin hàng trong kho bếp.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="kitchen-scan-batch-code">Batch code</Label>
                            <Input
                                id="kitchen-scan-batch-code"
                                placeholder="VD: FGHAMCHK-20260402-1A89082A"
                                value={batchCode}
                                onChange={(e) => setBatchCode(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        void onSearch();
                                    }
                                }}
                            />
                        </div>

                        {verifyScanCheck.isPending ? (
                            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">Đang tra cứu...</div>
                        ) : null}

                        {!verifyScanCheck.isPending && result ? (
                            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-900">
                                <p><span className="font-medium">Sản phẩm:</span> {result.productName}</p>
                                <p><span className="font-medium">Batch ID:</span> {result.batchId ?? "—"}</p>
                                <p><span className="font-medium">Batch code:</span> {result.batchCode ?? "—"}</p>
                                <p><span className="font-medium">Hạn dùng:</span> {result.expiryDate ?? "—"}</p>
                                <p>
                                    <span className="font-medium">Số lượng tồn:</span>{" "}
                                    {result.quantityPhysical ?? result.currentQuantity ?? 0}
                                </p>
                                <p><span className="font-medium">Trạng thái:</span> {result.status}</p>
                            </div>
                        ) : null}

                        {!verifyScanCheck.isPending && submitted && !result ? (
                            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                                Không tìm thấy thông tin lô cho mã đã nhập.
                            </div>
                        ) : null}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Đóng
                        </Button>
                        <Button type="button" onClick={() => void onSearch()} disabled={!batchCode.trim() || verifyScanCheck.isPending}>
                            {verifyScanCheck.isPending ? "Đang kiểm tra..." : "Tra cứu"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
