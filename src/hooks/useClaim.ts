'use client'
import { claimRequest } from "@/apiRequest/claim";
import { ClaimAnalyticsQueryType } from "@/schemas/analytics";
import { CreateClaimBodyType, ResolveClaimBodyType } from "@/schemas/claim";
import { QueryClaim } from "@/types/claim";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useClaim = () => {
    const queryClient = useQueryClient();
    const claimList = (query: QueryClaim) => {
        return useQuery({
            queryKey: QUERY_KEY.claims.list(query),
            queryFn: async () => {
                const res = await claimRequest.getClaims(query)
                return res.data
            }
        })
    }

    const myStoreClaimList = (query: QueryClaim) => {
        return useQuery({
            queryKey: QUERY_KEY.claims.myStore(query),
            queryFn: async () => {
                const res = await claimRequest.getMyStoreClaims(query)
                return res.data
            }
        })
    }

    const claimDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.claims.detail(id),
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
        onSuccess: () => {
            toast.success('Claim created successfully')
            queryClient.invalidateQueries({ queryKey: KEY.claims })
        }
    })

    const resolveClaim = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: ResolveClaimBodyType }) => {
            const res = await claimRequest.resolveClaim(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Claim resolved successfully')
            queryClient.invalidateQueries({ queryKey: KEY.claims })
        },
    })


    const claimAnalyticsSummary = (query: ClaimAnalyticsQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.analytics.claimSummary(query),
            queryFn: async () => {
                const res = await claimRequest.getClaimAnalyticsSummary(query)
                return res.data
            }
        })
    }

    return {
        createClaim,
        resolveClaim,
        claimDetail,
        claimList,
        myStoreClaimList,
        claimAnalyticsSummary
    }
}

