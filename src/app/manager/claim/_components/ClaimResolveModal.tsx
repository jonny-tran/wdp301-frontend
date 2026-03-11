"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResolveClaimBody, ResolveClaimBodyType } from "@/schemas/claim";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xử lý quyết định Khiếu nại</DialogTitle>
          <DialogDescription>
            ID: {claimId}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleProcess)} className="space-y-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Quyết định</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => field.onChange("approved")}
                        className={cn(
                          "flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-semibold transition-all",
                          field.value === "approved"
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500/20"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300",
                        )}
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Phê duyệt
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("rejected")}
                        className={cn(
                          "flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-semibold transition-all",
                          field.value === "rejected"
                            ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500/20"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300",
                        )}
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Từ chối
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resolutionNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú phản hồi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do phản hồi..."
                      className="bg-slate-50 border-slate-200 focus:ring-1 focus:ring-blue-400/50 resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                variant={currentStatus === "rejected" ? "destructive" : "default"}
                className={currentStatus === "approved" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
