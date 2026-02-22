'use client'
import { inboundRequest } from "@/apiRequest/inbound";
import { handleErrorApi } from "@/lib/errors";
import { AddReceiptItemBodyType, CreateReceiptBodyType, ReprintBatchBodyType } from "@/schemas/inbound";
import { QueryIbound } from "@/types/inbound";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInbound = () => {
    const queryClient = useQueryClient();
    const createReceipt = useMutation({
        mutationFn: async (data: CreateReceiptBodyType) => {
            const res = await inboundRequest.createReceipt(data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Receipt created successfully')
            queryClient.invalidateQueries({ queryKey: KEY.receipts })
        },
    })

    const addReceiptItem = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: AddReceiptItemBodyType }) => {
            const res = await inboundRequest.addReceiptItem(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Receipt item added successfully')
            queryClient.invalidateQueries({ queryKey: KEY.receipts })
        },
    })

    const completeReceipt = useMutation({
        mutationFn: async (id: string) => {
            const res = await inboundRequest.completeReceipt(id)
            return res.data
        },
        onSuccess: () => {
            toast.success('Receipt completed successfully')
            queryClient.invalidateQueries({ queryKey: KEY.receipts })
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const deleteReceiptItem = useMutation({
        mutationFn: async (batchId: string) => {
            const res = await inboundRequest.deleteReceiptItem(batchId)
            return res.data
        },
        onSuccess: () => {
            toast.success('Receipt item deleted successfully')
            queryClient.invalidateQueries({ queryKey: KEY.receipts })
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const reprintBatch = useMutation({
        mutationFn: async (data: ReprintBatchBodyType) => {
            const res = await inboundRequest.reprintBatch(data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Batch reprinted successfully')
            queryClient.invalidateQueries({ queryKey: KEY.receipts })
        },
    })

    const receiptList = (query: QueryIbound) => {
        return useQuery({
            queryKey: QUERY_KEY.receipts.list(query),
            queryFn: async () => {
                const res = await inboundRequest.getReceipts(query)
                return res.data
            }
        })
    }

    const receiptDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.receipts.detail(id),
            queryFn: async () => {
                const res = await inboundRequest.getReceiptDetail(id)
                return res.data
            },
            enabled: !!id
        })
    }

    const batchLabel = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.receipts.batchLabel(id),
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

