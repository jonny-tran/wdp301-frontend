"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClaim } from "@/hooks/useClaim";
import {
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import { Claim, ClaimItem } from "@/types/claim";
import Can from "@/components/shared/Can";
import { P } from "@/lib/authz";
import { Resource } from "@/utils/constant";

/** Map ClaimStatus → Vietnamese label & badge color */
const STATUS_MAP: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Chờ duyệt",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  approved: {
    label: "Chấp nhận",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

interface ClaimResolveModalProps {
  claimId: string | null;
  isOpen: boolean;
  onClose: () => void;
  detailData: Claim | null;
  isLoading: boolean;
}

export default function ClaimResolveModal({
  claimId,
  isOpen,
  onClose,
  detailData,
  isLoading,
}: ClaimResolveModalProps) {
  const { resolveClaim } = useClaim();
  const [note, setNote] = useState("");

  // Reset note khi đóng modal
  /* eslint-disable react-hooks/set-state-in-effect -- Safe: reset local state on modal close */
  useEffect(() => {
    if (!isOpen) setNote("");
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleResolve = async (status: "approved" | "rejected") => {
    if (!claimId) return;
    try {
      await resolveClaim.mutateAsync({
        id: claimId,
        data: { status, resolutionNote: note },
      });
      onClose();
    } catch {
      // toast.error đã được handle trong onSuccess/onError của hook (nếu có)
    }
  };

  const claimInfo =
    (detailData as { data?: Claim } | null)?.data || detailData;

  const statusInfo = STATUS_MAP[claimInfo?.status || ""] || {
    label: claimInfo?.status || "---",
    className: "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl bg-white border-slate-200 rounded-2xl p-0 shadow-xl overflow-hidden"
        showCloseButton={false}
      >
        {/* HEADER */}
        <DialogHeader className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex flex-row items-center justify-between space-y-0 text-left pr-4">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-900 leading-none">
              Chi tiết khiếu nại
            </DialogTitle>
            <p
              className="text-xs text-slate-400 font-mono truncate max-w-[300px]"
              title={claimId || ""}
            >
              ID: {claimId}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <XMarkIcon className="h-5 w-5 stroke-[2.5px]" />
          </button>
        </DialogHeader>

        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-[3px] border-slate-100 border-t-primary rounded-full animate-spin" />
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Đang lấy bằng chứng...
            </p>
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto">
            {/* META GRID — 2 columns, clean enterprise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pt-5 pb-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Vận đơn liên kết
                </span>
                <span
                  className="text-sm font-bold text-slate-900 font-mono truncate max-w-[250px]"
                  title={claimInfo?.shipmentId}
                >
                  {claimInfo?.shipmentId || "---"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Trạng thái
                </span>
                <span
                  className={`inline-block w-fit px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${statusInfo.className}`}
                >
                  {statusInfo.label}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ngày tạo
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {claimInfo?.createdAt
                    ? new Date(claimInfo.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "---"}
                </span>
              </div>
              {claimInfo?.description && (
                <div className="flex flex-col gap-0.5 md:col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Mô tả
                  </span>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap break-words bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    {claimInfo.description}
                  </p>
                </div>
              )}
            </div>

            {/* DIVIDER */}
            <div className="border-t border-slate-100 mx-6" />

            {/* ITEMS LIST */}
            <div className="px-6 py-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sản phẩm khiếu nại ({claimInfo?.items?.length || 0})
              </h3>

              {!claimInfo?.items || claimInfo.items.length === 0 ? (
                <div className="py-8 text-center text-slate-300">
                  <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">Không có sản phẩm nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {claimInfo.items.map((item: ClaimItem, i: number) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      {/* Evidence image — aspect-square, rounded, border */}
                      {item.imageProofUrl ? (
                        <div className="shrink-0">
                          <Image
                            src={item.imageProofUrl}
                            alt={`Bằng chứng - ${item.productName}`}
                            width={128}
                            height={128}
                            className="aspect-square h-28 w-28 rounded-md object-cover border border-slate-200 shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/about.png";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="shrink-0 aspect-square h-28 w-28 rounded-md bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-300">
                          <PhotoIcon className="h-8 w-8 opacity-40" />
                          <span className="text-[9px] font-medium mt-1">
                            Không có ảnh
                          </span>
                        </div>
                      )}

                      {/* Item details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {item.productName}
                          </h4>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">
                            Batch: {item.batchCode || "---"}
                          </span>
                        </div>

                        <div className="flex gap-6 mt-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-red-600 uppercase">
                              Hỏng
                            </span>
                            <span className="text-xl font-bold text-slate-900 leading-none">
                              {item.quantityDamaged}
                            </span>
                          </div>
                          <div className="flex flex-col border-l border-slate-200 pl-6">
                            <span className="text-[10px] font-bold text-amber-600 uppercase">
                              Thiếu
                            </span>
                            <span className="text-xl font-bold text-slate-900 leading-none">
                              {item.quantityMissing}
                            </span>
                          </div>
                        </div>

                        {item.reason && (
                          <p className="text-xs text-slate-600 mt-3 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100 whitespace-pre-wrap break-words">
                            &ldquo;{item.reason}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RESOLUTION NOTE (already resolved) */}
            {claimInfo?.resolutionNote && (
              <>
                <div className="border-t border-slate-100 mx-6" />
                <div className="px-6 py-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Ghi chú xử lý
                  </h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap break-words bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    {claimInfo.resolutionNote}
                  </p>
                </div>
              </>
            )}

            {/* RESOLVE FORM — Only for pending claims */}
            {claimInfo?.status === "pending" && (
              <div className="px-6 pb-6 pt-2 space-y-4 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Ghi chú xử lý (Resolution Note)
                  </label>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 outline-none transition-all placeholder:text-slate-400 resize-none"
                    rows={3}
                    placeholder="Nhập lý do chấp nhận hoặc từ chối..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Can I={P.CLAIM_RESOLVE} on={Resource.CLAIM}>
                    <button
                      disabled={resolveClaim.isPending}
                      onClick={() => handleResolve("approved")}
                      className="flex-1 py-3.5 bg-green-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                      <CheckIcon className="h-4 w-4 stroke-[3px]" />
                      Chấp nhận
                    </button>
                    <button
                      disabled={resolveClaim.isPending}
                      onClick={() => handleResolve("rejected")}
                      className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98] border border-slate-200 disabled:opacity-50"
                    >
                      <XMarkIcon className="h-4 w-4 stroke-[3px]" />
                      Từ chối
                    </button>
                  </Can>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
