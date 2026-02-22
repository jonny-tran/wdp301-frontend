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

// Define Actions
export const Action = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    CONFIRM: 'confirm',
    PLAN: 'plan',
    PROCESS: 'process',
    MANAGE: 'manage',
    SCHEDULE: 'schedule',
    TRACK: 'track',
    AGGREGATE: 'aggregate',
    CONFIGURE: 'configure',
} as const;

export const Scope = {
    INCOMING: 'incoming',
    OUTGOING: 'outgoing',
    ALL: 'all',
} as const;

// Define Resources
export const Resource = {
    ORDER: 'order',
    INVENTORY: 'inventory',
    PRODUCTION: 'production',
    DELIVERY: 'delivery',
    PRODUCT: 'product',
    USER: 'user',
    SYSTEM: 'system',
    REPORT: 'report',
    STORE: 'store',
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