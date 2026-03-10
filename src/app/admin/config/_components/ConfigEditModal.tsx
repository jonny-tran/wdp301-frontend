"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { SystemConfig } from "./ConfigClient";

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

  /* eslint-disable react-hooks/set-state-in-effect -- Safe: syncs config prop to local state */
  useEffect(() => {
    if (config) {
      setValue(config.value);
      setDesc(config.description);
    }
  }, [config]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen || !config) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 space-y-6 shadow-2xl border border-slate-100 animate-in zoom-in">
        <div className="flex justify-between items-center border-b border-slate-50 pb-5">
          <div className="flex flex-col">
            <h3 className="text-xl font-black font-display tracking-wider uppercase text-text-main">
              Sửa cấu hình
            </h3>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              {config.key}
            </span>
          </div>
          <Button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Giá trị mới
            </label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Mô tả tác vụ
            </label>
            <Textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full rounded-3xl bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-primary transition-all resize-none"
            />
          </div>
        </div>

        <button
          onClick={() => onSave(config.key, value, desc)}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-primary py-5 text-xs font-black text-white hover:bg-primary-dark transition-all active:scale-95 shadow-xl disabled:bg-slate-200"
        >
          {isPending ? (
            "Đang lưu..."
          ) : (
            <>
              <CheckIcon className="h-4 w-4 stroke-[3px]" /> XÁC NHẬN THAY ĐỔI
            </>
          )}
        </button>
      </div>
    </div>
  );
}
