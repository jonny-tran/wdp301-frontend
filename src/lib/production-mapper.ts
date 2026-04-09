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
    if (u === "DRAFT") {
        return "DRAFT";
    }
    if (u === "PENDING" || u === "IN_PROGRESS" || u === "COMPLETED" || u === "CANCELLED") {
        return u as ProductionOrderStatus;
    }
    return "PENDING";
}

/** Lấy id lệnh từ response POST /production/orders (nhiều dạng envelope). */
export function parseCreatedProductionOrderId(raw: unknown): string {
    const root = (raw ?? {}) as Record<string, unknown>;
    const inner = (root.data ?? root.order ?? root.productionOrder ?? root) as Record<string, unknown>;
    const id = inner.id ?? inner.productionOrderId ?? root.id;
    return id != null && String(id) !== "" ? String(id) : "";
}

export function normalizeProductionOrder(raw: Record<string, unknown>): ProductionOrder {
    const id = pickStr(raw.id ?? raw.productionOrderId ?? raw.orderId);
    const recipeObj = raw.recipe as Record<string, unknown> | undefined;
    const outputProduct = recipeObj?.outputProduct as Record<string, unknown> | undefined;
    const productObj = raw.product as Record<string, unknown> | undefined;
    const kitchenStaff = raw.kitchenStaff as Record<string, unknown> | undefined;

    let productName = pickStr(
        raw.productName ?? productObj?.name ?? outputProduct?.name ?? recipeObj?.name ?? "",
    );
    if (!productName) productName = "—";

    const productId = pickNum(raw.productId ?? recipeObj?.outputProductId ?? outputProduct?.id);

    const sku =
        raw.sku != null
            ? pickStr(raw.sku)
            : outputProduct?.sku != null
              ? pickStr(outputProduct.sku)
              : undefined;

    return {
        id,
        orderCode:
            raw.orderCode != null
                ? pickStr(raw.orderCode)
                : raw.code != null
                  ? pickStr(raw.code)
                  : undefined,
        productId,
        productName,
        sku,
        recipeName: pickStr(
            raw.recipeName ?? recipeObj?.name ?? recipeObj?.productName ?? (raw.recipe as string | undefined) ?? "",
        ),
        staffName: pickStr(
            raw.assignedStaffName ??
                raw.staffName ??
                raw.kitchenStaffName ??
                kitchenStaff?.username ??
                kitchenStaff?.name ??
                (raw.assignedUser as Record<string, unknown> | undefined)?.name ??
                (raw.user as Record<string, unknown> | undefined)?.name ??
                "",
        ),
        targetQuantity: pickNum(raw.targetQuantity ?? raw.plannedQuantity ?? raw.quantity),
        actualQuantity:
            raw.actualQuantity != null && raw.actualQuantity !== ""
                ? pickNum(raw.actualQuantity)
                : null,
        unit: pickStr(
            raw.unit ??
                raw.baseUnit ??
                outputProduct?.baseUnitName ??
                (outputProduct?.baseUnit as string | undefined) ??
                "kg",
        ),
        status: normalizeStatus(raw.status),
        note: raw.note != null ? pickStr(raw.note) : null,
        referenceId:
            raw.referenceId != null
                ? pickStr(raw.referenceId)
                : raw.reference_id != null
                  ? pickStr(raw.reference_id)
                  : undefined,
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
    const batch =
        (raw.batch as Record<string, unknown> | undefined) ??
        (raw.inventoryBatch as Record<string, unknown> | undefined);
    const batchProduct = batch?.product as Record<string, unknown> | undefined;
    const product =
        (raw.product as Record<string, unknown> | undefined) ?? batchProduct ?? undefined;
    const ingredient = raw.ingredient as Record<string, unknown> | undefined;

    const batchId =
        raw.batchId != null
            ? pickNum(raw.batchId)
            : batch?.id != null
              ? pickNum(batch.id)
              : undefined;

    const batchCode =
        raw.batchCode != null
            ? pickStr(raw.batchCode)
            : batch?.batchCode != null
              ? pickStr(batch.batchCode)
              : batch?.code != null
                ? pickStr(batch.code)
                : undefined;

    const productId =
        raw.productId != null
            ? pickNum(raw.productId)
            : product?.id != null
              ? pickNum(product.id)
              : batch?.productId != null
                ? pickNum(batch.productId)
                : raw.ingredientProductId != null
                  ? pickNum(raw.ingredientProductId)
                  : raw.materialProductId != null
                    ? pickNum(raw.materialProductId)
                    : ingredient?.id != null
                      ? pickNum(ingredient.id)
                      : undefined;

    const productName =
        raw.productName != null && String(raw.productName).trim() !== ""
            ? pickStr(raw.productName)
            : product?.name != null
              ? pickStr(product.name)
              : batchProduct?.name != null
                ? pickStr(batchProduct.name)
                : ingredient?.name != null
                  ? pickStr(ingredient.name)
                  : undefined;

    const expiryDate =
        raw.expiryDate != null
            ? pickStr(raw.expiryDate)
            : raw.expiry_date != null
              ? pickStr(raw.expiry_date)
              : batch?.expiryDate != null
                ? pickStr(batch.expiryDate)
                : batch?.expiry_date != null
                  ? pickStr(batch.expiry_date)
                  : batch?.bestBefore != null
                    ? pickStr(batch.bestBefore)
                    : undefined;

    return {
        batchId,
        batchCode,
        productId,
        productName,
        quantity:
            raw.quantity != null
                ? pickNum(raw.quantity)
                : raw.requestedQuantity != null
                  ? pickNum(raw.requestedQuantity)
                  : undefined,
        reservedQuantity:
            raw.reservedQuantity != null
                ? pickNum(raw.reservedQuantity)
                : raw.reserved_quantity != null
                  ? pickNum(raw.reserved_quantity)
                  : raw.reservedQty != null
                    ? pickNum(raw.reservedQty)
                    : undefined,
        expiryDate,
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

function pickTxQuantity(raw: Record<string, unknown>): number | undefined {
    const candidates = [
        raw.quantity,
        raw.changeQuantity,
        raw.stockChange,
        raw.deltaQuantity,
        raw.delta,
        raw.amount,
        raw.qty,
        raw.absQuantity,
        raw.changeInQuantity,
    ];
    for (const c of candidates) {
        if (c != null && c !== "") {
            const n = pickNum(c);
            if (Number.isFinite(n)) return n;
        }
    }
    const details = raw.details as Record<string, unknown> | undefined;
    if (details) {
        const dq = details.quantity ?? details.amount ?? details.qty;
        if (dq != null && dq !== "") {
            const n = pickNum(dq);
            if (Number.isFinite(n)) return n;
        }
    }
    const meta = raw.metadata as Record<string, unknown> | undefined;
    if (meta) {
        const mq = meta.quantity ?? meta.changeQuantity ?? meta.amount ?? meta.qty ?? meta.delta;
        if (mq != null && mq !== "") {
            const n = pickNum(mq);
            if (Number.isFinite(n)) return n;
        }
    }
    return undefined;
}

function normalizeInventoryTx(raw: Record<string, unknown>): ProductionInventoryTx {
    const note = pickStr(raw.note ?? raw.description ?? raw.memo ?? raw.message ?? "");
    return {
        id: raw.id != null ? pickStr(raw.id) : undefined,
        type: pickStr(raw.type ?? raw.transactionType ?? raw.referenceType ?? raw.movementType),
        quantity: pickTxQuantity(raw),
        wasteReason: pickStr(raw.wasteReason ?? raw.reason ?? ""),
        note: note || undefined,
        metadata: raw.metadata as Record<string, unknown> | undefined,
        createdAt:
            raw.createdAt != null
                ? pickStr(raw.createdAt)
                : raw.created_at != null
                  ? pickStr(raw.created_at)
                  : undefined,
    };
}

function normSkuKey(s: string): string {
    return String(s ?? "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();
}

function buildRecipeIngredientLookups(recipeObj: Record<string, unknown> | undefined): {
    byId?: Record<number, string>;
    bySku?: Record<string, string>;
} {
    if (!recipeObj) return {};
    const itemsRaw = recipeObj.items as unknown;
    if (!Array.isArray(itemsRaw) || itemsRaw.length === 0) return {};
    const byId: Record<number, string> = {};
    const bySku: Record<string, string> = {};
    itemsRaw.forEach((it) => {
        const row = it as Record<string, unknown>;
        const ing = row.ingredient as Record<string, unknown> | undefined;
        const pid = pickNum(row.ingredientProductId ?? ing?.id);
        const name = pickStr(ing?.name ?? "");
        if (pid > 0 && name) byId[pid] = name;
        const sku = pickStr(ing?.sku ?? "");
        const skuNorm = normSkuKey(sku);
        if (skuNorm && name) bySku[skuNorm] = name;
    });
    return {
        byId: Object.keys(byId).length > 0 ? byId : undefined,
        bySku: Object.keys(bySku).length > 0 ? bySku : undefined,
    };
}

/** Gợi ý tên NL khi reservation chỉ có mã lô (đoạn đầu trùng SKU đã chuẩn hoá). */
/** Hiển thị SL nhật ký kho khi `quantity` phẳng thiếu (còn trong `metadata`). */
export function resolveInventoryTxQuantityLabel(t: ProductionInventoryTx): string {
    if (t.quantity != null && Number.isFinite(t.quantity)) {
        const n = Math.abs(t.quantity);
        return formatQtyVi(n);
    }
    const meta = t.metadata as Record<string, unknown> | undefined;
    if (meta) {
        const keys = ["quantity", "changeQuantity", "amount", "qty", "delta", "stockChange"] as const;
        for (const k of keys) {
            const v = meta[k];
            if (v != null && v !== "") {
                const n = Math.abs(pickNum(v));
                if (Number.isFinite(n)) return formatQtyVi(n);
            }
        }
    }
    return "—";
}

function formatQtyVi(n: number): string {
    if (!Number.isFinite(n)) return "—";
    const rounded = Math.round(n * 10000) / 10000;
    if (Number.isInteger(rounded)) return String(rounded);
    return String(rounded);
}

export function resolveReservationIngredientName(r: ProductionReservation, detail: ProductionOrderDetail): string {
    if (r.productName?.trim()) return r.productName;
    const pid = r.productId;
    if (pid != null && detail.ingredientLookup) {
        const fromId = detail.ingredientLookup[pid] ?? detail.ingredientLookup[Number(pid)];
        if (fromId) return fromId;
    }
    const code = r.batchCode ?? "";
    if (!code.trim() || !detail.ingredientLookupBySku) return "—";
    const head = normSkuKey(code.split("-")[0] ?? code);
    if (head && detail.ingredientLookupBySku[head]) return detail.ingredientLookupBySku[head];
    for (const [skuNorm, name] of Object.entries(detail.ingredientLookupBySku)) {
        if (!skuNorm) continue;
        if (head.startsWith(skuNorm) || skuNorm.startsWith(head) || head.includes(skuNorm) || skuNorm.includes(head)) {
            return name;
        }
    }
    return "—";
}

/** Dùng để merge hàng lệnh trong cache sau GET /production/orders/:id (list thường thiếu product). */
export function listRowFromOrderDetail(detail: ProductionOrderDetail): ProductionOrder {
    const {
        reservations: _r,
        lineage: _l,
        inventoryTransactions: _t,
        recipeId: _rid,
        plannedQuantity: _pq,
        outputBatchCode: _obc,
        outputBatchId: _obi,
        outputExpiryDate: _oed,
        ingredientLookup: _il,
        ingredientLookupBySku: _ils,
        ...order
    } = detail;
    return order;
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
    const { byId: ingredientLookup, bySku: ingredientLookupBySku } = buildRecipeIngredientLookups(recipeObj);

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
        ingredientLookup,
        ingredientLookupBySku,
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
