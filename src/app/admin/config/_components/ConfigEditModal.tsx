"use client";

import { useEffect, useState } from "react";
import { SystemConfig } from "./ConfigClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: SystemConfig | null;
  onSave: (key: string, value: string, description: string) => void;
  isPending: boolean;
}

export default function ConfigEditModal({
  isOpen,
  onClose,
  config,
  onSave,
  isPending,
}: Props) {
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- Safe: syncs config prop to local state */
  useEffect(() => {
    if (config) {
      setValue(config.value);
      setDesc(config.description);
    }
  }, [config]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!config) return null;

  const handleConfirmSave = () => {
    onSave(config.key, value, desc);
    setShowConfirm(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-0 border-slate-200 shadow-xl overflow-hidden z-[120]">
          {/* HEADER */}
          <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col justify-center space-y-0 text-left pr-10">
            <div className="flex flex-col">
              <DialogTitle className="text-lg font-bold text-slate-900">
                Sửa cấu hình
              </DialogTitle>
              <span className="text-xs font-bold text-primary font-mono mt-0.5">
                {config.key}
              </span>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-5">
            {/* WARNING */}
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Thay đổi cấu hình có thể ảnh hưởng trực tiếp đến toàn bộ
                hệ thống vận hành. Hãy kiểm tra kỹ trước khi lưu.
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">
                  Giá trị mới
                </label>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="rounded-xl bg-slate-50 border-slate-200 px-4 py-3 text-sm font-bold text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">
                  Mô tả tác vụ
                </label>
                <Textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="rounded-xl bg-slate-50 border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 resize-none"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowConfirm(true)}
              disabled={isPending || !value.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:bg-slate-200"
            >
              {isPending ? (
                "Đang lưu..."
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 stroke-[3px]" /> Xác nhận thay
                  đổi
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION DIALOG */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
              Xác nhận thay đổi cấu hình
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sắp thay đổi tham số{" "}
              <span className="font-bold text-slate-900 font-mono">
                {config.key}
              </span>{" "}
              thành{" "}
              <span className="font-bold text-primary">{value}</span>.
              Thay đổi này sẽ ảnh hưởng đến toàn hệ thống ngay lập tức.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSave}
              className="rounded-xl bg-primary hover:bg-primary/90"
            >
              Đồng ý thay đổi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
