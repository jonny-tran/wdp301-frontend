/**
 * Chuẩn hoá số lượng từ API (Decimal / string) → number hiển thị & tính toán.
 */
export function parseDecimalLike(value: unknown): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const n = Number(value.trim());
        return Number.isFinite(n) ? n : 0;
    }
    if (typeof value === "bigint") return Number(value);
    return 0;
}
