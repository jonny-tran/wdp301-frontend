"use client";
<<<<<<< HEAD
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResolveClaimBody, ResolveClaimBodyType } from "@/schemas/claim";
=======

import { useEffect } from "react";
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
<<<<<<< HEAD
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
=======
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
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c

interface Props {
  isOpen: boolean;
  claimId: string | null;
  onClose: () => void;
  onSubmit: (id: string, data: ResolveClaimBodyType) => void;
  isLoading?: boolean;
}

export default function ResolveClaimModal({
  isOpen,
  claimId,
  onClose,
  onSubmit,
  isLoading,
<<<<<<< HEAD
}: Props) {
  // 1. Khởi tạo form với Zod validation
  const form = useForm<ResolveClaimBodyType>({
    resolver: zodResolver(ResolveClaimBody),
    defaultValues: {
      status: "approved",
      resolutionNote: "",
    },
  });

  const currentStatus = useWatch({
    control: form.control,
    name: "status",
  });
  const handleProcess = (data: ResolveClaimBodyType) => {
    if (claimId) {
      onSubmit(claimId, data);
    }
  };

=======
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

>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* HEADER */}
        <DialogHeader className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              Xử lý <span className="text-indigo-600">Khiếu nại</span>
            </DialogTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">
              ID: {claimId?.slice(0, 18)}...
            </p>
          </div>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
          >
            <XMarkIcon className="w-5 h-5 text-slate-400 stroke-[3px]" />
          </Button>
        </DialogHeader>

        {/* FORM BODY */}
        <div className="p-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleProcess)}
              className="space-y-8"
            >
              {/* SELECT STATUS: APPROVED OR REJECTED */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest ml-1">
                      Quyết định xử lý
                    </FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => field.onChange("approved")}
                        className={cn(
                          "flex items-center justify-center gap-3 py-6 rounded-[1.5rem] border-2 transition-all font-black uppercase italic text-[11px] tracking-widest",
                          currentStatus === "approved"
                            ? "bg-emerald-50 border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-500/10"
                            : "bg-white border-slate-100 text-slate-300 hover:border-slate-200",
                        )}
                      >
                        <CheckCircleIcon className="w-5 h-5 stroke-[2.5px]" />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("rejected")}
                        className={cn(
                          "flex items-center justify-center gap-3 py-6 rounded-[1.5rem] border-2 transition-all font-black uppercase italic text-[11px] tracking-widest",
                          currentStatus === "rejected"
                            ? "bg-red-50 border-red-500 text-red-600 shadow-lg shadow-red-500/10"
                            : "bg-white border-slate-100 text-slate-300 hover:border-slate-200",
                        )}
                      >
                        <XCircleIcon className="w-5 h-5 stroke-[2.5px]" />
                        Reject
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              {/* RESOLUTION NOTE */}
              <FormField
                control={form.control}
                name="resolutionNote"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 tracking-widest ml-1">
                      Ghi chú giải quyết
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập lý do phê duyệt hoặc từ chối khiếu nại này..."
                        className="rounded-[1.5rem] p-6 font-bold text-slate-900 border-slate-200 focus:ring-4 ring-indigo-500/10 transition-all min-h-120px placeholder:text-slate-300 placeholder:italic"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold italic text-red-500" />
                  </FormItem>
                )}
              />

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-5 rounded-full border border-slate-200 text-slate-400 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all italic"
                >
<<<<<<< HEAD
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex-2 px-12 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50",
                    currentStatus === "approved"
                      ? "bg-slate-900 hover:bg-emerald-600"
                      : "bg-slate-900 hover:bg-red-600",
                  )}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ShieldCheckIcon className="w-4 h-4 stroke-[3px]" />
                  )}
                  Xác nhận xử lý
=======
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
>>>>>>> 0da73fcc42b54874fcaea53673fda727cc87773c
                </button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

