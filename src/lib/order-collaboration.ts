import type { OrderCollaborationEvent, OrderDetail } from "@/types/order";

function readRecord(row: unknown): Record<string, unknown> {
    return row && typeof row === "object" ? (row as Record<string, unknown>) : {};
}

function pickKind(s: unknown): OrderCollaborationEvent["kind"] {
    const u = String(s ?? "").toLowerCase();
    if (u.includes("reject") || u.includes("tu_choi") || u.includes("refus")) return "kitchen_reject";
    if (u.includes("accept") || u.includes("confirm") || u.includes("dong_y")) return "kitchen_accept";
    if (u.includes("request") || u.includes("yeu_cau") || u.includes("production")) return "request_production";
    return "unknown";
}

/** Đọc mảng log từ BE (nhiều dạng field / phần tử). */
export function parseCollaborationLogArray(raw: unknown): OrderCollaborationEvent[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((row) => {
        const r = readRecord(row);
        const at = String(
            r.occurredAt ?? r.occurred_at ?? r.createdAt ?? r.created_at ?? r.at ?? r.timestamp ?? "",
        );
        const title = String(r.title ?? r.message ?? r.action ?? r.type ?? "Sự kiện");
        const detail =
            r.detail != null
                ? String(r.detail)
                : r.note != null
                  ? String(r.note)
                  : r.description != null
                    ? String(r.description)
                    : undefined;
        const kind = (r.kind != null ? pickKind(r.kind) : pickKind(r.type)) as OrderCollaborationEvent["kind"];
        return {
            occurredAt: at || "—",
            kind: kind === "unknown" ? "system" : kind,
            title,
            detail,
        };
    });
}

export function isProductionConfirmedFlags(d: Pick<OrderDetail, "isProductionConfirmed" | "is_production_confirmed">): boolean {
    return Boolean(d.isProductionConfirmed ?? d.is_production_confirmed);
}

export function requiresProductionConfirmFlags(
    d: Pick<OrderDetail, "requiresProductionConfirm" | "requires_production_confirm">,
): boolean {
    return Boolean(d.requiresProductionConfirm ?? d.requires_production_confirm);
}

/** Gộp log từ API + gợi ý hiển thị từ cờ/note (khi BE chưa trả timeline đầy đủ). */
export function mergeCollaborationIntoOrderDetail(data: OrderDetail): OrderDetail {
    const rawLog =
        (data as { collaboration_log?: unknown }).collaboration_log ??
        (data as { collaborationLog?: unknown }).collaborationLog;
    const fromApi = parseCollaborationLogArray(rawLog);
    const extra: OrderCollaborationEvent[] = [];

    if (requiresProductionConfirmFlags(data)) {
        extra.push({
            occurredAt: data.updatedAt ?? data.createdAt ?? "—",
            kind: "request_production",
            title: "Đơn cần xác nhận sản xuất / đang phối hợp bếp",
            detail: data.note?.trim() || undefined,
        });
    }
    if (isProductionConfirmedFlags(data)) {
        extra.push({
            occurredAt: data.updatedAt ?? data.createdAt ?? "—",
            kind: "kitchen_accept",
            title: "Bếp đã xác nhận hỗ trợ sản xuất — SC có thể duyệt an tâm hơn",
            detail: undefined,
        });
    }
    const note = data.note?.trim();
    if (note && /từ chối|tu choi|reject|không thể|khong the|hết nguyên|het nguyen/i.test(note)) {
        extra.push({
            occurredAt: data.updatedAt ?? data.createdAt ?? "—",
            kind: "kitchen_reject",
            title: "Phản hồi / ghi chú liên quan bếp hoặc từ chối",
            detail: note,
        });
    }

    const merged = [...fromApi, ...extra];
    const dedup = merged.filter(
        (e, i, arr) => arr.findIndex((x) => x.title === e.title && x.detail === e.detail && x.kind === e.kind) === i,
    );
    return {
        ...data,
        collaborationLog: dedup.length > 0 ? dedup : data.collaborationLog,
    };
}
