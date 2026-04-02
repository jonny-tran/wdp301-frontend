/* eslint-disable @typescript-eslint/no-explicit-any */
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

  useEffect(() => {
    if (config && isOpen) {
      setValue(config.value);
      setDesc(config.description || "");
      setShowConfirm(false);
    }
  }, [config, isOpen]);

  if (!config) return null;

  const handleFinalSave = () => {
    onSave(config.key, value, desc);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-0 border-slate-200 shadow-xl overflow-hidden z-[120]">
        <DialogHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col justify-center space-y-0 text-left pr-10 relative">
          <div className="flex flex-col">
            <DialogTitle className="text-lg font-bold text-slate-900">
              {showConfirm ? "Xác nhận thay đổi" : "Sửa cấu hình"}
            </DialogTitle>
            <span className="text-xs font-bold text-primary font-mono mt-0.5">
              {config.key}
            </span>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* FIX: Hiển thị nội dung Warning tùy theo trạng thái showConfirm */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl transition-all duration-300">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[11px] font-bold text-amber-800 leading-relaxed italic">
              {showConfirm ? (
                <p>
                  Bạn đang thay đổi giá trị từ{" "}
                  <span className="text-slate-400 line-through">
                    {config.value}
                  </span>{" "}
                  sang
                  <span className="text-slate-900 font-black"> {value}</span>.
                  Hành động này sẽ áp dụng lên toàn bộ hệ thống ngay lập tức.
                </p>
              ) : (
                <p>
                  Thay đổi cấu hình có thể ảnh hưởng trực tiếp đến toàn bộ hệ
                  thống vận hành. Vui lòng kiểm tra kỹ giá trị và mô tả trước
                  khi tiếp tục.
                </p>
              )}
            </div>
          </div>

          {!showConfirm ? (
            <>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">
                    Giá trị mới
                  </label>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="rounded-xl bg-slate-50 border-slate-200 px-4 py-3 text-sm font-bold text-slate-900 shadow-inner"
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
                    className="rounded-xl bg-slate-50 border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 resize-none shadow-inner"
                  />
                </div>
              </div>

              <Button
                onClick={() => setShowConfirm(true)}
                disabled={isPending || !value.trim() || value === config.value}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:bg-slate-200 shadow-lg shadow-primary/20"
              >
                <CheckIcon className="h-4 w-4 stroke-[3px]" /> Tiếp tục
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <Button
                onClick={handleFinalSave}
                disabled={isPending}
                className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 shadow-lg shadow-red-100"
              >
                {isPending ? "Đang lưu..." : "ĐỒNG Ý THAY ĐỔI"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                className="w-full rounded-xl py-3 text-[10px] font-black uppercase italic text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                Quay lại chỉnh sửa
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
