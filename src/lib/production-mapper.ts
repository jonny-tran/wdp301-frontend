import type {
    ProductionInventoryTx,
    ProductionLineageRow,
    ProductionOrder,
    ProductionOrderDetail,
    ProductionOrderStatus,
    ProductionReservation,
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
    const recipeObj = raw.recipe as Record<string, unknown> | undefined;
    return {
        id,
        orderCode:
            raw.orderCode != null
                ? pickStr(raw.orderCode)
                : raw.code != null
                  ? pickStr(raw.code)
                  : undefined,
        productId: pickNum(raw.productId),
        productName: pickStr(
            raw.productName ?? (raw.product as Record<string, unknown> | undefined)?.name ?? "—",
        ),
        sku: raw.sku != null ? pickStr(raw.sku) : undefined,
        recipeName: pickStr(
            raw.recipeName ?? recipeObj?.name ?? recipeObj?.productName ?? (raw.recipe as string | undefined) ?? "",
        ),
        staffName: pickStr(
            raw.assignedStaffName ??
                raw.staffName ??
                raw.kitchenStaffName ??
                (raw.assignedUser as Record<string, unknown> | undefined)?.name ??
                (raw.user as Record<string, unknown> | undefined)?.name ??
                "",
        ),
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
    const outputProduct = raw.outputProduct as Record<string, unknown> | undefined;
    const productName = pickStr(
        raw.productName ?? raw.outputProductName ?? outputProduct?.name ?? "—",
    );
    const recipeName = pickStr(raw.name ?? raw.recipeName ?? productName);
    return {
        id: pickStr(raw.id ?? raw.recipeId),
        recipeName,
        productId: pickNum(raw.productId ?? raw.outputProductId ?? outputProduct?.id),
        productName,
        sku:
            raw.sku != null
                ? pickStr(raw.sku)
                : outputProduct?.sku != null
                  ? pickStr(outputProduct.sku)
                  : undefined,
        description: raw.description != null ? pickStr(raw.description) : null,
        unit: pickStr(
            raw.unit ??
                raw.baseUnitName ??
                outputProduct?.baseUnitName ??
                outputProduct?.baseUnit ??
                raw.baseUnit ??
                "kg",
        ),
        referenceOutput:
            raw.referenceOutput != null
                ? pickNum(raw.referenceOutput)
                : raw.targetOutput != null
                  ? pickNum(raw.targetOutput)
                  : raw.standardOutput != null
                    ? pickNum(raw.standardOutput)
                    : null,
        ingredientCount: pickNum(
            raw.ingredientCount ??
                raw.itemsCount ??
                raw.bomItemCount ??
                raw.linesCount ??
                (Array.isArray(raw.items) ? (raw.items as unknown[]).length : 0),
        ),
        isActive: !(raw.isActive === false || raw.is_active === false),
    };
}

export function normalizeBomLine(raw: Record<string, unknown>): RecipeBomLine {
    const ingredient = raw.ingredient as Record<string, unknown> | undefined;
    return {
        ingredientProductId: pickNum(
            raw.ingredientProductId ??
                raw.productId ??
                raw.rawMaterialProductId ??
                ingredient?.id,
        ),
        ingredientName: pickStr(
            raw.ingredientName ??
                raw.productName ??
                raw.name ??
                ingredient?.name ??
                "—",
        ),
        sku:
            raw.sku != null
                ? pickStr(raw.sku)
                : ingredient?.sku != null
                  ? pickStr(ingredient.sku)
                  : undefined,
        standardQuantity: pickNum(
            raw.standardQuantity ??
                raw.quantity ??
                raw.qty ??
                raw.quantityPerOutput,
        ),
        unit: pickStr(
            raw.unit ??
                ingredient?.baseUnitName ??
                ingredient?.baseUnit ??
                "kg",
        ),
    };
}

export function normalizeRecipeDetail(raw: Record<string, unknown>): RecipeDetail {
    const base = normalizeRecipeSummary(raw);
    const bomRaw = (raw.bom ?? raw.lines ?? raw.ingredients ?? raw.items) as unknown;
    const bomArr = Array.isArray(bomRaw) ? bomRaw : [];
    const bom = bomArr.map((row) => normalizeBomLine(row as Record<string, unknown>));
    return {
        ...base,
        ingredientCount: base.ingredientCount > 0 ? base.ingredientCount : bom.length,
        bom,
    };
}

function normalizeReservation(raw: Record<string, unknown>): ProductionReservation {
    return {
        batchId: raw.batchId != null ? pickNum(raw.batchId) : undefined,
        batchCode: raw.batchCode != null ? pickStr(raw.batchCode) : undefined,
        productId: raw.productId != null ? pickNum(raw.productId) : undefined,
        productName: raw.productName != null ? pickStr(raw.productName) : undefined,
        quantity: raw.quantity != null ? pickNum(raw.quantity) : undefined,
        reservedQuantity:
            raw.reservedQuantity != null
                ? pickNum(raw.reservedQuantity)
                : raw.reserved_quantity != null
                  ? pickNum(raw.reserved_quantity)
                  : undefined,
        expiryDate:
            raw.expiryDate != null
                ? pickStr(raw.expiryDate)
                : raw.expiry_date != null
                  ? pickStr(raw.expiry_date)
                  : undefined,
    };
}

function normalizeLineageRow(raw: Record<string, unknown>): ProductionLineageRow {
    const parentBatch = raw.parentBatch as Record<string, unknown> | undefined;
    const childBatch = raw.childBatch as Record<string, unknown> | undefined;
    return {
        parentBatchId: raw.parentBatchId != null ? pickNum(raw.parentBatchId) : undefined,
        parentBatchCode: pickStr(raw.parentBatchCode ?? parentBatch?.batchCode),
        childBatchId: raw.childBatchId != null ? pickNum(raw.childBatchId) : undefined,
        childBatchCode: pickStr(raw.childBatchCode ?? childBatch?.batchCode),
        consumedQuantity: raw.consumedQuantity != null ? pickNum(raw.consumedQuantity) : undefined,
    };
}

function normalizeInventoryTx(raw: Record<string, unknown>): ProductionInventoryTx {
    return {
        id: raw.id != null ? pickStr(raw.id) : undefined,
        type: pickStr(raw.type ?? raw.transactionType ?? raw.referenceType),
        quantity: raw.quantity != null ? pickNum(raw.quantity) : undefined,
        wasteReason: pickStr(raw.wasteReason ?? raw.reason ?? raw.note),
        note: raw.note != null ? pickStr(raw.note) : undefined,
        metadata: raw.metadata as Record<string, unknown> | undefined,
        createdAt:
            raw.createdAt != null
                ? pickStr(raw.createdAt)
                : raw.created_at != null
                  ? pickStr(raw.created_at)
                  : undefined,
    };
}

export function normalizeProductionOrderDetail(raw: Record<string, unknown>): ProductionOrderDetail {
    const base = normalizeProductionOrder(raw);
    const reservationsRaw = (raw.reservations ??
        raw.productionReservations ??
        raw.reservedBatches) as unknown;
    const reservations = Array.isArray(reservationsRaw)
        ? reservationsRaw.map((r) => normalizeReservation(r as Record<string, unknown>))
        : [];

    const lineageRaw = (raw.lineage ?? raw.batchLineage ?? raw.batch_lineage ?? raw.lineages) as unknown;
    const lineage = Array.isArray(lineageRaw)
        ? lineageRaw.map((r) => normalizeLineageRow(r as Record<string, unknown>))
        : [];

    const txRaw = (raw.inventoryTransactions ?? raw.transactions ?? raw.inventory_transactions) as unknown;
    const inventoryTransactions = Array.isArray(txRaw)
        ? txRaw.map((r) => normalizeInventoryTx(r as Record<string, unknown>))
        : [];

    const recipeObj = raw.recipe as Record<string, unknown> | undefined;

    const outBatch = raw.outputBatch as Record<string, unknown> | undefined;

    return {
        ...base,
        recipeId:
            raw.recipeId != null
                ? pickStr(raw.recipeId)
                : recipeObj?.id != null
                  ? pickStr(recipeObj.id)
                  : undefined,
        recipeName:
            base.recipeName ||
            pickStr(raw.recipeName ?? recipeObj?.name ?? recipeObj?.productName ?? ""),
        plannedQuantity: base.targetQuantity,
        reservations,
        lineage,
        inventoryTransactions,
        outputBatchCode: pickStr(
            raw.outputBatchCode ?? raw.resultBatchCode ?? outBatch?.batchCode ?? "",
        ),
        outputBatchId:
            raw.outputBatchId != null
                ? pickNum(raw.outputBatchId)
                : outBatch?.id != null
                  ? pickNum(outBatch.id)
                  : undefined,
        outputExpiryDate: pickStr(
            raw.outputExpiryDate ?? outBatch?.expiryDate ?? raw.expiryDate ?? "",
        ),
    };
}

export function parseProductionOrderDetailPayload(raw: unknown): ProductionOrderDetail {
    const root = (raw ?? {}) as Record<string, unknown>;
    let data = (root.data ?? root) as Record<string, unknown>;
    const nestedOrder = data.order as Record<string, unknown> | undefined;
    if (nestedOrder && typeof nestedOrder === "object") {
        data = { ...nestedOrder, ...data };
    }
    return normalizeProductionOrderDetail(data);
}

export function isOrderActiveStatus(status: ProductionOrderStatus): boolean {
    const u = String(status).toUpperCase();
    return u === "PENDING" || u === "IN_PROGRESS";
}

export function isOrderCompletedStatus(status: ProductionOrderStatus): boolean {
    return String(status).toUpperCase() === "COMPLETED";
}
