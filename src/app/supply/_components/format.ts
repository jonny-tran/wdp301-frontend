import { HttpError } from "@/lib/errors";

export function formatDate(value?: string | Date | null) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

export function formatDateTime(value?: string | Date | null) {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatAmount(value?: string | number | null) {
    if (value === null || value === undefined || value === "") return "-";

    const parsed = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(parsed)) return String(value);

    return new Intl.NumberFormat("en-US").format(parsed);
}

export function getStatusBadgeClass(status?: string) {
    const normalized = (status || "").toLowerCase();

    if (normalized.includes("pending") || normalized.includes("draft") || normalized.includes("preparing")) {
        return "bg-amber-100 text-amber-700";
    }
    if (normalized.includes("approved") || normalized.includes("completed") || normalized.includes("delivered")) {
        return "bg-green-100 text-green-700";
    }
    if (normalized.includes("transit") || normalized.includes("picking") || normalized.includes("delivering")) {
        return "bg-blue-100 text-blue-700";
    }
    if (normalized.includes("reject") || normalized.includes("cancel") || normalized.includes("claimed")) {
        return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
}

export function formatStatusLabel(status?: string) {
    if (!status) return "-";
    return status
        .replaceAll("_", " ")
        .trim()
        .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function isForceApproveError(error: unknown) {
    if (!(error instanceof HttpError)) return false;
    if (error.payload.statusCode !== 400) return false;

    const payload = error.payload as HttpError["payload"] & { canForce?: boolean };
    if (payload.canForce) return true;

    const message = String(payload.message || "").toLowerCase();
    return message.includes("20%") || message.includes("fill") || message.includes("dap ung") || message.includes("ty le");
}

export function getHttpErrorMessage(error: unknown) {
    if (error instanceof HttpError) {
        return error.payload.message;
    }
    return "Unknown error";
}
