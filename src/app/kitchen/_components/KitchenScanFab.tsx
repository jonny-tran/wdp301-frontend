"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProduct } from "@/hooks/useProduct";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function KitchenScanFab() {
  const [open, setOpen] = useState(false);
  const [rawId, setRawId] = useState("");
  const [lookupId, setLookupId] = useState<string | number>(0);
  const { batchDetail } = useProduct();
  const q = batchDetail(lookupId);

  const handleLookup = () => {
    const trimmed = rawId.trim();
    if (!trimmed) {
      setLookupId(0);
      return;
    }

    // Nếu chỉ toàn số thì coi là ID (number), ngược lại là mã lô (string)
    if (/^\d+$/.test(trimmed)) {
      setLookupId(parseInt(trimmed, 10));
    } else {
      setLookupId(trimmed);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setRawId("");
          setLookupId(0);
        }}
        className="fixed bottom-6 right-6 z-[90] flex h-16 w-16 items-center justify-center rounded-full border-4 border-zinc-900 bg-amber-400 text-zinc-950 shadow-[4px_4px_0_0_rgb(24_24_27)] transition-transform hover:scale-105 active:scale-95"
        aria-label="Quét / tra cứu mã lô"
      >
        <QrCodeIcon className="h-8 w-8" />
      </button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) {
            setLookupId(0);
            setRawId("");
          }
        }}
      >
        <DialogContent className="max-w-md border-2 border-zinc-900 bg-white text-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              Tra cứu lô (QR / ID)
            </DialogTitle>
            <DialogDescription className="text-base text-zinc-600">
              Nhập ID lô từ nhãn hoặc sau khi quét (tích hợp máy quét có thể
              điền ô dưới).
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Ví dụ: 42"
              value={rawId}
              onChange={(e) => setRawId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              className="h-14 border-2 border-zinc-800 text-lg font-bold"
            />
            <Button
              type="button"
              className="h-14 border-2 border-zinc-900 bg-zinc-900 px-8 text-base font-bold text-white"
              onClick={handleLookup}
            >
              Xem lô
            </Button>
          </div>

          {!!lookupId && q.isLoading && (
            <p className="text-center text-sm font-medium text-zinc-500">
              Đang tải…
            </p>
          )}
          {!!lookupId && q.isError && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
              Không tìm thấy lô hoặc lỗi mạng.
            </p>
          )}
          {q.data && (
            <div className="space-y-2 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4 text-sm">
              <p className="text-lg font-black text-zinc-900">
                {q.data.productName}
              </p>
              <p className="font-mono font-bold text-emerald-800">
                Mã lô: {q.data.batchCode}
              </p>
              <p>
                HSD:{" "}
                <span className="font-bold text-red-700">
                  {new Date(q.data.expiryDate).toLocaleDateString("vi-VN")}
                </span>
              </p>
              <p>
                Tồn hiện tại:{" "}
                <span className="font-black tabular-nums text-zinc-900">
                  {q.data.currentQuantity}
                </span>
              </p>
              <p className="text-xs text-zinc-600">
                Nguồn: GET batch — dùng nhanh trên sàn bếp, không thay thế kiểm
                kê đầy đủ.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
