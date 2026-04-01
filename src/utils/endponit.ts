export const ENDPOINT_SERVER = {
    LOGIN: '/api/login',
    REFRESH: '/api/refresh_token',
    LOGOUT: '/api/logout',
}
export const ENDPOINT_CLIENT = {
    // Auth
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE: '/auth/me',
    ROLES: '/auth/roles',
    CREATE_USER: '/auth/create-user',
    USERS: '/auth/users',
    UPDATE_USER: (id: string) => `/auth/users/${id}`,



    // Orders
    ORDER_LIST: '/orders',
    ORDER_CATALOG: '/orders/catalog',
    CREATE_ORDER: '/orders',
    MY_STORE_ORDER: '/orders/my-store',
    ORDER_REVIEW: (id: string) => `/orders/coordinator/${id}/review`,
    APPROVE_ORDER: (id: string) => `/orders/coordinator/${id}/approve`,
    REJECT_ORDER: (id: string) => `/orders/coordinator/${id}/reject`,
    CANCEL_ORDER: (id: string) => `/orders/franchise/${id}/cancel`,
    ORDER_DETAIL: (id: string) => `/orders/${id}`,
    ORDER_FILL_RATE: '/orders/analytics/fulfillment-rate',
    ORDER_SLA_LEAD_TIME: '/orders/analytics/performance/lead-time',

    // Claims
    CLAIMS: '/claims',
    CLAIM_DETAIL: (id: string) => `/claims/${id}`,
    CREATE_CLAIM: '/claims',
    CLAIM_MY_STORE: '/claims/my-store',
    RESOLVE_CLAIM: (id: string) => `/claims/${id}/resolve`,
    CLAIM_REPORT: '/claims/analytics/summary',

    // Stores
    STORES: '/stores',
    CREATE_STORE: '/stores',
    CREATE_STAFF: '/stores/staff', 
    STORE_DETAIL: (id: string) => `/stores/${id}`,
    UPDATE_STORE: (id: string) => `/stores/${id}`,
    DELETE_STORE: (id: string) => `/stores/${id}`,
    STORE_RELIABILITY: '/stores/analytics/reliability',
    STORE_DEMAND_PATTERN: '/stores/analytics/demand-pattern',

    // Inventory
    INVENTORY_STORE: '/inventory/store',
    INVENTORY_STORE_TRANSACTION: '/inventory/store/transactions',
    INVENTORY_SUMMARY: '/inventory/summary',
    INVENTORY_LOW_STOCK: '/inventory/low-stock',
    INVENTORY_ADJUST: '/inventory/adjust',
    /** Nhật ký giao dịch kho (kitchen audit trail) — đối chiếu Swagger nếu path khác */
    INVENTORY_TRANSACTIONS: '/inventory/transactions',
    INVENTORY_KITCHEN_SUMMARY: '/inventory/kitchen/summary',
    INVENTORY_KITCHEN_DETAILS: '/inventory/kitchen/details',
    INVENTORY_ANALYTICS_SUMMARY: '/inventory/analytics/summary',
    INVENTORY_AGING: '/inventory/analytics/aging',
    INVENTORY_WASTE: '/inventory/analytics/waste',
    FINANCIAL_LOSS: '/inventory/analytics/financial/loss-impact',

    // Products
    PRODUCTS: '/products', // Used for CREATE
    PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,
    RESTORE_PRODUCT: (id: string | number) => `/products/${id}/restore`,
    BATCHES: '/products/batches',
    BATCH_DETAIL: (id: string | number) => `/products/batches/${id}`,
    UPDATE_BATCH: (id: string | number) => `/products/batches/${id}`,

    // Base Units
    BASE_UNITS: '/base-units',
    BASE_UNIT_DETAIL: (id: string | number) => `/base-units/${id}`,

    // Shipments
    SHIPMENTS: '/shipments',
    SHIPMENTS_MY_STORE: '/shipments/store/my',
    SHIPMENT_DETAIL: (id: string) => `/shipments/${id}`,
    SHIPMENT_PICKING_LIST: (id: string) => `/shipments/${id}/picking-list`,
    SHIPMENT_RECEIVE_ALL: (id: string) => `/shipments/${id}/receive-all`,
    SHIPMENT_RECEIVE: (id: string) => `/shipments/${id}/receive`,

    // Warehouse (WH-OPTIMIZE + picking thủ công — đối chiếu Swagger)
    /** Danh sách tác vụ soạn hàng (`/warehouse/picking-tasks`); BE chỉ trả đơn approved — không gửi `status`. */
    WAREHOUSE_TASKS: '/warehouse/picking-tasks',
    WAREHOUSE_PICKING_TASKS: '/warehouse/picking-tasks',
    WAREHOUSE_PICKING_TASK_DETAIL: (id: string) => `/warehouse/picking-tasks/${id}`,
    WAREHOUSE_PICKING_TASK_RESET: (orderId: string) => `/warehouse/picking-tasks/${orderId}/reset`,
    /** Hủy / từ chối soạn — body `{ reason }` */
    WAREHOUSE_TASK_CANCEL: (orderId: string) => `/warehouse/tasks/${orderId}/cancel`,
    /** Chốt xuất kho gộp (PATCH — OpenAPI production) */
    WAREHOUSE_FINALIZE_BULK: '/warehouse/shipments/finalize-bulk',
    /** @deprecated Một số bản BE cũ; production dùng PATCH `WAREHOUSE_FINALIZE_BULK` */
    WAREHOUSE_FINALIZE_BULK_SHIPMENT: '/warehouse/finalize-bulk-shipment',
    WAREHOUSE_SHIPMENT_LABEL: (id: string) => `/warehouse/shipments/${id}/label`,
    WAREHOUSE_SCAN_CHECK: '/warehouse/scan-check',
    WAREHOUSE_REPORT_ISSUE: '/warehouse/batch/report-issue',

    // Inbound
    INBOUND_RECEIPTS: '/inbound/receipts',
    INBOUND_RECEIPT_DETAIL: (id: string) => `/inbound/receipts/${id}`,
    INBOUND_ADD_ITEM: (id: string) => `/inbound/receipts/${id}/items`,
    INBOUND_BATCH_LABEL: (id: string | number) => `/inbound/batches/${id}/label`,
    INBOUND_COMPLETE: (id: string) => `/inbound/receipts/${id}/complete`,
    /** Xóa dòng phiếu nháp (INB-OPTIMIZE: identity theo receipt + item, không còn /inbound/items/:batchId) */
    INBOUND_DELETE_RECEIPT_ITEM: (receiptId: string, itemId: string | number) =>
        `/inbound/receipts/${receiptId}/items/${itemId}`,
    INBOUND_VARIANCE_APPROVAL: (id: string) => `/inbound/receipts/${id}/variance-approval`,
    INBOUND_REPRINT_BATCH: '/inbound/batches/reprint',

    // Suppliers
    SUPPLIERS: '/suppliers',
    SUPPLIER_DETAIL: (id: string | number) => `/suppliers/${id}`,

    // Upload
    UPLOAD_IMAGE: '/upload/image',

    // System Config
    SYSTEM_CONFIGS: '/system-configs',
    UPDATE_SYSTEM_CONFIG: (key: string) => `/system-configs/${key}`,

    // Production (BOM + lệnh sản xuất) — đối chiếu Swagger / production.controller.ts
    PRODUCTION_RECIPES: '/production/recipes',
    PRODUCTION_RECIPE_DETAIL: (id: string) => `/production/recipes/${id}`,
    PRODUCTION_ORDERS: '/production/orders',
    PRODUCTION_ORDER_DETAIL: (id: string) => `/production/orders/${id}`,
    PRODUCTION_ORDER_START: (id: string) => `/production/orders/${id}/start`,
    PRODUCTION_ORDER_COMPLETE: (id: string) => `/production/orders/${id}/complete`,
}
