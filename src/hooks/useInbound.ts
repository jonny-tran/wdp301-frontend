"use client";

import { inboundRequest } from "@/apiRequest/inbound";
import { handleErrorApi } from "@/lib/errors";
import {
    AddReceiptItemBodyType,
    CreateReceiptBodyType,
    ReprintBatchBodyType,
    VarianceApprovalBodyType,
} from "@/schemas/inbound";
import { QueryIbound } from "@/types/inbound";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInbound = () => {
    const queryClient = useQueryClient();
    const createReceipt = useMutation({
        mutationFn: async (data: CreateReceiptBodyType) => {
            const res = await inboundRequest.createReceipt(data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã tạo phiếu nhập");
            queryClient.invalidateQueries({ queryKey: KEY.receipts });
        },
    });

    const addReceiptItem = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: AddReceiptItemBodyType }) => {
            const res = await inboundRequest.addReceiptItem(id, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã thêm dòng vào phiếu nhập");
            queryClient.invalidateQueries({ queryKey: KEY.receipts });
        },
    });

    const completeReceipt = useMutation({
        mutationFn: async (id: string) => {
            const res = await inboundRequest.completeReceipt(id);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã chốt phiếu — lô & tồn kho đã cập nhật");
            queryClient.invalidateQueries({ queryKey: KEY.receipts });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const deleteReceiptItem = useMutation({
        mutationFn: async ({ receiptId, itemId }: { receiptId: string; itemId: string | number }) => {
            const res = await inboundRequest.deleteReceiptItem(receiptId, itemId);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã xóa dòng khỏi phiếu nhập");
            queryClient.invalidateQueries({ queryKey: KEY.receipts });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const varianceApproval = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: VarianceApprovalBodyType }) => {
            const res = await inboundRequest.varianceApproval(id, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã cập nhật phê duyệt sai lệch");
            queryClient.invalidateQueries({ queryKey: KEY.receipts });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const reprintBatch = useMutation({
        mutationFn: async (data: ReprintBatchBodyType) => {
            const res = await inboundRequest.reprintBatch(data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã in lại batch");
            queryClient.invalidateQueries({ queryKey: KEY.receipts });
        },
    });

    const receiptList = (query: QueryIbound) => {
        return useQuery({
            queryKey: QUERY_KEY.receipts.list(query),
            queryFn: async () => {
                const res = await inboundRequest.getReceipts(query);
                return res.data;
            },
        });
    };

    const receiptDetail = (id: string, options?: { omitExpected?: boolean }) => {
        return useQuery({
            queryKey: QUERY_KEY.receipts.detail(id, { omitExpected: options?.omitExpected }),
            queryFn: async () => {
                const res = await inboundRequest.getReceiptDetail(id, { omitExpected: options?.omitExpected });
                return res.data;
            },
            enabled: !!id,
        });
    };

    const batchLabel = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.receipts.batchLabel(id),
            queryFn: async () => {
                const res = await inboundRequest.getBatchLabel(id);
                return res.data;
            },
            enabled: !!id,
        });
    };

    return {
        createReceipt,
        addReceiptItem,
        completeReceipt,
        deleteReceiptItem,
        varianceApproval,
        reprintBatch,
        receiptList,
        receiptDetail,
        batchLabel,
    };
};
