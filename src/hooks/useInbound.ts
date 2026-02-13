'use client'
import { inboundRequest } from "@/apiRequest/inbound";
import { AddReceiptItemBodyType, CreateReceiptBodyType, ReprintBatchBodyType } from "@/schemas/inbound";
import { QueryIbound } from "@/types/inbound";
import { QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useInbound = () => {
    const createReceipt = useMutation({
        mutationFn: async (data: CreateReceiptBodyType) => {
            const res = await inboundRequest.createReceipt(data)
            return res.data
        }
    })

    const addReceiptItem = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: AddReceiptItemBodyType }) => {
            const res = await inboundRequest.addReceiptItem(id, data)
            return res.data
        }
    })

    const completeReceipt = useMutation({
        mutationFn: async (id: string) => {
            const res = await inboundRequest.completeReceipt(id)
            return res.data
        }
    })

    const deleteReceiptItem = useMutation({
        mutationFn: async (batchId: number | string) => {
            const res = await inboundRequest.deleteReceiptItem(batchId)
            return res.data
        }
    })

    const reprintBatch = useMutation({
        mutationFn: async (data: ReprintBatchBodyType) => {
            const res = await inboundRequest.reprintBatch(data)
            return res.data
        }
    })

    const receiptList = (query: QueryIbound) => {
        return useQuery({
            queryKey: QUERY_KEY.receiptList(query),
            queryFn: async () => {
                const res = await inboundRequest.getReceipts(query)
                return res.data
            }
        })
    }

    const receiptDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.receiptDetail(id),
            queryFn: async () => {
                const res = await inboundRequest.getReceiptDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }

    const batchLabel = (id: number | string) => {
        return useQuery({
            queryKey: QUERY_KEY.batchLabel(id),
            queryFn: async () => {
                const res = await inboundRequest.getBatchLabel(id)
                return res.data
            },
            enabled: !!id
        })
    }

    return {
        createReceipt,
        addReceiptItem,
        completeReceipt,
        deleteReceiptItem,
        reprintBatch,
        receiptList,
        receiptDetail,
        batchLabel
    }
}

// export const useGetReceiptDetail = (id: string) => {
//     return useQuery({
//         queryKey: ['receipt', id],
//         queryFn: async () => {
//             const res = await inboundRequest.getReceiptDetail(id)
//             return res.data
//         },
//         enabled: !!id
//     })
// }

// export const useGetBatchLabel = (id: number | string) => {
//     return useQuery({
//         queryKey: ['batch-label', id],
//         queryFn: async () => {
//             const res = await inboundRequest.getBatchLabel(id)
//             return res.data
//         },
//         enabled: !!id
//     })
// }
