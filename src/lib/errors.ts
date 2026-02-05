import { toast } from "sonner";
import { UseFormSetError } from "react-hook-form";
import { ResponseError } from "@/types/base";

/* ================= ERROR CLASSES ================= */

export class HttpError extends Error {
    payload: ResponseError;

    constructor(payload: ResponseError) {
        super(payload.message);
        this.name = "HttpError";
        this.payload = payload;
    }
}

export class EntityError extends HttpError {
    constructor(payload: ResponseError) {
        super(payload);
        this.name = "EntityError";
    }
}

/* ================= HANDLE ERROR ================= */

interface HandleErrorParams {
    error: unknown;
    setError?: UseFormSetError<any>;
}

export const handleErrorApi = ({
    error,
    setError,
}: HandleErrorParams) => {


    if (error instanceof EntityError) {
        if (!setError) {

            return;
        }

        // map errors với setError
        const errors = error.payload.errors;
        if (errors && errors.length > 0) {
            errors.forEach((err) => {
                setError(err.field, {
                    type: "server",
                    message: err.message,
                });
            });
        }
        return;
    }


    if (error instanceof HttpError) {
        toast.error(error.message);
        return;
    }


    toast.error("Có lỗi không xác định xảy ra");
};