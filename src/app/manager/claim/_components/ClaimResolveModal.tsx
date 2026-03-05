"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClaim } from "@/hooks/useClaim";
import { toast } from "sonner";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { Claim } from "@/types/claim";
import { ResolveClaimBody, ResolveClaimBodyType } from "@/schemas/claim";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleErrorApi } from "@/lib/errors";

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

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResolveClaimBodyType>({
    resolver: zodResolver(ResolveClaimBody) as any,
    defaultValues: {
      resolutionNote: "",
    },
  });

  // Reset khi mở/đóng modal
  useEffect(() => {
    if (isOpen) {
      reset({ resolutionNote: "" });
    }
  }, [isOpen, reset]);

  const onResolve = async (status: "approved" | "rejected", data: ResolveClaimBodyType) => {
    if (!claimId) return;
    try {
      await resolveClaim.mutateAsync({
        id: claimId,
        data: { ...data, status },
      });
      onClose();
    } catch (error) {
      handleErrorApi({
        error,
        setError,
      });
    }
  };

  const claimInfo = (detailData as any)?.data || detailData; // Phòng thủ cấu trúc lồng nhau

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-[2.5rem] p-10 bg-white border-none shadow-2xl outline-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic text-black leading-none">
            Chi tiết khiếu nại
          </DialogTitle>
          <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mt-2">
            ID: {claimId}
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="py-20 text-center font-black text-slate-200 animate-pulse uppercase text-xs">
            Đang lấy bằng chứng...
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Danh sách Item lỗi */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
              {claimInfo?.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-5 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-black transition-all"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-black uppercase italic text-sm">
                        {item.productName}
                      </h4>
                      <span className="text-[9px] font-bold text-black/40 uppercase">
                        Batch: {item.batchCode}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-red-600 uppercase">
                          Hỏng
                        </span>
                        <span className="text-xl font-black italic italic leading-none">
                          {item.quantityDamaged}
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-slate-200 pl-4">
                        <span className="text-[9px] font-black text-orange-500 uppercase">
                          Thiếu
                        </span>
                        <span className="text-xl font-black italic italic leading-none">
                          {item.quantityMissing}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-black/60 mt-3 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 italic">
                      "{item.reason}"
                    </p>
                  </div>
                  {item.imageProofUrl && (
                    <img
                      src={item.imageProofUrl}
                      alt="Evidence"
                      className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white group-hover:scale-105 transition-transform"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Form Phản hồi */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-black/40 uppercase tracking-widest ml-2">
                  Ghi chú xử lý (Resolution Note)
                </label>
                <textarea
                  {...register("resolutionNote")}
                  className={`w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-xs font-bold text-black focus:border-black outline-none transition-all placeholder:text-slate-300 ${errors.resolutionNote ? "border-red-500 bg-red-50" : ""}`}
                  rows={3}
                  placeholder="Nhập lý do chấp nhận hoặc từ chối..."
                />
                {errors.resolutionNote && <p className="text-[10px] text-red-500 ml-2">{errors.resolutionNote.message}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit((data) => onResolve("approved", data))}
                  className="flex-1 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4 stroke-[3px]" />
                  Chấp nhận
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit((data) => onResolve("rejected", data))}
                  className="flex-1 py-4 bg-slate-100 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <XMarkIcon className="h-4 w-4 stroke-[3px]" />
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

