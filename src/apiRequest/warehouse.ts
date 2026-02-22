import http from "@/lib/http";
import { FinalizeBulkShipmentBodyType, ReportIssueBodyType } from "@/schemas/warehouse";
import { IssueReport, PickingTaskDetail, QueryPickingTask, ScanCheckResult, ShipmentLabel } from "@/types/warehouse";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const warehouseRequest = {

    // GET /warehouse/picking-tasks
    getWarehouses: (query: QueryPickingTask) => http.get(ENDPOINT_CLIENT.WAREHOUSE_PICKING_TASKS, { query }),

    // GET /warehouse/picking-tasks/:id
    getPickingTaskDetail: (id: string) => http.get<PickingTaskDetail>(ENDPOINT_CLIENT.WAREHOUSE_PICKING_TASK_DETAIL(id)),

    // PATCH /warehouse/picking-tasks/:orderId/reset
    resetPickingTask: (orderId: string) => http.patch<{ orderId: string, status: string }>(ENDPOINT_CLIENT.WAREHOUSE_PICKING_TASK_RESET(orderId), {}),

    // PATCH /warehouse/shipments/finalize-bulk
    finalizeBulkShipment: (data: FinalizeBulkShipmentBodyType) => http.patch<{ shipmentsCreated: any[] }>(ENDPOINT_CLIENT.WAREHOUSE_FINALIZE_BULK, data),

    // GET /warehouse/shipments/:id/label
    getShipmentLabel: (id: string) => http.get<ShipmentLabel>(ENDPOINT_CLIENT.WAREHOUSE_SHIPMENT_LABEL(id)),

    // GET /warehouse/scan-check?batchCode=
    scanCheckBatch: (batchCode: string) => http.get<ScanCheckResult>(ENDPOINT_CLIENT.WAREHOUSE_SCAN_CHECK, { query: { batchCode } }),

    // POST /warehouse/batch/report-issue
    reportIssue: (data: ReportIssueBodyType) => http.post<IssueReport>(ENDPOINT_CLIENT.WAREHOUSE_REPORT_ISSUE, data),
};
