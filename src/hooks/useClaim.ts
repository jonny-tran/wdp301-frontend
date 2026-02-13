'use client'
import { claimRequest } from "@/apiRequest/claim";
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
        }
    })

    const resolveClaim = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: ResolveClaimBodyType }) => {
            const res = await claimRequest.resolveClaim(id, data)
            return res.data
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

// export const useGetClaimDetail = (id: string) => {
//     return useQuery({
//         queryKey: ['claim', id],
//         queryFn: async () => {
//             const res = await claimRequest.getClaimDetail(id)
//             return res.data
//         },
//         enabled: !!id
//     })
// }

// export const useGetMyStoreClaims = (status?: string) => {
//     return useQuery({
//         queryKey: ['my-claims', status],
//         queryFn: async () => {
//             const res = await claimRequest.getMyStoreClaims(status)
//             return res.data
//         }
//     })
// }
