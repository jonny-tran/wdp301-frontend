'use client'
import { storeRequest } from "@/apiRequest/store";
import { CreateStoreBodyType, UpdateStoreBodyType } from "@/schemas/store";
import { QueryStore } from "@/types/store";
import { QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useStore = () => {
    const createStore = useMutation({
        mutationFn: async (data: CreateStoreBodyType) => {
            const res = await storeRequest.createStore(data)
            return res.data
        }
    })

    const updateStore = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: UpdateStoreBodyType }) => {
            const res = await storeRequest.updateStore(id, data)
            return res.data
        }
    })

    const deleteStore = useMutation({
        mutationFn: async (id: string) => {
            const res = await storeRequest.deleteStore(id)
            return res.data
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

    return {
        createStore,
        updateStore,
        deleteStore,
        storeList,
        storeDetail
    }
}

