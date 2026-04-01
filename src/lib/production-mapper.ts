import type {
    ProductionOrder,
    ProductionOrderStatus,
    RecipeBomLine,
    RecipeDetail,
    RecipeSummary,
} from "@/types/production";

function pickStr(v: unknown, fallback = ""): string {
    if (v === null || v === undefined) return fallback;
    return String(v);
}

function pickNum(v: unknown, fallback = 0): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

export function normalizeStatus(s: unknown): ProductionOrderStatus {
    const u = String(s ?? "").toUpperCase();
    if (u === "PENDING" || u === "IN_PROGRESS" || u === "COMPLETED" || u === "CANCELLED") {
        return u as ProductionOrderStatus;
    }
    return "PENDING";
}

export function normalizeProductionOrder(raw: Record<string, unknown>): ProductionOrder {
    const id = pickStr(raw.id ?? raw.productionOrderId ?? raw.orderId);
    return {
        id,
        productId: pickNum(raw.productId),
        productName: pickStr(
            raw.productName ?? (raw.product as Record<string, unknown> | undefined)?.name ?? "—",
        ),
        sku: raw.sku != null ? pickStr(raw.sku) : undefined,
        targetQuantity: pickNum(raw.targetQuantity ?? raw.plannedQuantity ?? raw.quantity),
        actualQuantity:
            raw.actualQuantity != null && raw.actualQuantity !== ""
                ? pickNum(raw.actualQuantity)
                : null,
        unit: pickStr(raw.unit ?? raw.baseUnit ?? "kg"),
        status: normalizeStatus(raw.status),
        createdAt: pickStr(raw.createdAt ?? raw.created_at ?? new Date().toISOString()),
        updatedAt: raw.updatedAt != null ? pickStr(raw.updatedAt) : raw.updated_at != null ? pickStr(raw.updated_at) : null,
    };
}

export function normalizeRecipeSummary(raw: Record<string, unknown>): RecipeSummary {
    return {
        id: pickStr(raw.id ?? raw.recipeId),
        productId: pickNum(raw.productId),
        productName: pickStr(raw.productName ?? raw.name ?? "—"),
        sku: raw.sku != null ? pickStr(raw.sku) : undefined,
        description: raw.description != null ? pickStr(raw.description) : null,
        unit: pickStr(raw.unit ?? "kg"),
        referenceOutput:
            raw.referenceOutput != null
                ? pickNum(raw.referenceOutput)
                : raw.targetOutput != null
                  ? pickNum(raw.targetOutput)
                  : null,
    };
}

export function normalizeBomLine(raw: Record<string, unknown>): RecipeBomLine {
    return {
        ingredientProductId: pickNum(
            raw.ingredientProductId ?? raw.productId ?? raw.rawMaterialProductId,
        ),
        ingredientName: pickStr(raw.ingredientName ?? raw.productName ?? raw.name ?? "—"),
        sku: raw.sku != null ? pickStr(raw.sku) : undefined,
        standardQuantity: pickNum(raw.standardQuantity ?? raw.quantity ?? raw.qty),
        unit: pickStr(raw.unit ?? "kg"),
    };
}

export function normalizeRecipeDetail(raw: Record<string, unknown>): RecipeDetail {
    const base = normalizeRecipeSummary(raw);
    const bomRaw = (raw.bom ?? raw.lines ?? raw.ingredients ?? raw.items) as unknown;
    const bomArr = Array.isArray(bomRaw) ? bomRaw : [];
    return {
        ...base,
        bom: bomArr.map((row) => normalizeBomLine(row as Record<string, unknown>)),
    };
}

export function isOrderActiveStatus(status: ProductionOrderStatus): boolean {
    const u = String(status).toUpperCase();
    return u === "PENDING" || u === "IN_PROGRESS";
}

export function isOrderCompletedStatus(status: ProductionOrderStatus): boolean {
    return String(status).toUpperCase() === "COMPLETED";
}
