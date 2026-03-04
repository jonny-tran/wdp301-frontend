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
      return res.data
    },
    onSuccess: (data) => {
      toast.success('Tải ảnh thành công!');
    },
    onError: () => {
      handleErrorApi({ error: 'Vui lòng tải ảnh lên với kích thước nhỏ hơn 5MB' });
    }
  });
  return { uploadImage };
};