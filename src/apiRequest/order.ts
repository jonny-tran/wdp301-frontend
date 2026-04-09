import http from "@/lib/http";
import { OrderFillRateQueryType, OrderSLAQueryType } from "@/schemas/analytics";
import {
    ApproveOrderBodyType,
    CreateOrderBodyType,
    KitchenProductionResponseBodyType,
    RejectOrderBodyType,
    RequestProductionBodyType,
} from "@/schemas/order";
import { BaseResponsePagination } from "@/types/base";
import { parseApprovalSuggestionPayload } from "@/lib/order-approval-mapper";
import type {
    CoordinationBatchApproveBody,
    CoordinationBatchApproveResult,
    CoordinationInquiryBody,
    CoordinationInquiryResult,
    CoordinationSummary,
} from "@/types/coordination";
import {
    ApprovalSuggestion,
    CatalogItem,
    Category,
    FillRateAnalytics,
    Order,
    OrderDetail,
    OrderReview,
    QueryCatelog,
    QueryOrder,
    SLAPerformanceLeadTime,
} from "@/types/order";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const orderRequest = {
    // GET /orders
    getOrderList: (query: QueryOrder) => http.get<BaseResponsePagination<Order>>(ENDPOINT_CLIENT.ORDER_LIST, { query }),

    // GET /orders/catalog
    getCatalog: (query: QueryCatelog) => http.get<CatalogItem[]>(ENDPOINT_CLIENT.ORDER_CATALOG, { query }),

    getMyStoreOrder: (query: QueryOrder) => http.get<BaseResponsePagination<Order>>(ENDPOINT_CLIENT.MY_STORE_ORDER, { query }),

    // GET /orders/:id
    getOrderDetail: (id: string) => http.get<OrderDetail>(ENDPOINT_CLIENT.ORDER_DETAIL(id)),
    // POST /orders

    createOrder: (data: CreateOrderBodyType) => http.post<Order>(ENDPOINT_CLIENT.CREATE_ORDER, data),

    // GET /orders/coordinator/:id/review
    reviewOrder: (id: string) => http.get<OrderReview>(ENDPOINT_CLIENT.ORDER_REVIEW(id)),

    /** GET /orders/coordinator/:id/approval-suggestion — ATP + mốc HSD an toàn */
    getApprovalSuggestion: (id: string) => http.get<unknown>(ENDPOINT_CLIENT.ORDER_APPROVAL_SUGGESTION(id)),

    parseApprovalSuggestion: (raw: unknown): ApprovalSuggestion => parseApprovalSuggestionPayload(raw),

    // PATCH /orders/coordinator/:id/approve
    approveOrder: (id: string, data: ApproveOrderBodyType) => http.patch<Order>(ENDPOINT_CLIENT.APPROVE_ORDER(id), data),

    /** PATCH /orders/coordinator/:id/request-production — SC */
    requestProduction: (id: string, data: RequestProductionBodyType) =>
        http.patch<Order>(ENDPOINT_CLIENT.ORDER_REQUEST_PRODUCTION(id), data),

    // PATCH /orders/coordinator/:id/reject
    rejectOrder: (id: string, data: RejectOrderBodyType) => http.patch<Order>(ENDPOINT_CLIENT.REJECT_ORDER(id), data),

    // PATCH /orders/franchise/:id/cancel
    cancelOrder: (id: string) => http.patch<Order>(ENDPOINT_CLIENT.CANCEL_ORDER(id), {}),

    /** PATCH /orders/kitchen/:id/production-response — Bếp */
    kitchenProductionResponse: (id: string, data: KitchenProductionResponseBodyType) =>
        http.patch<Order>(ENDPOINT_CLIENT.ORDER_KITCHEN_PRODUCTION_RESPONSE(id), data),

    // Analytics
    getFillRateAnalytics: (params: OrderFillRateQueryType) =>
        http.get<FillRateAnalytics>(ENDPOINT_CLIENT.ORDER_FILL_RATE, { query: params }),

    getSLAPerformanceLeadTime: (params: OrderSLAQueryType) =>
        http.get<SLAPerformanceLeadTime>(ENDPOINT_CLIENT.ORDER_SLA_LEAD_TIME, { query: params }),

    // Coordination Hub (ORD-OPTIMIZE)
    getCoordinationSummary: (deliveryDate: string) =>
        http.get<CoordinationSummary>(ENDPOINT_CLIENT.ORDER_COORDINATION_SUMMARY, {
            query: { deliveryDate },
        }),

    createCoordinationInquiry: (body: CoordinationInquiryBody) =>
        http.post<CoordinationInquiryResult>(ENDPOINT_CLIENT.ORDER_COORDINATION_INQUIRY, body),

    batchApproveCoordination: (body: CoordinationBatchApproveBody) =>
        http.patch<CoordinationBatchApproveResult>(ENDPOINT_CLIENT.ORDER_COORDINATION_BATCH_APPROVE, body),
};
