import { User } from "@/types/user";
import { Action, Resource } from "@/utils/constant";
import { Role } from "@/utils/enum";

// ---------------------------------------------------------------------------
// Type aliases
// ---------------------------------------------------------------------------
export type ResourceType = (typeof Resource)[keyof typeof Resource];
export type ActionType = (typeof Action)[keyof typeof Action];

// ---------------------------------------------------------------------------
// PermissionType — opaque branded string, không derive từ Resource
// vì subAction là nghiệp vụ (catalog, order_history...), không phải ResourceType
// ---------------------------------------------------------------------------
export type PermissionType = string & { readonly __brand: "Permission" };

// ---------------------------------------------------------------------------
// perm() — internal builder, KHÔNG export
// Dùng duy nhất để xây dựng P constants bên dưới.
// Component bên ngoài chỉ được dùng P.XXX, không gọi perm() trực tiếp.
// ---------------------------------------------------------------------------
const perm = (action: ActionType, subAction: string): PermissionType =>
    `${action}:${subAction}` as PermissionType;

// ---------------------------------------------------------------------------
// P — Single Source of Truth cho toàn bộ permission strings
// Mọi checkPermission() trong app đều phải truyền P.XXX, không hardcode string.
// ---------------------------------------------------------------------------
export const P = {

    // -- ORDER ----------------------------------------------------------------
    ORDER_READ_CATALOG: perm(Action.READ, 'catalog'),           // GET /orders/catalog
    ORDER_CREATE: perm(Action.CREATE, 'order'),             // POST /orders
    ORDER_READ_HISTORY: perm(Action.READ, 'order_history'),     // GET /orders/my-store
    ORDER_READ_DETAIL: perm(Action.READ, 'order_detail'),      // GET /orders/{id}
    ORDER_CANCEL: perm(Action.CANCEL, 'order'),             // PATCH /orders/{id}/cancel
    ORDER_READ_ALL_PENDING: perm(Action.READ, 'all_pending'),       // GET /orders/coordinator
    ORDER_READ_REVIEW: perm(Action.READ, 'review_detail'),     // GET /orders/coordinator/{id}/review
    ORDER_APPROVE: perm(Action.UPDATE, 'approve'),           // PATCH /orders/coordinator/{id}/approve
    ORDER_REJECT: perm(Action.UPDATE, 'reject'),            // PATCH /orders/coordinator/{id}/reject

    // -- INBOUND --------------------------------------------------------------
    INBOUND_CREATE_RECEIPT: perm(Action.CREATE, 'receipt'),           // POST /inbound/receipts
    INBOUND_CREATE_BATCH: perm(Action.CREATE, 'batch'),             // POST /inbound/receipts/{id}/items
    INBOUND_READ_BATCH_LABEL: perm(Action.READ, 'batch_label'),       // GET /inbound/batches/{id}/label
    INBOUND_COMPLETE_RECEIPT: perm(Action.UPDATE, 'complete_receipt'),  // PATCH /inbound/receipts/{id}/complete
    INBOUND_DELETE_BATCH: perm(Action.DELETE, 'draft_batch'),       // DELETE /inbound/items/{batch_id}
    INBOUND_REPRINT_LABEL: perm(Action.CREATE, 'reprint_label'),     // POST /inbound/batches/reprint

    // -- WAREHOUSE ------------------------------------------------------------
    WAREHOUSE_READ_TASKS: perm(Action.READ, 'picking_tasks'),     // GET /warehouse/picking-tasks
    WAREHOUSE_READ_TASK_DETAIL: perm(Action.READ, 'picking_detail'),    // GET /warehouse/picking-tasks/{orderId}
    WAREHOUSE_PICK_ITEM: perm(Action.CREATE, 'pick_item'),         // POST /warehouse/pick-item
    WAREHOUSE_RESET_PICKING: perm(Action.UPDATE, 'reset_picking'),     // PATCH /warehouse/picking-tasks/{orderId}/reset
    WAREHOUSE_CREATE_SHIPMENT: perm(Action.CREATE, 'shipment'),          // POST /warehouse/shipments
    WAREHOUSE_READ_SHIP_LABEL: perm(Action.READ, 'shipment_label'),    // GET /warehouse/shipments/{id}/label
    WAREHOUSE_SCAN_CHECK: perm(Action.READ, 'scan_check'),        // GET /warehouse/scan-check

    // -- SHIPMENT (Store-side) ------------------------------------------------
    SHIPMENT_READ_INCOMING: perm(Action.READ, 'incoming'),          // GET /shipments/incoming
    SHIPMENT_READ_DETAIL: perm(Action.READ, 'shipment_detail'),   // GET /shipments/{id}
    SHIPMENT_CONFIRM_RECEIPT: perm(Action.CONFIRM, 'receipt'),           // POST /shipments/{id}/receive

    // -- CLAIM ----------------------------------------------------------------
    CLAIM_READ_OWN: perm(Action.READ, 'own_claims'),        // GET /claims (store-scoped)
    CLAIM_READ_ALL: perm(Action.READ, 'all_claims'),        // GET /claims (coordinator)
    CLAIM_READ_DETAIL: perm(Action.READ, 'claim_detail'),      // GET /claims/{id}
    CLAIM_RESOLVE: perm(Action.UPDATE, 'resolve_claim'),     // PATCH /claims/{id}/resolve

    // -- INVENTORY ------------------------------------------------------------
    INVENTORY_READ_KITCHEN_SUMMARY: perm(Action.READ, 'kitchen_summary'),   // GET /inventory/kitchen/summary
    INVENTORY_READ_KITCHEN_DETAILS: perm(Action.READ, 'kitchen_details'),   // GET /inventory/kitchen/details
    INVENTORY_READ_STORE_STOCK: perm(Action.READ, 'store_stock'),       // GET /inventory/store/transactions

    // -- DELIVERY -------------------------------------------------------------
    DELIVERY_SCHEDULE: perm(Action.SCHEDULE, 'shipping'),          // Lập lịch giao hàng
    DELIVERY_TRACK: perm(Action.TRACK, 'progress'),          // Theo dõi tiến độ
    DELIVERY_HANDLE_ISSUES: perm(Action.UPDATE, 'handle_issues'),     // Xử lý sự cố giao hàng

    // -- PRODUCT --------------------------------------------------------------
    PRODUCT_READ_LIST: perm(Action.READ, 'list'),              // GET /products
    PRODUCT_READ_DETAIL: perm(Action.READ, 'detail'),            // GET /products/{id}
    PRODUCT_READ_CATEGORIES: perm(Action.READ, 'categories'),        // GET /products/categories
    PRODUCT_CREATE: perm(Action.CREATE, 'product'),           // POST /products
    PRODUCT_UPDATE: perm(Action.UPDATE, 'product'),           // PATCH /products/{id}

    // -- SUPPLIER -------------------------------------------------------------
    SUPPLIER_READ_LIST: perm(Action.READ, 'list'),              // GET /suppliers
    SUPPLIER_CREATE: perm(Action.CREATE, 'supplier'),          // POST /suppliers
    SUPPLIER_UPDATE: perm(Action.UPDATE, 'supplier'),          // PATCH /suppliers/{id}

    // -- USER -----------------------------------------------------------------
    USER_READ_LIST: perm(Action.READ, 'list'),              // GET /users
    USER_READ_ME: perm(Action.READ, 'me'),                // GET /users/me
    USER_CREATE: perm(Action.CREATE, 'user'),              // POST /users
    USER_UPDATE: perm(Action.UPDATE, 'user'),              // PATCH /users/{id}
    USER_RESET_PASSWORD: perm(Action.UPDATE, 'reset_password'),    // PATCH /users/{id}/reset-password

    // -- STORE ----------------------------------------------------------------
    STORE_READ_LIST: perm(Action.READ, 'list'),              // GET /stores
    STORE_READ_DETAIL: perm(Action.READ, 'detail'),            // GET /stores/{id}
    STORE_CREATE: perm(Action.CREATE, 'store'),             // POST /stores
    STORE_UPDATE: perm(Action.UPDATE, 'store'),             // PATCH /stores/{id}

    // -- SYSTEM ---------------------------------------------------------------
    SYSTEM_CONFIGURE_PARAMS: perm(Action.CONFIGURE, 'params'),            // Cấu hình tham số vận hành
    SYSTEM_CONFIGURE_UNITS: perm(Action.CONFIGURE, 'units'),             // GET /system/units
    SYSTEM_CONFIGURE_PROCESS: perm(Action.CONFIGURE, 'process'),           // Cấu hình quy trình

    // -- REPORT ---------------------------------------------------------------
    REPORT_INVENTORY_SUMMARY: perm(Action.READ, 'inventory_summary'), // GET /analytics/inventory/summary
    REPORT_INVENTORY_AGING: perm(Action.READ, 'inventory_aging'),   // GET /analytics/inventory/aging
    REPORT_WASTE: perm(Action.READ, 'waste_report'),      // GET /analytics/inventory/waste
    REPORT_FULFILLMENT_RATE: perm(Action.READ, 'fulfillment_rate'),  // GET /analytics/orders/fulfillment-rate
    REPORT_LEAD_TIME: perm(Action.READ, 'lead_time'),         // GET /analytics/performance/lead-time
    REPORT_CLAIM_SUMMARY: perm(Action.READ, 'claim_summary'),     // GET /analytics/claims/summary
    REPORT_STORE_RELIABILITY: perm(Action.READ, 'store_reliability'), // GET /analytics/stores/reliability
    REPORT_DEMAND_PATTERN: perm(Action.READ, 'demand_pattern'),    // GET /analytics/stores/demand-pattern
    REPORT_LOSS_IMPACT: perm(Action.READ, 'loss_impact'),       // GET /analytics/financial/loss-impact
    REPORT_AGGREGATED: perm(Action.READ, 'aggregated'),        // Tổng hợp toàn hệ thống (Admin)

} as const;

// ---------------------------------------------------------------------------
// Permission map type
// ---------------------------------------------------------------------------
type Permissions = {
    [role in Role]: {
        [resource in ResourceType]?: PermissionType[];
    };
};

// ---------------------------------------------------------------------------
// PERMISSION MATRIX
// ---------------------------------------------------------------------------
const PERMISSION: Permissions = {

    [Role.FRANCHISE_STORE_STAFF]: {
        [Resource.ORDER]: [
            P.ORDER_READ_CATALOG,
            P.ORDER_CREATE,
            P.ORDER_READ_HISTORY,
            P.ORDER_READ_DETAIL,
            P.ORDER_CANCEL,
        ],
        [Resource.SHIPMENT]: [
            P.SHIPMENT_READ_INCOMING,
            P.SHIPMENT_READ_DETAIL,
            P.SHIPMENT_CONFIRM_RECEIPT,
        ],
        [Resource.CLAIM]: [
            P.CLAIM_READ_OWN,
            P.CLAIM_READ_DETAIL,
        ],
        [Resource.INVENTORY]: [
            P.INVENTORY_READ_STORE_STOCK,
        ],
    },

    [Role.CENTRAL_KITCHEN_STAFF]: {
        [Resource.INBOUND]: [
            P.INBOUND_CREATE_RECEIPT,
            P.INBOUND_CREATE_BATCH,
            P.INBOUND_READ_BATCH_LABEL,
            P.INBOUND_COMPLETE_RECEIPT,
            P.INBOUND_DELETE_BATCH,
            P.INBOUND_REPRINT_LABEL,
        ],
        [Resource.INVENTORY]: [
            P.INVENTORY_READ_KITCHEN_SUMMARY,
            P.INVENTORY_READ_KITCHEN_DETAILS,
        ],
        [Resource.WAREHOUSE]: [
            P.WAREHOUSE_READ_TASKS,
            P.WAREHOUSE_READ_TASK_DETAIL,
            P.WAREHOUSE_PICK_ITEM,
            P.WAREHOUSE_RESET_PICKING,
            P.WAREHOUSE_CREATE_SHIPMENT,
            P.WAREHOUSE_READ_SHIP_LABEL,
            P.WAREHOUSE_SCAN_CHECK,
        ],
    },

    [Role.SUPPLY_COORDINATOR]: {
        [Resource.ORDER]: [
            P.ORDER_READ_ALL_PENDING,
            P.ORDER_READ_REVIEW,
            P.ORDER_APPROVE,
            P.ORDER_REJECT,
        ],
        [Resource.INVENTORY]: [
            P.INVENTORY_READ_KITCHEN_SUMMARY,
            P.INVENTORY_READ_KITCHEN_DETAILS,
        ],
        [Resource.DELIVERY]: [
            P.DELIVERY_SCHEDULE,
            P.DELIVERY_TRACK,
            P.DELIVERY_HANDLE_ISSUES,
        ],
        [Resource.CLAIM]: [
            P.CLAIM_READ_ALL,
            P.CLAIM_READ_DETAIL,
            P.CLAIM_RESOLVE,
        ],
    },

    [Role.MANAGER]: {
        [Resource.PRODUCT]: [
            P.PRODUCT_READ_LIST,
            P.PRODUCT_READ_DETAIL,
            P.PRODUCT_READ_CATEGORIES,
            P.PRODUCT_CREATE,
            P.PRODUCT_UPDATE,
        ],
        [Resource.SUPPLIER]: [
            P.SUPPLIER_READ_LIST,
            P.SUPPLIER_CREATE,
            P.SUPPLIER_UPDATE,
        ],
        [Resource.INVENTORY]: [
            P.INVENTORY_READ_KITCHEN_SUMMARY,
            P.INVENTORY_READ_KITCHEN_DETAILS,
            P.INVENTORY_READ_STORE_STOCK,
        ],
        [Resource.REPORT]: [
            P.REPORT_INVENTORY_SUMMARY,
            P.REPORT_INVENTORY_AGING,
            P.REPORT_WASTE,
            P.REPORT_FULFILLMENT_RATE,
            P.REPORT_LEAD_TIME,
            P.REPORT_CLAIM_SUMMARY,
            P.REPORT_STORE_RELIABILITY,
            P.REPORT_DEMAND_PATTERN,
            P.REPORT_LOSS_IMPACT,
        ],
    },

    [Role.ADMIN]: {
        [Resource.USER]: [
            P.USER_READ_LIST,
            P.USER_READ_ME,
            P.USER_CREATE,
            P.USER_UPDATE,
            P.USER_RESET_PASSWORD,
        ],
        [Resource.STORE]: [
            P.STORE_READ_LIST,
            P.STORE_READ_DETAIL,
            P.STORE_CREATE,
            P.STORE_UPDATE,
        ],
        [Resource.SYSTEM]: [
            P.SYSTEM_CONFIGURE_PARAMS,
            P.SYSTEM_CONFIGURE_UNITS,
            P.SYSTEM_CONFIGURE_PROCESS,
        ],
        [Resource.REPORT]: [
            P.REPORT_AGGREGATED,
        ],
    },
};

// ---------------------------------------------------------------------------
// checkPermission — pure utility, không có side-effect
// ---------------------------------------------------------------------------
export const checkPermission = (
    user: User | null | undefined,
    resource: ResourceType,
    permission: PermissionType,
): boolean => {
    if (!user?.role) return false;

    const roleKey = Object.values(Role).find((r) => r === user.role);
    if (!roleKey) return false;

    const resourcePermissions = PERMISSION[roleKey]?.[resource];
    if (!resourcePermissions) return false;

    return resourcePermissions.includes(permission);
};