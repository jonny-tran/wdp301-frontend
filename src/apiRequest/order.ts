import http from "@/lib/http";
import { OrderFillRateQueryType, OrderSLAQueryType } from "@/schemas/analytics";
import { ApproveOrderBodyType, CreateOrderBodyType, RejectOrderBodyType } from "@/schemas/order";
import { BaseResponePagination } from "@/types/base";
import { CatalogItem, Category, FillRateAnalytics, Order, OrderDetail, OrderReview, QueryCatelog, QueryOrder, SLAPerformanceLeadTime } from "@/types/order";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const orderRequest = {
    // GET /orders
    getOrderList: (query: QueryOrder) => http.get<BaseResponePagination<Order[]>>(ENDPOINT_CLIENT.ORDER_LIST, { query }),

    // GET /orders/catalog
    getCatalog: (query: QueryCatelog) => http.get<CatalogItem[]>(ENDPOINT_CLIENT.ORDER_CATALOG, { query }),

    getMyStoreOrder: (query: QueryOrder) => http.get<BaseResponePagination<Order[]>>(ENDPOINT_CLIENT.MY_STORE_ORDER, { query }),

    // GET /orders/:id
    getOrderDetail: (id: string) => http.get<OrderDetail>(ENDPOINT_CLIENT.ORDER_DETAIL(id)),
    // POST /orders

    createOrder: (data: CreateOrderBodyType) => http.post<Order>(ENDPOINT_CLIENT.CREATE_ORDER, data),

    // GET /orders/coordinator/:id/review
    reviewOrder: (id: string) => http.get<OrderReview>(ENDPOINT_CLIENT.ORDER_REVIEW(id)),

    // PATCH /orders/coordinator/:id/approve
    approveOrder: (id: string, data: ApproveOrderBodyType) => http.patch<Order>(ENDPOINT_CLIENT.APPROVE_ORDER(id), data),

    // PATCH /orders/coordinator/:id/reject
    rejectOrder: (id: string, data: RejectOrderBodyType) => http.patch<Order>(ENDPOINT_CLIENT.REJECT_ORDER(id), data),

    // PATCH /orders/franchise/:id/cancel
    cancelOrder: (id: string) => http.patch<Order>(ENDPOINT_CLIENT.CANCEL_ORDER(id), {}),

    // Analytics
    getFillRateAnalytics: (params: OrderFillRateQueryType) =>
        http.get<FillRateAnalytics>(ENDPOINT_CLIENT.ORDER_FILL_RATE, { query: params }),

    getSLAPerformanceLeadTime: (params: OrderSLAQueryType) =>
        http.get<SLAPerformanceLeadTime>(ENDPOINT_CLIENT.ORDER_SLA_LEAD_TIME, { query: params }),
};
