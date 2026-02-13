'use client'
import { inventoryRequest } from "@/apiRequest/inventory";
import { InventoryAdjustBodyType } from "@/schemas/inventory";
import { QueryInventory, QueryInventorySummary, QueryInventoryTransaction, QueryKitchen } from "@/types/inventory";
import { QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useInventory = () => {
    const adjustInventory = useMutation({
        mutationFn: async (data: InventoryAdjustBodyType) => {
            const res = await inventoryRequest.adjustInventory(data)
            return res.data
        }
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
                const res = await inventoryRequest.getInventoryStoreTransaction(query)
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

    return {
        adjustInventory,
        inventoryStore,
        inventoryTransaction,
        inventorySummary,
        lowStock,
        kitchenSummary,
        kitchenDetails
    }
}
