import http from "@/lib/http";
import { FinancialLossQueryType, InventoryAgingQueryType, InventoryWasteQueryType } from "@/schemas/analytics";
import { InventoryAdjustBodyType } from "@/schemas/inventory";
import { BaseResponePagination } from "@/types/base";
import { FinancialLossImpact, InventoryAgingReport, InventoryAnalyticsSummary, InventoryStoreItem, InventorySummaryItem, InventoryTransaction, InventoryWasteReport, KitchenDetail, KitchSummary, LowStockItem, QueryInventory, QueryInventorySummary, QueryInventoryTransaction, QueryKitchen, StoreInventoryTransaction } from "@/types/inventory";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const inventoryRequest = {
    // GET /inventory/store
    getInventoryStore: (query: QueryInventory) => http.get<BaseResponePagination<InventoryStoreItem[]>>(ENDPOINT_CLIENT.INVENTORY_STORE, { query }),

    // GET /inventory/store/transactions
    getInventoryStoreTransactions: (query: QueryInventoryTransaction) => http.get<BaseResponePagination<StoreInventoryTransaction[]>>(ENDPOINT_CLIENT.INVENTORY_STORE_TRANSACTIONS, { query }),

    // GET /inventory/summary
    getInventorySummary: (query: QueryInventorySummary) => http.get<BaseResponePagination<InventorySummaryItem[]>>(ENDPOINT_CLIENT.INVENTORY_SUMMARY, { query }),


    // GET /inventory/low-stock
    getLowStock: (warehouseId?: number) => http.get<LowStockItem[]>(ENDPOINT_CLIENT.INVENTORY_LOW_STOCK, { query: { warehouseId } }),

    // POST /inventory/adjust
    adjustInventory: (data: InventoryAdjustBodyType) => http.post<InventoryTransaction>(ENDPOINT_CLIENT.INVENTORY_ADJUST, data),


    // GET /inventory/kitchen/summary
    getKitchenSummary: (query: QueryKitchen) => http.get<BaseResponePagination<KitchSummary>>(ENDPOINT_CLIENT.INVENTORY_KITCHEN_SUMMARY, { query }),
    // GET /inventory/kitchen/details?product_id=
    getKitchenDetails: (productId: number) => http.get<KitchenDetail>(ENDPOINT_CLIENT.INVENTORY_KITCHEN_DETAILS, { query: { product_id: productId } }),

    // Analytics
    getInventoryAnalyticsSummary: () =>
        http.get<InventoryAnalyticsSummary>(ENDPOINT_CLIENT.INVENTORY_ANALYTICS_SUMMARY),

    getInventoryAgingReport: (params: InventoryAgingQueryType) =>
        http.get<InventoryAgingReport>(ENDPOINT_CLIENT.INVENTORY_AGING, { query: params }),

    getInventoryWasteReport: (params: InventoryWasteQueryType) =>
        http.get<InventoryWasteReport>(ENDPOINT_CLIENT.INVENTORY_WASTE, { query: params }),

    getFinancialLossImpact: (params: FinancialLossQueryType) =>
        http.get<FinancialLossImpact>(ENDPOINT_CLIENT.FINANCIAL_LOSS, { query: params }),
};

