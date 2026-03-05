"use client";

import { useRef } from "react";
import {
  PlusIcon,
  ArrowPathIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useUpload } from "@/hooks/useUpload";

interface ImageUploadProps {
  value: string; // URL ảnh từ Cloudinary
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage } = useUpload(); // Sử dụng mutation từ hook của bạn

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Thực hiện upload binary thông qua Mutation
      const response = await uploadImage.mutateAsync(file);

      // 2. Lấy URL trả về (response chính là payload.data hoặc res.data)
      const imageUrl = response?.url;

      if (imageUrl) {
        onChange(imageUrl); // Truyền URL về cho ProductCreateModal
      }
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
    } finally {
      // Reset input để có thể chọn lại cùng một file nếu cần
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div
      className="relative h-64 w-full cursor-pointer overflow-hidden rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-blue-400 group"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {uploadImage.isPending ? (
        <div className="flex h-full flex-col items-center justify-center space-y-3 bg-white/60 backdrop-blur-sm">
          <ArrowPathIcon className="h-10 w-10 animate-spin text-blue-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Đang đưa gà lên kho...
          </p>
        </div>
      ) : value ? (
        <div className="relative h-full w-full">
          <img
            src={value}
            alt="Preview"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="p-4 bg-white rounded-full text-red-500 shadow-2xl hover:scale-110 active:scale-90 transition-all group/btn"
              >
                <XMarkIcon className="h-6 w-6 stroke-[3px]" />
              </button>
              <div className="p-4 bg-white/20 rounded-full text-white backdrop-blur-md border border-white/30 hover:scale-110 transition-all">
                <PlusIcon className="h-6 w-6 stroke-[3px]" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-3 text-slate-300 transition-all duration-300">
          <PlusIcon className="h-12 w-12 transition-transform duration-300 group-hover:scale-125 group-hover:text-blue-400 group-hover:rotate-90" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            Nhấp để tải ảnh gà
          </p>
        </div>
      )}
    </div>
  );
}
