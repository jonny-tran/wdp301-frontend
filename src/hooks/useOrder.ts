'use client'
import { orderRequest } from "@/apiRequest/order";
import { handleErrorApi } from "@/lib/errors";
import { OrderFillRateQueryType, OrderSLAQueryType } from "@/schemas/analytics";
import { ApproveOrderBodyType, CreateOrderBodyType, RejectOrderBodyType } from "@/schemas/order";
import { QueryOrder } from "@/types/order";
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
            }
        })
    }
    const catalogList = (query: QueryOrder) => {
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
                return res.data
            }
        })
    }
    const reviewOrder = (id: string) => {
        return useQuery({
            queryKey: QUERY_KEY.orders.review(id),
            queryFn: async () => {
                const res = await orderRequest.reviewOrder(id)
                return res.data
            }
        })
    }

    const createOrder = useMutation({
        mutationFn: async (data: CreateOrderBodyType) => {
            const res = await orderRequest.createOrder(data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Order created successfully')
            queryClient.invalidateQueries({ queryKey: KEY.orders })
        },
    })

    const approveOrder = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: ApproveOrderBodyType }) => {
            const res = await orderRequest.approveOrder(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Order approved successfully')
            queryClient.invalidateQueries({ queryKey: KEY.orders })
        },
    })

    const rejectOrder = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: RejectOrderBodyType }) => {
            const res = await orderRequest.rejectOrder(id, data)
            return res.data
        },
        onSuccess: () => {
            toast.success('Order rejected successfully')
            queryClient.invalidateQueries({ queryKey: KEY.orders })
        },
    })

    const cancelOrder = useMutation({
        mutationFn: async (id: string) => {
            const res = await orderRequest.cancelOrder(id)
            return res.data
        },
        onSuccess: () => {
            toast.success('Order cancelled successfully')
            queryClient.invalidateQueries({ queryKey: KEY.orders })
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
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
        orderList,
        catalogList,
        myStoreOrderList,
        orderDetail,
        reviewOrder,
        fillRateAnalytics,
        slaPerformanceLeadTime
    }
}