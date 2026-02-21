'use client'
import { inventoryRequest } from "@/apiRequest/inventory";
import { handleErrorApi } from "@/lib/errors";
import { FinancialLossQueryType, InventoryAgingQueryType, InventoryWasteQueryType } from "@/schemas/analytics";
import { InventoryAdjustBodyType } from "@/schemas/inventory";
import { QueryInventory, QueryInventorySummary, QueryInventoryTransaction, QueryKitchen } from "@/types/inventory";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInventory = () => {
    const adjustInventory = useMutation({
        mutationFn: async (data: InventoryAdjustBodyType) => {
            const res = await inventoryRequest.adjustInventory(data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Inventory adjusted successfully')
        },
    })

    const inventoryStore = (query: QueryInventory) => {
        return useQuery({
            queryKey: QUERY_KEY.inventoryStore(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryStore(query)
                return res.data
            }
        })
    }
    const inventoryTransaction = (query: QueryInventoryTransaction) => {
        return useQuery({
            queryKey: QUERY_KEY.inventoryTransaction(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryStoreTransactions(query)
                return res.data
            }
        })
    }
    const inventorySummary = (query: QueryInventorySummary) => {
        return useQuery({
            queryKey: QUERY_KEY.inventorySummary(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventorySummary(query)
                return res.data
            }
        })
    }
    const lowStock = (warehouseId?: number) => {
        return useQuery({
            queryKey: QUERY_KEY.lowStock(warehouseId),
            queryFn: async () => {
                const res = await inventoryRequest.getLowStock(warehouseId)
                return res.data
            }
        })
    }
    const kitchenSummary = (query: QueryKitchen) => {
        return useQuery({
            queryKey: QUERY_KEY.kitchenSummary(query),
            queryFn: async () => {
                const res = await inventoryRequest.getKitchenSummary(query)
                return res.data
            }
        })
    }
    const kitchenDetails = (productId: number) => {
        return useQuery({
            queryKey: QUERY_KEY.kitchenDetails(productId),
            queryFn: async () => {
                const res = await inventoryRequest.getKitchenDetails(productId)
                return res.data
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
            queryKey: QUERY_KEY.inventoryAgingReport(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryAgingReport(query)
                return res.data
            }
        })
    }

    const inventoryWasteReport = (query: InventoryWasteQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.inventoryWasteReport(query),
            queryFn: async () => {
                const res = await inventoryRequest.getInventoryWasteReport(query)
                return res.data
            }
        })
    }

    const financialLossImpact = (params: FinancialLossQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.financialLossImpact(params),
            queryFn: async () => {
                const res = await inventoryRequest.getFinancialLossImpact(params)
                return res.data
            }
        })
    }

    return {
        adjustInventory,
        inventoryStore,
        inventoryTransaction,
        inventorySummary,
        lowStock,
        kitchenSummary,
        kitchenDetails,
        inventoryAnalyticsSummary,
        inventoryAgingReport,
        inventoryWasteReport,
        financialLossImpact
    }
}
