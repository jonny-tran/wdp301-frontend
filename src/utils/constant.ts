import { QueryClaim } from "@/types/claim";
import { QueryIbound } from "@/types/inbound";
import { QueryInventory, QueryInventorySummary, QueryKitchen } from "@/types/inventory";
import { QueryBatch, QueryProduct } from "@/types/product";
import { QueryShipment } from "@/types/shipment";
import { QueryStore } from "@/types/store";
import { QuerySupplier } from "@/types/supplier";
import { QueryCatelog, QueryOrder } from "@/types/order";
import { QueryPickingTask } from "@/types/warehouse";

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


export const QUERY_KEY = {
    // Order
    orderList: (query: QueryOrder) => ['order-list', query],
    catalogList: (query: QueryCatelog) => ['catalog-list', query],
    myStoreOrderList: (query: QueryOrder) => ['my-store-order-list', query],
    orderDetail: (id: string) => ['order-detail', id],
    reviewOrder: (id: string) => ['review-order', id],

    // Claim
    claimList: (query: QueryClaim) => ['claim-list', query],
    myStoreClaimList: (query: QueryClaim) => ['my-store-claim-list', query],
    claimDetail: (id: string) => ['claim-detail', id],

    // Inbound
    receiptList: (query: QueryIbound) => ['receipt-list', query],
    receiptDetail: (id: string) => ['receipt-detail', id],
    batchLabel: (id: number | string) => ['batch-label', id],

    // Inventory
    inventoryStore: (query: QueryInventory) => ['inventory-store', query],
    inventoryTransaction: (query: QueryInventory) => ['inventory-transaction', query],
    inventorySummary: (query: QueryInventorySummary) => ['inventory-summary', query],
    lowStock: (warehouseId?: number) => ['low-stock', warehouseId],
    kitchenSummary: (query: QueryKitchen) => ['kitchen-summary', query],
    kitchenDetails: (productId: number) => ['kitchen-details', productId],

    // Product
    productList: (query: QueryProduct) => ['product-list', query],
    productDetail: (id: number | string) => ['product-detail', id],
    batchList: (query: QueryBatch) => ['batch-list', query],
    batchDetail: (id: number | string) => ['batch-detail', id],

    // Store
    storeList: (query: QueryStore) => ['store-list', query],
    storeDetail: (id: string) => ['store-detail', id],

    // Supplier
    supplierList: (query: QuerySupplier) => ['supplier-list', query],
    supplierDetail: (id: number | string) => ['supplier-detail', id],

    // Shipment
    shipmentList: (query: QueryShipment) => ['shipment-list', query],
    myStoreShipmentList: (query: QueryShipment) => ['my-store-shipment-list', query],
    shipmentDetail: (id: string) => ['shipment-detail', id],
    shipmentPickingList: (id: string) => ['shipment-picking-list', id],

    // Warehouse
    pickingTaskList: (query: QueryPickingTask) => ['picking-task-list', query],
    pickingTaskDetail: (id: string) => ['picking-task-detail', id],
    shipmentLabel: (id: string) => ['shipment-label', id],
    scanCheckBatch: (batchCode: string) => ['scan-check-batch', batchCode],

} as const
export const KEY = {
    me: ['profile']
} as const;