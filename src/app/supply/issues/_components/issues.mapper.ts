import { ClaimRow } from "./issues.types";

export function extractClaims(raw: unknown): ClaimRow[] {
    if (!raw || typeof raw !== "object") return [];

    const data = raw as { items?: unknown };
    const items = Array.isArray(data.items) ? data.items : [];

    return items
        .map((item) => {
            const row = item as Record<string, unknown>;
            const id = String(row.id ?? row.claimId ?? "");
            return {
                id,
                shipmentId: typeof row.shipmentId === "string" ? row.shipmentId : undefined,
                status: typeof row.status === "string" ? row.status : undefined,
                createdAt: typeof row.createdAt === "string" ? row.createdAt : undefined,
                resolvedAt: typeof row.resolvedAt === "string" ? row.resolvedAt : undefined,
            };
        })
        .filter((row) => row.id.length > 0);
}
