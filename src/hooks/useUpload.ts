'use client'

import { uploadRequest } from "@/apiRequest/upload";
import { handleErrorApi } from "@/lib/errors";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpload = () => {
    const uploadImage = useMutation({
        mutationFn: async (file: File) => {
            const res = await uploadRequest.uploadImage(file)
            return res.data
        },
        onSuccess: () => {
            toast.success('Upload image successfully')
        },
        onError: () => {
            handleErrorApi({ error: 'Vui lòng chọn đúng định dạng file (png|jpeg|jpg|webp)' })
        }
    })
    return {
        uploadImage
    }
}
