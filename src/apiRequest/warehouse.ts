import http from "@/lib/http";
import {
    CancelPickingTaskBodyType,
    ConsolidateManifestBodyType,
    FinalizeBulkShipmentBodyType,
    ReportIssueBodyType,
} from "@/schemas/warehouse";
import { BaseResponsePagination } from "@/types/base";
import {
    ConsolidateManifestResult,
    IssueReport,
    PickingTaskDetail,
    PickingTaskListItem,
    QueryPickingTask,
    ScanCheckResult,
    ShipmentLabel,
    VehicleListItem,
} from "@/types/warehouse";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

function unwrapData<T>(raw: unknown): T {
    if (raw && typeof raw === "object" && "data" in (raw as Record<string, unknown>)) {
        return (raw as { data: T }).data;
    }
    return raw as T;
}

function listPayloadRoot(raw: unknown): Record<string, unknown> {
    const r = (raw ?? {}) as Record<string, unknown>;
    const d = r.data;
    if (d && typeof d === "object" && !Array.isArray(d)) {
        const inner = d as Record<string, unknown>;
        if (Array.isArray(inner.items) || Array.isArray(inner.data)) return inner;
    }
    return r;
}

export const warehouseRequest = {
    /** GET /warehouse/picking-tasks — BE chỉ trả đơn approved để soạn; không có query `status`. */
    getPickingTasks: (query: QueryPickingTask) =>
        http.get<unknown>(ENDPOINT_CLIENT.WAREHOUSE_TASKS, { query }),

    /** @deprecated dùng getPickingTasks — giữ tên cũ cho import tối thiểu */
    getWarehouses: (query: QueryPickingTask) => warehouseRequest.getPickingTasks(query),

    parsePickingTaskPage: (raw: unknown, query: QueryPickingTask): BaseResponsePagination<PickingTaskListItem> => {
        const payload = listPayloadRoot(raw);
        const itemsRaw = payload.items ?? (Array.isArray(payload.data) ? payload.data : undefined) ?? payload.results;
        const items = Array.isArray(itemsRaw)
            ? (itemsRaw as Record<string, unknown>[]).map((row) => ({
                  id: row.id != null ? String(row.id) : undefined,
                  orderId: String(row.orderId ?? row.order_id ?? row.id ?? ""),
                  storeName: row.storeName != null ? String(row.storeName) : row.destinationStoreName != null ? String(row.destinationStoreName) : undefined,
                  status: row.status != null ? String(row.status) : undefined,
                  createdAt: row.createdAt != null ? String(row.createdAt) : row.created_at != null ? String(row.created_at) : undefined,
                  deliveryDate: row.deliveryDate != null ? String(row.deliveryDate) : undefined,
                  totalItems:
                      row.totalItems != null
                          ? Number(row.totalItems)
                          : row.totalItemCount != null
                            ? Number(row.totalItemCount)
                            : row.itemCount != null
                              ? Number(row.itemCount)
                              : undefined,
                  shipmentId: row.shipmentId != null ? String(row.shipmentId) : undefined,
              }))
            : [];
        const meta = payload.meta as BaseResponsePagination<PickingTaskListItem>["meta"] | undefined;
        return {
            items,
            meta: meta ?? {
                totalItems: items.length,
                itemCount: items.length,
                itemsPerPage: query.limit,
                totalPages: Math.max(1, Math.ceil(items.length / query.limit) || 1),
                currentPage: query.page,
            },
        };
    },

    getPickingTaskDetail: (id: string) => http.get<unknown>(ENDPOINT_CLIENT.WAREHOUSE_PICKING_TASK_DETAIL(id)),

    resetPickingTask: (orderId: string) => http.patch(ENDPOINT_CLIENT.WAREHOUSE_PICKING_TASK_RESET(orderId), {}),

    /** POST /warehouse/tasks/:orderId/cancel */
    cancelPickingTask: (orderId: string, body: CancelPickingTaskBodyType) =>
        http.post<unknown>(ENDPOINT_CLIENT.WAREHOUSE_TASK_CANCEL(orderId), body),

    /** PATCH /warehouse/shipments/finalize-bulk — đồng bộ OpenAPI production (không dùng POST /finalize-bulk-shipment). */
    finalizeBulkShipment: (data: FinalizeBulkShipmentBodyType) =>
        http.patch<unknown>(ENDPOINT_CLIENT.WAREHOUSE_FINALIZE_BULK, data),

    getShipmentLabel: (id: string) => http.get<unknown>(ENDPOINT_CLIENT.WAREHOUSE_SHIPMENT_LABEL(id)),

    /** GET /warehouse/scan-check?batchCode= — tra cứu / xác thực lô khi soạn (production chỉ hỗ trợ GET). */
    scanCheckBatch: (batchCode: string) => http.get<unknown>(ENDPOINT_CLIENT.WAREHOUSE_SCAN_CHECK, { query: { batchCode } }),

    reportIssue: (data: ReportIssueBodyType) => http.post<IssueReport>(ENDPOINT_CLIENT.WAREHOUSE_REPORT_ISSUE, data),

    parsePickingTaskDetail: (raw: unknown): PickingTaskDetail => {
        const once = unwrapData<Record<string, unknown>>(raw);
        const root = Array.isArray(once.items) ? once : (unwrapData<Record<string, unknown>>(once) as Record<string, unknown>);
        const itemsRaw = root.items as unknown;
        const items = Array.isArray(itemsRaw)
            ? (itemsRaw as Record<string, unknown>[]).map((it) => ({
                  productId: Number(it.productId ?? it.product_id ?? 0),
                  productName: String(it.productName ?? it.product_name ?? "—"),
                  requiredQty: Number(it.requiredQty ?? it.required_qty ?? 0),
                  pickedQty: Number(it.pickedQty ?? it.picked_qty ?? 0),
                  suggestedBatches: Array.isArray(it.suggestedBatches ?? it.suggested_batches)
                      ? ((it.suggestedBatches ?? it.suggested_batches) as Record<string, unknown>[]).map((b) => ({
                            batchId: b.batchId != null ? Number(b.batchId) : b.id != null ? Number(b.id) : undefined,
                            batchCode: String(b.batchCode ?? b.batch_code ?? b.code ?? ""),
                            qtyToPick: Number(b.qtyToPick ?? b.qty_to_pick ?? b.suggestedQuantity ?? b.quantity ?? 0),
                            expiry: b.expiry != null ? String(b.expiry) : undefined,
                            expiryDate: b.expiryDate != null ? String(b.expiryDate) : b.expiry_date != null ? String(b.expiry_date) : undefined,
                            location: b.location != null ? String(b.location) : undefined,
                        }))
                      : [],
              }))
            : [];
        return {
            id: root.id != null ? String(root.id) : undefined,
            orderId: String(root.orderId ?? root.order_id ?? ""),
            shipmentId: root.shipmentId != null ? String(root.shipmentId) : undefined,
            storeName: root.storeName != null ? String(root.storeName) : undefined,
            items,
        };
    },

    parseScanCheckResult: (raw: unknown): ScanCheckResult => {
        const o = unwrapData<Record<string, unknown>>(raw);
        return {
            batchId: o.batchId != null ? Number(o.batchId) : undefined,
            batchCode: o.batchCode != null ? String(o.batchCode) : undefined,
            productId: o.productId != null ? Number(o.productId) : undefined,
            productName: String(o.productName ?? "—"),
            currentQuantity: o.currentQuantity != null ? Number(o.currentQuantity) : undefined,
            quantityPhysical: o.quantityPhysical != null ? Number(o.quantityPhysical) : undefined,
            expiryDate: o.expiryDate != null ? String(o.expiryDate) : undefined,
            location: o.location != null ? String(o.location) : undefined,
            status: String(o.status ?? "OK"),
        };
    },

    parseShipmentLabel: (raw: unknown): ShipmentLabel => unwrapData(raw) as ShipmentLabel,

    /** GET /warehouse/vehicles — đối chiếu Swagger nếu 404 */
    getVehicles: () => http.get<unknown>(ENDPOINT_CLIENT.WAREHOUSE_VEHICLES),

    parseVehiclesList: (raw: unknown): VehicleListItem[] => {
        const root = unwrapData<unknown>(raw);
        let arr: unknown = root;
        if (!Array.isArray(arr) && arr && typeof arr === "object") {
            const rec = arr as Record<string, unknown>;
            arr = rec.items ?? rec.data ?? [];
        }
        const list = Array.isArray(arr) ? arr : [];
        return list.map((row) => {
            const r = row as Record<string, unknown>;
            const idRaw = r.id ?? r.vehicleId ?? r.vehicle_id;
            const cap = Number(r.payloadCapacity ?? r.payload_capacity ?? r.maxPayloadKg ?? r.capacity ?? 0);
            return {
                id: idRaw != null ? String(idRaw) : "",
                plateNumber:
                    r.plateNumber != null
                        ? String(r.plateNumber)
                        : r.plate_number != null
                          ? String(r.plate_number)
                          : r.licensePlate != null
                            ? String(r.licensePlate)
                            : undefined,
                name: r.name != null ? String(r.name) : undefined,
                payloadCapacity: Number.isFinite(cap) ? cap : 0,
            };
        }).filter((v) => v.id !== "");
    },

    /** POST /warehouse/manifest/consolidate */
    consolidateManifest: (dto: ConsolidateManifestBodyType) =>
        http.post<unknown>(ENDPOINT_CLIENT.WAREHOUSE_MANIFEST_CONSOLIDATE, dto),

    parseConsolidateManifestResult: (raw: unknown): ConsolidateManifestResult => {
        const o = unwrapData<Record<string, unknown>>(raw);
        return {
            manifestId:
                o.manifestId != null
                    ? String(o.manifestId)
                    : o.manifest_id != null
                      ? String(o.manifest_id)
                      : undefined,
            message: o.message != null ? String(o.message) : undefined,
        };
    },
};
