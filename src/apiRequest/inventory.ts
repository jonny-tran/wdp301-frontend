import http from "@/lib/http";
import { FinancialLossQueryType, InventoryAgingQueryType, InventoryWasteQueryType, InventoryWasteReportQueryType } from "@/schemas/analytics";
import { InventoryAdjustBodyType, InventoryWasteBodyType } from "@/schemas/inventory";
import { BaseResponsePagination } from "@/types/base";
import { FinancialLossImpact, InventoryAgingReport, InventoryAnalyticsSummary, InventoryStoreItem, InventorySummaryItem, InventoryTransaction, InventoryWasteReportDetail, InventoryWasteSummary, KitchenDetail, KitchSummary, LowStockItem, QueryInventory, QueryInventorySummary, QueryInventoryTransaction, QueryKitchen } from "@/types/inventory";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const inventoryRequest = {
    // GET /inventory/store
    getInventoryStore: (query: QueryInventory) => http.get<BaseResponsePagination<InventoryStoreItem>>(ENDPOINT_CLIENT.INVENTORY_STORE, { query }),

    // GET /inventory/store/transactions
    getInventoryStoreTransaction: (query: QueryInventoryTransaction) => http.get(ENDPOINT_CLIENT.INVENTORY_STORE_TRANSACTION, { query }),

    // GET /inventory/transactions (audit trail kitchen)
    getInventoryTransactions: (query: QueryInventoryTransaction) =>
        http.get<BaseResponsePagination<unknown>>(ENDPOINT_CLIENT.INVENTORY_TRANSACTIONS, { query }),

    // GET /inventory/summary
    getInventorySummary: (query: QueryInventorySummary) => http.get<BaseResponsePagination<InventorySummaryItem>>(ENDPOINT_CLIENT.INVENTORY_SUMMARY, { query }),


    // GET /inventory/low-stock
    getLowStock: (warehouseId?: number) => http.get<LowStockItem[]>(ENDPOINT_CLIENT.INVENTORY_LOW_STOCK, { query: { warehouseId } }),

    // POST /inventory/adjust
    adjustInventory: (data: InventoryAdjustBodyType) => http.post<InventoryTransaction>(ENDPOINT_CLIENT.INVENTORY_ADJUST, data),

    // POST /inventory/waste
    reportWaste: (data: InventoryWasteBodyType) => http.post<unknown>(ENDPOINT_CLIENT.INVENTORY_WASTE_CREATE, data),


    // GET /inventory/kitchen/summary
    getKitchenSummary: (query: QueryKitchen) => http.get<BaseResponsePagination<KitchSummary>>(ENDPOINT_CLIENT.INVENTORY_KITCHEN_SUMMARY, { query }),
    // GET /inventory/kitchen/details?product_id=
    getKitchenDetails: (productId: number) => http.get<KitchenDetail>(ENDPOINT_CLIENT.INVENTORY_KITCHEN_DETAILS, { query: { product_id: productId } }),

    // Analytics
    getInventoryAnalyticsSummary: () =>
        http.get<InventoryAnalyticsSummary>(ENDPOINT_CLIENT.INVENTORY_ANALYTICS_SUMMARY),

    getInventoryAgingReport: async (params: InventoryAgingQueryType) => {
        try {
            return await http.get<InventoryAgingReport>(ENDPOINT_CLIENT.INVENTORY_AGING, { query: params });
        } catch {
            // Fallback cho một số bản BE cũ dùng /analytics/inventory/aging
            return http.get<InventoryAgingReport>("/analytics/inventory/aging", { query: params });
        }
    },

    getInventoryWasteSummary: async (params: InventoryWasteQueryType) => {
        try {
            return await http.get<InventoryWasteSummary>(ENDPOINT_CLIENT.INVENTORY_WASTE_SUMMARY, { query: params });
        } catch {
            // Fallback cho môi trường BE cũ còn dùng /inventory/analytics/waste
            return http.get<InventoryWasteSummary>(ENDPOINT_CLIENT.INVENTORY_WASTE, { query: params });
        }
    },

    getInventoryWasteReport: (params: InventoryWasteReportQueryType) =>
        http.get<InventoryWasteReportDetail>(ENDPOINT_CLIENT.INVENTORY_WASTE_REPORT, { query: params }),

    getFinancialLossImpact: (params: FinancialLossQueryType) =>
        http.get<FinancialLossImpact>(ENDPOINT_CLIENT.FINANCIAL_LOSS, { query: params }),
};

