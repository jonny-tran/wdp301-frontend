import { QueryClaim } from "@/types/claim";
import { QueryIbound } from "@/types/inbound";
import { QueryInventory, QueryInventorySummary, QueryKitchen } from "@/types/inventory";
import { QueryBatch, QueryProduct } from "@/types/product";
import { QueryShipment } from "@/types/shipment";
import { QueryStore } from "@/types/store";
import { QuerySupplier } from "@/types/supplier";
import { QueryCatelog, QueryOrder } from "@/types/order";
import { QueryPickingTask } from "@/types/warehouse";
import { ClaimAnalyticsQueryType, FinancialLossQueryType, InventoryAgingQueryType, InventoryWasteQueryType, OrderFillRateQueryType, OrderSLAQueryType, StoreDemandPatternQueryType } from "@/schemas/analytics";

// ACTIONS
// Mở rộng từ spec WDP301 để cover đủ permission matrix
// ---------------------------------------------------------------------------
export const Action = {
    // CRUD cơ bản
    CREATE:     'create',
    READ:       'read',
    UPDATE:     'update',
    DELETE:     'delete',

    // Workflow actions
    CONFIRM:    'confirm',      // Store xác nhận nhận hàng
    CANCEL:     'cancel',       // Store hủy đơn PENDING
    APPROVE:    'approve',      // Coordinator duyệt đơn
    REJECT:     'reject',       // Coordinator từ chối đơn
    RESOLVE:    'resolve',      // Coordinator đóng claim
    COMPLETE:   'complete',     // Chốt phiếu nhập / hoàn tất shipment

    // Planning & Operations
    PLAN:       'plan',         // Lập kế hoạch
    PROCESS:    'process',      // Xử lý đơn
    SCHEDULE:   'schedule',     // Lập lịch giao hàng
    TRACK:      'track',        // Theo dõi tiến độ / trạng thái
    AGGREGATE:  'aggregate',    // Tổng hợp đơn (Coordinator)

    // Management
    MANAGE:     'manage',       // Quản lý tổng thể (Manager/Admin)
    CONFIGURE:  'configure',    // Cấu hình hệ thống (Admin)
} as const;

// ---------------------------------------------------------------------------
// RESOURCES
// Thêm INBOUND, WAREHOUSE, SHIPMENT, CLAIM, SUPPLIER so với file cũ
// ---------------------------------------------------------------------------
export const Resource = {
    // Data management
    USER:       'user',
    STORE:      'store',
    PRODUCT:    'product',
    SUPPLIER:   'supplier',     // NEW – Nhà cung cấp nguyên liệu

    // Core workflow
    ORDER:      'order',
    INBOUND:    'inbound',      // NEW – Phiếu nhập kho + Batch management
    WAREHOUSE:  'warehouse',    // NEW – Picking tasks + Shipment tại Bếp
    SHIPMENT:   'shipment',     // NEW – Vận chuyển đến Store (Store-side view)
    CLAIM:      'claim',        // NEW – Khiếu nại sai lệch

    // Supporting
    INVENTORY:  'inventory',
    DELIVERY:   'delivery',
    SYSTEM:     'system',
    REPORT:     'report',

    // (Deprecated – giữ lại để không break code cũ, nên migrate sang INBOUND/WAREHOUSE)
    PRODUCTION: 'production',
} as const;



export const KEY = {
    me: ['profile'],
    inventoryAnalyticsSummary: ['inventory-analytics-summary'],
    storeReliabilityAnalytics: ['store-reliability-analytics'],

    // Core Entities
    orders: ['orders'],
    claims: ['claims'],
    receipts: ['receipts'],
    inventory: ['inventory'],
    products: ['products'],
    stores: ['stores'],
    suppliers: ['suppliers'],
    shipments: ['shipments'],
    warehouse: ['warehouse'],
    analytics: ['analytics'],
    baseUnits: ['base-units'],
    users: ['users'],
    roles: ['roles'],
} as const;

export const QUERY_KEY = {
    // ======================
    // ORDERS
    // ======================
    orders: {
        list: (query: QueryOrder) => [...KEY.orders, 'list', query] as const,
        catalog: (query: QueryCatelog) => [...KEY.orders, 'catalog', query] as const,
        myStore: (query: QueryOrder) => [...KEY.orders, 'my-store', query] as const,
        detail: (id: string) => [...KEY.orders, 'detail', id] as const,
        review: (id: string) => [...KEY.orders, 'review', id] as const,
    },

    // ======================
    // CLAIMS
    // ======================
    claims: {
        list: (query: QueryClaim) => [...KEY.claims, 'list', query] as const,
        myStore: (query: QueryClaim) => [...KEY.claims, 'my-store', query] as const,
        detail: (id: string) => [...KEY.claims, 'detail', id] as const,
    },

    // ======================
    // RECEIPTS / INBOUND
    // ======================
    receipts: {
        list: (query: QueryIbound) => [...KEY.receipts, 'list', query] as const,
        detail: (id: string) => [...KEY.receipts, 'detail', id] as const,
        batchLabel: (id: string) => [...KEY.receipts, 'batch-label', id] as const,
    },

    // ======================
    // INVENTORY
    // ======================
    inventory: {
        store: (query: QueryInventory) => [...KEY.inventory, 'store', query] as const,
        transaction: (query: QueryInventory) => [...KEY.inventory, 'transaction', query] as const,
        summary: (query: QueryInventorySummary) => [...KEY.inventory, 'summary', query] as const,
        lowStock: (warehouseId?: number) => [...KEY.inventory, 'low-stock', warehouseId] as const,
        kitchenSummary: (query: QueryKitchen) => [...KEY.inventory, 'kitchen-summary', query] as const,
        kitchenDetails: (productId: number) => [...KEY.inventory, 'kitchen-details', productId] as const,
    },

    // ======================
    // PRODUCTS
    // ======================
    products: {
        list: (query: QueryProduct) => [...KEY.products, 'list', query] as const,
        detail: (id: number) => [...KEY.products, 'detail', id] as const,
        batchList: (query: QueryBatch) => [...KEY.products, 'batch-list', query] as const,
        batchDetail: (id: number) => [...KEY.products, 'batch-detail', id] as const,
    },

    // ======================
    // STORES
    // ======================
    stores: {
        list: (query: QueryStore) => [...KEY.stores, 'list', query] as const,
        detail: (id: string) => [...KEY.stores, 'detail', id] as const,
    },

    // ======================
    // SUPPLIERS
    // ======================
    suppliers: {
        list: (query: QuerySupplier) => [...KEY.suppliers, 'list', query] as const,
        detail: (id: string) => [...KEY.suppliers, 'detail', id] as const,
    },

    // ======================
    // SHIPMENTS
    // ======================
    shipments: {
        list: (query: QueryShipment) => [...KEY.shipments, 'list', query] as const,
        myStore: (query: QueryShipment) => [...KEY.shipments, 'my-store', query] as const,
        detail: (id: string) => [...KEY.shipments, 'detail', id] as const,
        pickingList: (id: string) => [...KEY.shipments, 'picking-list', id] as const,
    },

    // ======================
    // WAREHOUSE
    // ======================
    warehouse: {
        pickingTaskList: (query: QueryPickingTask) => [...KEY.warehouse, 'picking-task-list', query] as const,
        pickingTaskDetail: (id: string) => [...KEY.warehouse, 'picking-task-detail', id] as const,
        shipmentLabel: (id: string) => [...KEY.warehouse, 'shipment-label', id] as const,
        scanCheckBatch: (batchCode: string) => [...KEY.warehouse, 'scan-check-batch', batchCode] as const,
    },

    // ======================
    // ANALYTICS
    // ======================
    analytics: {
        orderFillRate: (params: OrderFillRateQueryType) => [...KEY.analytics, 'order-fill-rate', params] as const,
        orderSlaLeadTime: (params: OrderSLAQueryType) => [...KEY.analytics, 'order-sla-lead-time', params] as const,
        storeDemandPattern: (params: StoreDemandPatternQueryType) => [...KEY.analytics, 'store-demand-pattern', params] as const,
        inventoryAging: (params: InventoryAgingQueryType) => [...KEY.analytics, 'inventory-aging', params] as const,
        inventoryWaste: (params: InventoryWasteQueryType) => [...KEY.analytics, 'inventory-waste', params] as const,
        financialLoss: (params: FinancialLossQueryType) => [...KEY.analytics, 'financial-loss', params] as const,
        claimSummary: (params: ClaimAnalyticsQueryType) => [...KEY.analytics, 'claim-summary', params] as const,
    },

    // ======================
    // BASE UNIT
    // ======================
    baseUnits: {
        list: () => [...KEY.baseUnits, 'list'] as const,
        detail: (id: number) => [...KEY.baseUnits, 'detail', id] as const,
    }

} as const

export const PAGINATION_DEFAULT = {
    page: 1,
    limit: 20,
    sortOrder: 'DESC' as 'DESC' | 'ASC'
}