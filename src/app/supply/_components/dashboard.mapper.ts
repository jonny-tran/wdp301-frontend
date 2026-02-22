type DataRecord = Record<string, unknown>;

export function extractItems(raw: unknown): DataRecord[] {
    if (!raw || typeof raw !== "object") return [];
    const data = raw as { items?: unknown };
    return Array.isArray(data.items) ? (data.items as DataRecord[]) : [];
}
