"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { CalendarIcon, CubeIcon } from "@heroicons/react/24/outline";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUpload } from "@/hooks/useUpload";
import { UpdateBatchBodyType } from "@/schemas/product";
import { Batch } from "@/types/product";
import { BatchStatus } from "@/utils/enum";

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateBatchBodyType) => void;
  initialData?: Batch | null;
  isPending?: boolean;
}

const BATCH_STATUS_OPTIONS = [
  { value: BatchStatus.AVAILABLE, label: "Sẵn sàng" },
  { value: BatchStatus.PENDING, label: "Chờ xử lý" },
  { value: BatchStatus.EMPTY, label: "Hết hàng" },
  { value: BatchStatus.EXPIRED, label: "Hết hạn" },
];

export function BatchModal({ isOpen, onClose, onSubmit, initialData, isPending }: BatchModalProps) {
  const { uploadImage } = useUpload();
  
  // Sử dụng react-hook-form để tránh lỗi setState trong useEffect
  const { register, handleSubmit, setValue, watch, reset } = useForm<UpdateBatchBodyType>();
  const currentImageUrl = watch("imageUrl");

  // Sync dữ liệu khi initialData thay đổi mà không gây cascading render
  useEffect(() => {
    if (initialData) {
      reset({
        initialQuantity: initialData.initialQuantity ?? initialData.currentQuantity,
        imageUrl: initialData.imageUrl ?? "",
        status: initialData.status as BatchStatus,
      });
    }
  }, [initialData, reset]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const response = await uploadImage.mutateAsync(file);
      if (response?.url) setValue("imageUrl", response.url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-2 border-black rounded-2xl">
        <DialogHeader className="border-b-2 border-black pb-2">
          <DialogTitle className="flex items-center gap-2 uppercase font-bold text-sm">
            <CubeIcon className="h-5 w-5" />
            Cập nhật lô hàng - {initialData?.batchCode}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          {/* Avatar / Image Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 rounded-full border-2 border-black overflow-hidden bg-gray-100">
              {currentImageUrl ? (
                <Image
                  src={currentImageUrl}
                  alt="Batch Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400 font-bold">NO IMG</div>
              )}
            </div>
            <Label htmlFor="file-upload" className="cursor-pointer text-xs font-bold underline hover:text-blue-600">
              {uploadImage.isPending ? "Đang tải..." : "Thay đổi ảnh"}
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Hạn sử dụng - Read only display */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" /> Hạn sử dụng
              </Label>
              <div className="p-2 border-2 border-black rounded-lg text-sm font-bold text-red-600 bg-gray-50">
                {initialData?.expiryDate ? new Date(initialData.expiryDate).toLocaleDateString("vi-VN") : "N/A"}
              </div>
            </div>

            {/* Trạng thái - Shadcn Select */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-gray-500">Trạng thái</Label>
              <Select 
                value={watch("status")} 
                onValueChange={(val) => setValue("status", val as BatchStatus)}
              >
                <SelectTrigger className="border-2 border-black font-medium" aria-label="Chọn trạng thái">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {BATCH_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Số lượng hiện tại */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-gray-500">Tồn kho hiện tại</Label>
              <div className="p-2 border-2 border-black rounded-lg text-sm font-bold text-green-600 bg-gray-50">
                {initialData?.currentQuantity ?? 0}
              </div>
            </div>

            {/* Thay đổi số lượng gốc */}
            <div className="space-y-1">
              <Label className="text-[10px] font-bold uppercase text-gray-500">Số lượng ban đầu</Label>
              <Input
                type="number"
                step="0.1"
                {...register("initialQuantity", { valueAsNumber: true })}
                className="border-2 border-black focus-visible:ring-0"
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button variant="outline" type="button" onClick={onClose} className="flex-1 border-2 border-black font-bold uppercase">
              Hủy
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 bg-black text-white font-bold uppercase hover:bg-gray-800">
              {isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}