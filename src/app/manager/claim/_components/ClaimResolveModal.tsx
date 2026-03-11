"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResolveClaimBody, ResolveClaimBodyType } from "@/schemas/claim";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* HEADER */}
        <DialogHeader className="bg-slate-50/50 px-10 py-8 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
          <div>
            <DialogTitle className="text-2xl font-black font-display tracking-wider uppercase text-text-main leading-none">
              Xử lý <span className="text-primary">Khiếu nại</span>
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
        <div className="p-10 max-h-[70vh] overflow-y-auto">
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
                        className="rounded-[1.5rem] p-6 font-bold text-slate-900 border-slate-200 focus:ring-4 ring-primary/10 transition-all min-h-120px placeholder:text-slate-300 placeholder:italic"
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
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "flex-2 px-12 py-5 rounded-full text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50",
                    currentStatus === "approved"
                      ? "bg-primary hover:bg-emerald-600"
                      : "bg-primary hover:bg-red-600",
                  )}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ShieldCheckIcon className="w-4 h-4 stroke-[3px]" />
                  )}
                  Xác nhận xử lý
                </button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

