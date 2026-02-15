'use client'
import { claimRequest } from "@/apiRequest/claim";
import { handleErrorApi } from "@/lib/errors";
import { CreateClaimBodyType, ResolveClaimBodyType } from "@/schemas/claim";
import { QueryClaim } from "@/types/claim";
import { QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useClaim = () => {

    const claimDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.claimDetail(id),
            queryFn: async () => {
                const res = await claimRequest.getClaimDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }
    const createClaim = useMutation({
        mutationFn: async (data: CreateClaimBodyType) => {
            const res = await claimRequest.createClaim(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const resolveClaim = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: ResolveClaimBodyType }) => {
            const res = await claimRequest.resolveClaim(id, data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const claimList = (query: QueryClaim) => {
        return useQuery({
            queryKey: QUERY_KEY.claimList(query),
            queryFn: async () => {
                const res = await claimRequest.getClaims(query)
                return res.data
            }
        })
    }

    const myStoreClaimList = (query: QueryClaim) => {
        return useQuery({
            queryKey: QUERY_KEY.myStoreClaimList(query),
            queryFn: async () => {
                const res = await claimRequest.getMyStoreClaims(query)
                return res.data
            }
        })
    }

    return {
        createClaim,
        resolveClaim,
        claimDetail,
        claimList,
        myStoreClaimList
    }
}

