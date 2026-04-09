'use client'
import { inventoryRequest } from "@/apiRequest/inventory";
import { handleErrorApi } from "@/lib/errors";
import {
    normalizeInventoryTransactionLogItem,
    normalizeKitchenDetailFromApi,
    normalizeKitchSummary,
} from "@/lib/kitchen-inventory-mapper";
import { FinancialLossQueryType, InventoryAgingQueryType, InventoryWasteQueryType, InventoryWasteReportQueryType } from "@/schemas/analytics";
import { InventoryAdjustBodyType, InventoryWasteBodySchema, InventoryWasteBodyType } from "@/schemas/inventory";
import { QueryInventory, QueryInventorySummary, QueryInventoryTransaction, QueryKitchen } from "@/types/inventory";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInventory = () => {
    const queryClient = useQueryClient();
    const adjustInventory = useMutation({
        mutationFn: async (data: InventoryAdjustBodyType) => {
            const res = await inventoryRequest.adjustInventory(data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Đã điều chỉnh kho')
            queryClient.invalidateQueries({ queryKey: KEY.inventory })
        },
    })

    const reportWaste = useMutation({
        mutationFn: async (data: InventoryWasteBodyType) => {
            const parsed = InventoryWasteBodySchema.parse(data);
            const res = await inventoryRequest.reportWaste(parsed);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã ghi nhận báo hủy lô");
            queryClient.invalidateQueries({ queryKey: KEY.inventory });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const inventoryStore = (query: QueryInventory) => {
        return useQuery({
            queryKey: QUERY_KEY.inventory.store(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryStore(query)
                return res.data
            }
        })
    }
    const inventoryTransaction = (query: QueryInventoryTransaction) => {
        return useQuery({
            queryKey: QUERY_KEY.inventory.transaction(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryStoreTransaction(query)
                return res.data
            }
        })
    }

    /** GET /inventory/transactions — nhật ký điều chỉnh kho bếp */
    const inventoryTransactions = (
        query: QueryInventoryTransaction,
        options?: { enabled?: boolean },
    ) => {
        return useQuery({
            queryKey: QUERY_KEY.inventory.transactions(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryTransactions(query)
                const raw = res.data
                return {
                    items: (raw.items ?? []).map(normalizeInventoryTransactionLogItem),
                    meta: raw.meta,
                }
            },
            enabled: options?.enabled !== false,
        })
    }
    const inventorySummary = (query: QueryInventorySummary) => {
        return useQuery({
            queryKey: QUERY_KEY.inventory.summary(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventorySummary(query)
                return res.data
            }
        })
    }
    const lowStock = (warehouseId?: number) => {
        return useQuery({
            queryKey: QUERY_KEY.inventory.lowStock(warehouseId),
            queryFn: async () => {
                const res = await inventoryRequest.getLowStock(warehouseId)
                return res.data
            }
        })
    }
    const kitchenSummary = (query: QueryKitchen) => {
        return useQuery({
            queryKey: QUERY_KEY.inventory.kitchenSummary(query),
            queryFn: async () => {
                const res = await inventoryRequest.getKitchenSummary(query)
                const { items, meta } = res.data
                return {
                    items: items.map((row) => normalizeKitchSummary(row)),
                    meta,
                }
            }
        })
    }
    const kitchenDetails = (productId: number) => {
        return useQuery({
            queryKey: QUERY_KEY.inventory.kitchenDetails(productId),
            queryFn: async () => {
                const res = await inventoryRequest.getKitchenDetails(productId)
                return normalizeKitchenDetailFromApi(res.data)
            },
            enabled: !!productId
        })
    }

    const inventoryAnalyticsSummary = () => {
        return useQuery({
            queryKey: KEY.inventoryAnalyticsSummary,
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryAnalyticsSummary()
                return res.data
            }
        })
    }

    const inventoryAgingReport = (query: InventoryAgingQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.analytics.inventoryAging(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryAgingReport(query);
                return res.data;
            },
        })
    }

    const inventoryWasteReport = (query: InventoryWasteQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.analytics.inventoryWaste(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryWasteSummary(query)
                return res.data
            }
        })
    }

    const inventoryWasteDetailReport = (query: InventoryWasteReportQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.analytics.inventoryWasteDetail(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryWasteReport(query)
                return res.data
            }
        })
    }

    const financialLossImpact = (params: FinancialLossQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.analytics.financialLoss(params),
            queryFn: async () => {
                const res = await inventoryRequest.getFinancialLossImpact(params)
                return res.data
            }
        })
    }

    return {
        adjustInventory,
        reportWaste,
        inventoryStore,
        inventoryTransaction,
        inventoryTransactions,
        inventorySummary,
        lowStock,
        kitchenSummary,
        kitchenDetails,
        inventoryAnalyticsSummary,
        inventoryAgingReport,
        inventoryWasteReport,
        inventoryWasteDetailReport,
        financialLossImpact
    }
}
