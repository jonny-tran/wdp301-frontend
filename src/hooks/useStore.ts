'use client'
import { storeRequest } from "@/apiRequest/store";
import { handleErrorApi } from "@/lib/errors";
import { StoreDemandPatternQueryType } from "@/schemas/analytics";
import { CreateStoreBodyType, UpdateStoreBodyType } from "@/schemas/store";
import { QueryStore } from "@/types/store";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStore = () => {
    const createStore = useMutation({
        mutationFn: async (data: CreateStoreBodyType) => {
            const res = await storeRequest.createStore(data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Store created successfully')
        },
    })

    const updateStore = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: UpdateStoreBodyType }) => {
            const res = await storeRequest.updateStore(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Store updated successfully')
        },
    })

    const deleteStore = useMutation({
        mutationFn: async (id: string) => {
            const res = await storeRequest.deleteStore(id)
            return res.data
        },
        onSuccess: () => {
            toast.success('Store deleted successfully')
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const storeList = (query: QueryStore) => {
        return useQuery({
            queryKey: QUERY_KEY.storeList(query),
            queryFn: async () => {
                const res = await storeRequest.getStores(query)
                return res.data
            }
        })
    }

    const storeDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.storeDetail(id),
            queryFn: async () => {
                const res = await storeRequest.getStoreDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }

    const storeReliabilityAnalytics = () => {
        return useQuery({
            queryKey: KEY.storeReliabilityAnalytics,
            queryFn: async () => {
                const res = await storeRequest.getStoreReliabilityAnalytics()
                return res.data
            }
        })
    }

    const storeDemandPatternAnalytics = (params: StoreDemandPatternQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.storeDemandPatternAnalytics(params),
            queryFn: async () => {
                const res = await storeRequest.getStoreDemandPatternAnalytics(params)
                return res.data
            }
        })
    }

    return {
        createStore,
        updateStore,
        deleteStore,
        storeList,
        storeDetail,
        storeReliabilityAnalytics,
        storeDemandPatternAnalytics
    }
}

