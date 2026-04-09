/** `weightKg`: giá trị từ API (vd `products.weight_kg`) — đơn vị kg. */
export function formatWeightKg(weightKg: number): string {
    if (!Number.isFinite(weightKg) || weightKg < 0) return "—";
    if (weightKg < 1) {
        const g = Math.round(weightKg * 1000);
        return `${g.toLocaleString("vi-VN")} g`;
    }
    return `${weightKg.toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 3 })} kg`;
}
