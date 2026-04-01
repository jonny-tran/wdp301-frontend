"use client";

import { CalendarDays, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { CompleteProductionResult } from "@/types/production";

type ProductionCompleteSuccessModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    result: CompleteProductionResult | null;
    productName: string;
};

export default function ProductionCompleteSuccessModal({
    open,
    onOpenChange,
    result,
    productName,
}: ProductionCompleteSuccessModalProps) {
    const expiry = result?.outputExpiryDate ?? result?.expiryDate;
    const fmtExpiry =
        expiry &&
        (() => {
            try {
                return new Date(expiry).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
            } catch {
                return expiry;
            }
        })();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-2 border-emerald-700 bg-emerald-50 text-zinc-950">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black">
                        <PartyPopper className="size-7 text-emerald-700" aria-hidden />
                        Bước 3 — Đã nhập kho thành phẩm
                    </DialogTitle>
                    <DialogDescription className="text-base text-zinc-700">{productName}</DialogDescription>
                </DialogHeader>

                {result && (
                    <div className="space-y-4 rounded-xl border-2 border-emerald-600 bg-white p-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Mã lô TP mới</p>
                            <p className="mt-1 font-mono text-2xl font-black text-emerald-800">{result.batchCode}</p>
                        </div>
                        {fmtExpiry && (
                            <div className="flex items-start gap-2 text-zinc-800">
                                <CalendarDays className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        Hạn sử dụng (ước tính / từ hệ thống)
                                    </p>
                                    <p className="text-lg font-bold text-red-700">{fmtExpiry}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        className="h-12 w-full border-2 border-emerald-800 bg-emerald-700 text-base font-bold text-white hover:bg-emerald-800"
                        onClick={() => onOpenChange(false)}
                    >
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
