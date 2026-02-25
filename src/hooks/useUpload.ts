'use client'

import { uploadRequest } from "@/apiRequest/upload";
import { handleErrorApi } from "@/lib/errors";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpload = () => {
  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      if (!file) throw new Error("Không có file nào được chọn");
      const res = await uploadRequest.uploadImage(file);
      return res.payload?.data || res.data; 
    },
    onSuccess: (data) => {
      if (data?.url) {
        toast.success('Tải ảnh lên kho thành công!');
      }
    },
    onError: (error: any) => {
      console.error("Chi tiết lỗi upload:", error);
      handleErrorApi(error); 
    }
  });
  return { uploadImage };
};