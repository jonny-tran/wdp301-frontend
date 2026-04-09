import type { ApprovalSuggestion, ApprovalSuggestionLine, ApprovalSuggestionMode } from "@/types/order";

function readRecord(row: unknown): Record<string, unknown> {
    return row && typeof row === "object" ? (row as Record<string, unknown>) : {};
}

function pickNum(v: unknown, fallback = 0): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

function pickMode(v: unknown): ApprovalSuggestionMode | undefined {
    const s = String(v ?? "").toUpperCase();
    if (s === "FULL_APPROVE" || s === "PARTIAL_FULFILLMENT" || s === "NO_STOCK") {
        return s as ApprovalSuggestionMode;
    }
    return undefined;
}

function normalizeLine(raw: unknown): ApprovalSuggestionLine | null {
    const r = readRecord(raw);
    const productId = pickNum(r.productId ?? r.product_id);
    if (productId <= 0) return null;
    return {
        productId,
        productName: r.productName != null ? String(r.productName) : r.product_name != null ? String(r.product_name) : undefined,
        requested: pickNum(r.requested ?? r.quantityRequested ?? r.quantity_requested),
        atpAvailable: pickNum(r.atpAvailable ?? r.atp_available),
        suggestedApprove: pickNum(r.suggestedApprove ?? r.suggested_approve),
        canceledByStock: Boolean(r.canceledByStock ?? r.canceled_by_stock),
        mode: pickMode(r.mode),
        safetyMinimumExpiryDate:
            r.safetyMinimumExpiryDate != null
                ? String(r.safetyMinimumExpiryDate)
                : r.safety_minimum_expiry_date != null
                  ? String(r.safety_minimum_expiry_date)
                  : null,
    };
}

function unwrapData<T>(raw: unknown): T {
    if (raw && typeof raw === "object" && "data" in (raw as Record<string, unknown>)) {
        return (raw as { data: T }).data;
    }
    return raw as T;
}

/** Chuẩn hoá GET /orders/coordinator/:id/approval-suggestion (camelCase / snake_case). */
export function parseApprovalSuggestionPayload(raw: unknown): ApprovalSuggestion {
    const root = readRecord(unwrapData<unknown>(raw));
    const linesRaw = (root.lines ?? root.items) as unknown;
    const arr = Array.isArray(linesRaw) ? linesRaw : [];
    const lines: ApprovalSuggestionLine[] = [];
    for (const row of arr) {
        const line = normalizeLine(row);
        if (line) lines.push(line);
    }

    const globalSafety =
        root.safetyMinimumExpiryDate != null
            ? String(root.safetyMinimumExpiryDate)
            : root.safety_minimum_expiry_date != null
              ? String(root.safety_minimum_expiry_date)
              : undefined;

    let summarySuggestion: string | undefined;
    let summaryStatus: string | undefined;
    const ssRaw = root.summarySuggestion ?? root.summary_suggestion;
    if (ssRaw != null && typeof ssRaw === "object") {
        const ss = ssRaw as Record<string, unknown>;
        summaryStatus = ss.status != null ? String(ss.status) : ss.mode != null ? String(ss.mode) : undefined;
        summarySuggestion =
            ss.message != null
                ? String(ss.message)
                : ss.text != null
                  ? String(ss.text)
                  : ss.summary != null
                    ? String(ss.summary)
                    : undefined;
    } else if (ssRaw != null) {
        summarySuggestion = String(ssRaw);
    }
    if (summaryStatus == null) {
        summaryStatus =
            root.summaryStatus != null
                ? String(root.summaryStatus)
                : root.summary_status != null
                  ? String(root.summary_status)
                  : undefined;
    }

    return {
        orderId: root.orderId != null ? String(root.orderId) : root.order_id != null ? String(root.order_id) : undefined,
        lines,
        safetyMinimumExpiryDate: globalSafety ?? null,
        travelHoursUsed:
            root.travelHoursUsed != null
                ? pickNum(root.travelHoursUsed)
                : root.travel_hours_used != null
                  ? pickNum(root.travel_hours_used)
                  : undefined,
        bufferHours:
            root.bufferHours != null
                ? pickNum(root.bufferHours)
                : root.buffer_hours != null
                  ? pickNum(root.buffer_hours)
                  : undefined,
        summarySuggestion,
        summaryStatus,
    };
}
