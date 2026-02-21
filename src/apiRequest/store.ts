import http from "@/lib/http";
import { StoreDemandPatternQueryType } from "@/schemas/analytics";
import { CreateStoreBodyType, UpdateStoreBodyType } from "@/schemas/store";
import { BaseResponePagination } from "@/types/base";
import { QueryStore, Store, StoreDemandPatternAnalytics, StoreReliabilityAnalytics } from "@/types/store";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const storeRequest = {
    // GET /stores
    getStores: (query: QueryStore) => http.get<BaseResponePagination<Store[]>>(ENDPOINT_CLIENT.STORES, { query }),

    // POST /stores
    createStore: (data: CreateStoreBodyType) => http.post<Store>(ENDPOINT_CLIENT.CREATE_STORE, data),

    // GET /stores/:id
    getStoreDetail: (id: string) => http.get<Store>(ENDPOINT_CLIENT.STORE_DETAIL(id)),

    // PATCH /stores/:id
    updateStore: (id: string, data: UpdateStoreBodyType) => http.patch<Store>(ENDPOINT_CLIENT.UPDATE_STORE(id), data),

    // DELETE /stores/:id
    deleteStore: (id: string) => http.delete(ENDPOINT_CLIENT.DELETE_STORE(id)),

    // Analytics
    getStoreReliabilityAnalytics: () =>
        http.get<StoreReliabilityAnalytics>(ENDPOINT_CLIENT.STORE_RELIABILITY),

    getStoreDemandPatternAnalytics: (params: StoreDemandPatternQueryType) =>
        http.get<StoreDemandPatternAnalytics>(ENDPOINT_CLIENT.STORE_DEMAND_PATTERN, { query: params }),
};

