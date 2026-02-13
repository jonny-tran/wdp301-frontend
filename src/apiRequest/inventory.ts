import http from "@/lib/http";
import { InventoryAdjustBodyType } from "@/schemas/inventory";
import { BaseResponePagination } from "@/types/base";
import { InventoryTransaction, KitchenDetail, KitchSummary, LowStockItem, QueryInventory, QueryInventorySummary, QueryInventoryTransaction, QueryKitchen } from "@/types/inventory";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const inventoryRequest = {
    // GET /inventory/store
    getInventoryStore: (query: QueryInventory) => http.get(ENDPOINT_CLIENT.INVENTORY_STORE, { query }),

    // GET /inventory/store/transaction
    getInventoryStoreTransaction: (query: QueryInventoryTransaction) => http.get(ENDPOINT_CLIENT.INVENTORY_STORE_TRANSACTION, { query }),

    // GET /inventory/summary
    getInventorySummary: (query: QueryInventorySummary) => http.get(ENDPOINT_CLIENT.INVENTORY_SUMMARY, { query }),

    // GET /inventory/low-stock
    getLowStock: (warehouseId?: number) => http.get<LowStockItem[]>(ENDPOINT_CLIENT.INVENTORY_LOW_STOCK, { query: { warehouseId } }),

    // POST /inventory/adjust
    adjustInventory: (data: InventoryAdjustBodyType) => http.post<InventoryTransaction>(ENDPOINT_CLIENT.INVENTORY_ADJUST, data),


    // GET /inventory/kitchen/summary
    getKitchenSummary: (query: QueryKitchen) => http.get<BaseResponePagination<KitchSummary>>(ENDPOINT_CLIENT.INVENTORY_KITCHEN_SUMMARY, { query }),
    // GET /inventory/kitchen/details?product_id=
    getKitchenDetails: (productId: number) => http.get<KitchenDetail>(ENDPOINT_CLIENT.INVENTORY_KITCHEN_DETAILS, { query: { product_id: productId } }),
};
