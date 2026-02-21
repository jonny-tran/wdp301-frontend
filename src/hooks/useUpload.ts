'use client'

import { uploadRequest } from "@/apiRequest/upload";
import { handleErrorApi } from "@/lib/errors";
import { useMutation } from "@tanstack/react-query";

export const useUpload = () => {
    const uploadImage = useMutation({
        mutationFn: async (file: File) => {
            const res = await uploadRequest.uploadImage(file)
            return res.data
        },
        onError: () => {
            handleErrorApi({ error: 'Vui lòng chọn đúng định dạng file (png|jpeg|jpg|webp)' })
        }
    })

    return {
        uploadImage
    }
}
