import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const uploadRequest = {
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return http.post<{ url: string; public_id: string }>(ENDPOINT_CLIENT.UPLOAD_IMAGE, formData);
    }
};
