"use client";

import { useState, useEffect } from "react";
import { SystemConfig } from "./config.types";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";

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

  useEffect(() => {
    if (config) {
      setValue(config.value);
      setDesc(config.description);
    }
  }, [config]);

  if (!isOpen || !config) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 space-y-6 shadow-2xl border border-slate-100 animate-in zoom-in">
        <div className="flex justify-between items-center border-b border-slate-50 pb-5">
          <div className="flex flex-col">
            <h3 className="text-xl font-black uppercase italic text-slate-900 tracking-tighter">
              Sửa cấu hình
            </h3>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              {config.key}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Giá trị mới
            </label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-full bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
              Mô tả tác vụ
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full rounded-3xl bg-slate-50 border border-slate-100 px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all resize-none"
            />
          </div>
        </div>

        <button
          onClick={() => onSave(config.key, value, desc)}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-slate-900 py-5 text-xs font-black text-white hover:bg-black transition-all active:scale-95 shadow-xl disabled:bg-slate-200"
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
