'use client'
import { orderRequest } from "@/apiRequest/order";
import { mergeCollaborationIntoOrderDetail } from "@/lib/order-collaboration";
import { handleErrorApi } from "@/lib/errors";
import { OrderFillRateQueryType, OrderSLAQueryType } from "@/schemas/analytics";
import {
    ApproveOrderBodyType,
    CreateOrderBodyType,
    KitchenProductionResponseBody,
    RejectOrderBodyType,
    RequestProductionBody,
} from "@/schemas/order";
import { type OrderDetail, QueryCatelog, QueryOrder } from "@/types/order";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useOrder = () => {
    const queryClient = useQueryClient();
    const orderList = (query: QueryOrder) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.list(query),
            queryFn: async () => {
                const res = await orderRequest.getOrderList(query)
                return res.data
            },
            enabled: !!query
        })
    }
    const catalogList = (query: QueryCatelog) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.catalog(query),
            queryFn: async () => {
                const res = await orderRequest.getCatalog(query)
                return res.data
            }
        })
    }
    const myStoreOrderList = (query: QueryOrder) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.myStore(query),
            queryFn: async () => {
                const res = await orderRequest.getMyStoreOrder(query)
                return res.data
            }
        })
    }
    
    const orderDetail = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.detail(id),
            queryFn: async () => {
                const res = await orderRequest.getOrderDetail(id)
                return mergeCollaborationIntoOrderDetail(res.data as OrderDetail)
            },
            enabled: !!id
        })
    }
    const reviewOrder = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.review(id),
            queryFn: async () => {
                const res = await orderRequest.reviewOrder(id)
                return res.data
            },
            enabled: !!id
        })
    }

    const approvalSuggestion = (id: string, options?: { enabled?: boolean }) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.approvalSuggestion(id),
            queryFn: async () => {
                const res = await orderRequest.getApprovalSuggestion(id)
                return orderRequest.parseApprovalSuggestion(res.data)
            },
            enabled: (options?.enabled !== false) && !!id,
        })
    }

    const createOrder = useMutation({
        mutationFn: async (data: CreateOrderBodyType) => {
            const res = await orderRequest.createOrder(data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Tạo đơn hàng thành công')
            queryClient.invalidateQueries({ queryKey: KEY.orders })
        },
    })

    const approveOrder = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: ApproveOrderBodyType }) => {
            const res = await orderRequest.approveOrder(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Đơn hàng đã được duyệt')
        },
        onSettled: (_d, _e, variables) => {
            queryClient.invalidateQueries({ queryKey: KEY.orders })
            queryClient.invalidateQueries({ queryKey: KEY.shipments })
            if (variables?.id) {
                void queryClient.invalidateQueries({ queryKey: QUERY_KEY.orders.approvalSuggestion(variables.id) })
                void queryClient.invalidateQueries({ queryKey: QUERY_KEY.orders.review(variables.id) })
            }
        },
    })

    const rejectOrder = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: RejectOrderBodyType }) => {
            const res = await orderRequest.rejectOrder(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Đơn hàng đã bị từ chối')
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: KEY.orders })
        }
    })

    const cancelOrder = useMutation({
        mutationFn: async (id: string) => {
            const res = await orderRequest.cancelOrder(id)
            return res.data
        },
        onSuccess: () => {
            toast.success('Đơn hàng đã bị hủy')
            queryClient.invalidateQueries({ queryKey: KEY.orders })
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const requestProduction = useMutation({
        mutationFn: async ({ id, note }: { id: string; note?: string }) => {
            const body = RequestProductionBody.parse({ note: note?.trim() || undefined })
            const res = await orderRequest.requestProduction(id, body)
            return res.data
        },
        onSuccess: () => {
            toast.success('Đã gửi yêu cầu sản xuất thêm cho Bếp trung tâm')
            void queryClient.invalidateQueries({ queryKey: KEY.orders })
        },
        onError: (error) => {
            handleErrorApi({ error })
        },
    })

    const kitchenProductionResponse = useMutation({
        mutationFn: async ({
            id,
            action,
            note,
        }: {
            id: string
            action: 'accept' | 'reject'
            note?: string
        }) => {
            const body = KitchenProductionResponseBody.parse({
                action,
                note: note?.trim() || undefined,
            })
            const res = await orderRequest.kitchenProductionResponse(id, body)
            return res.data
        },
        onSuccess: (_data, variables) => {
            toast.success(
                variables.action === 'accept'
                    ? 'Đã xác nhận — đơn trả về điều phối để duyệt'
                    : 'Đã từ chối — đơn trả về điều phối kèm lý do',
            )
            void queryClient.invalidateQueries({ queryKey: KEY.orders })
            void queryClient.invalidateQueries({ queryKey: QUERY_KEY.orders.detail(variables.id) })
        },
        onError: (error) => {
            handleErrorApi({ error })
        },
    })

    const fillRateAnalytics = (query: OrderFillRateQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.analytics.orderFillRate(query),
            queryFn: async () => {
                const res = await orderRequest.getFillRateAnalytics(query)
                return res.data
            }
        })
    }

    const slaPerformanceLeadTime = (query: OrderSLAQueryType) => {
        return useQuery({
            queryKey: QUERY_KEY.analytics.orderSlaLeadTime(query),
            queryFn: async () => {
                const res = await orderRequest.getSLAPerformanceLeadTime(query)
                return res.data
            }
        })
    }

    return {
        createOrder,
        approveOrder,
        rejectOrder,
        cancelOrder,
        requestProduction,
        kitchenProductionResponse,
        orderList,
        catalogList,
        myStoreOrderList,
        orderDetail,
        reviewOrder,
        approvalSuggestion,
        fillRateAnalytics,
        slaPerformanceLeadTime
    }
}